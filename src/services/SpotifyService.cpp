#include "SpotifyService.h"
#include <QOAuth2AuthorizationCodeFlow>
#include <QDesktopServices>
#include <QJsonDocument>
#include <QJsonArray>

SpotifyService::SpotifyService(QObject *parent) 
    : MusicService(parent) {}

void SpotifyService::authenticate() {
    auto *oauth2 = new QOAuth2AuthorizationCodeFlow(this);
    oauth2->setAuthorizationUrl(QUrl("https://accounts.spotify.com/authorize"));
    oauth2->setAccessTokenUrl(QUrl("https://accounts.spotify.com/api/token"));
    oauth2->setClientIdentifier("YOUR_SPOTIFY_CLIENT_ID");
    oauth2->setClientIdentifierSharedKey("YOUR_SPOTIFY_CLIENT_SECRET");
    oauth2->setScope("user-library-read user-read-playback-state user-modify-playback-state");
    
    connect(oauth2, &QOAuth2AuthorizationCodeFlow::authorizeWithBrowser, 
            [](const QUrl &url) {
        QDesktopServices::openUrl(url);
    });
    
    connect(oauth2, &QOAuth2AuthorizationCodeFlow::granted, [this, oauth2]() {
        m_accessToken = oauth2->token();
        m_refreshToken = oauth2->refreshToken();
        emit authenticationComplete(true);
        oauth2->deleteLater();
    });
    
    oauth2->grant();
}

void SpotifyService::search(const QString &query) {
    QUrl url("https://api.spotify.com/v1/search");
    QUrlQuery urlQuery;
    urlQuery.addQueryItem("q", query);
    urlQuery.addQueryItem("type", "track");
    urlQuery.addQueryItem("limit", "20");
    url.setQuery(urlQuery);
    
    QNetworkRequest request(url);
    request.setRawHeader("Authorization", QString("Bearer %1").arg(m_accessToken).toUtf8());
    
    auto *reply = m_networkManager.get(request);
    connect(reply, &QNetworkReply::finished, [this, reply]() {
        if (reply->error() == QNetworkReply::NoError) {
            auto json = QJsonDocument::fromJson(reply->readAll()).object();
            parseSearchResults(json);
        } else {
            emit errorOccurred(reply->errorString());
        }
        reply->deleteLater();
    });
}

void SpotifyService::parseSearchResults(const QJsonObject &json) {
    QJsonArray tracks = json.value("tracks").toObject().value("items").toArray();
    QJsonArray results;
    
    for (const auto &track : tracks) {
        QJsonObject trackObj = track.toObject();
        QJsonObject item;
        item["title"] = trackObj.value("name").toString();
        item["artist"] = trackObj.value("artists").toArray()[0].toObject().value("name").toString();
        item["album"] = trackObj.value("album").toObject().value("name").toString();
        item["cover"] = trackObj.value("album").toObject().value("images").toArray()[0].toObject().value("url").toString();
        item["duration"] = trackObj.value("duration_ms").toInt();
        item["trackId"] = trackObj.value("id").toString();
        results.append(item);
    }
    
    emit searchResultsReceived(results);
}

void SpotifyService::playTrack(const QString &trackId) {
    QUrl url("https://api.spotify.com/v1/me/player/play");
    QNetworkRequest request(url);
    request.setRawHeader("Authorization", QString("Bearer %1").arg(m_accessToken).toUtf8());
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    
    QJsonObject body;
    body["uris"] = QJsonArray::fromStringList({"spotify:track:" + trackId});
    
    auto *reply = m_networkManager.put(request, QJsonDocument(body).toJson());
    connect(reply, &QNetworkReply::finished, [this, reply, trackId]() {
        if (reply->error() == QNetworkReply::NoError) {
            getCurrentTrack();
        } else {
            emit errorOccurred(reply->errorString());
        }
        reply->deleteLater();
    });
}

void SpotifyService::getCurrentTrack() {
    QUrl url("https://api.spotify.com/v1/me/player/currently-playing");
    QNetworkRequest request(url);
    request.setRawHeader("Authorization", QString("Bearer %1").arg(m_accessToken).toUtf8());
    
    auto *reply = m_networkManager.get(request);
    connect(reply, &QNetworkReply::finished, [this, reply]() {
        if (reply->error() == QNetworkReply::NoError) {
            auto json = QJsonDocument::fromJson(reply->readAll()).object();
            parseTrack(json);
        }
        reply->deleteLater();
    });
}

void SpotifyService::parseTrack(const QJsonObject &json) {
    QJsonObject track;
    track["title"] = json.value("item").toObject().value("name").toString();
    track["artist"] = json.value("item").toObject().value("artists").toArray()[0].toObject().value("name").toString();
    track["album"] = json.value("item").toObject().value("album").toObject().value("name").toString();
    track["cover"] = json.value("item").toObject().value("album").toObject().value("images").toArray()[0].toObject().value("url").toString();
    track["duration"] = json.value("item").toObject().value("duration_ms").toInt();
    track["progress"] = json.value("progress_ms").toInt();
    
    emit trackChanged(track);
}