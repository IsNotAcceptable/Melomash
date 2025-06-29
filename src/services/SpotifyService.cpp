#include "SpotifyService.h"
#include <QDesktopServices>
#include <QJsonDocument>
#include <QJsonArray>
#include <QSettings>

SpotifyService::SpotifyService(QObject *parent) 
    : MusicService(parent) {
    setupOAuth();
}

void SpotifyService::setupOAuth() {
    m_oauth2 = new QOAuth2AuthorizationCodeFlow(this);
    m_oauth2->setAuthorizationUrl(QUrl("https://accounts.spotify.com/authorize"));
    m_oauth2->setAccessTokenUrl(QUrl("https://accounts.spotify.com/api/token"));
    m_oauth2->setClientIdentifier("YOUR_SPOTIFY_CLIENT_ID");
    m_oauth2->setClientIdentifierSharedKey("YOUR_SPOTIFY_CLIENT_SECRET");
    m_oauth2->setScope("user-library-read user-read-playback-state user-modify-playback-state");
    m_oauth2->setModifyParametersFunction([](QAbstractOAuth2::Stage stage, QMultiMap<QString, QVariant>* parameters) {
        if (stage == QAbstractOAuth2::Stage::RequestingAuthorization) {
            parameters->insert("show_dialog", "true");
        }
    });

    connect(m_oauth2, &QOAuth2AuthorizationCodeFlow::authorizeWithBrowser, [](const QUrl &url) {
        QDesktopServices::openUrl(url);
    });

    connect(m_oauth2, &QOAuth2AuthorizationCodeFlow::granted, this, [this]() {
        m_accessToken = m_oauth2->token();
        m_refreshToken = m_oauth2->refreshToken();
        emit authenticationChanged(true);
        qDebug() << "Spotify authentication successful";
    });

    connect(m_oauth2, &QOAuth2AuthorizationCodeFlow::error, this, [](const QString &error, const QString &description) {
        qWarning() << "Spotify OAuth error:" << error << description;
    });

    // Try to load saved tokens
    QSettings settings;
    m_accessToken = settings.value("spotify/accessToken").toString();
    m_refreshToken = settings.value("spotify/refreshToken").toString();
    
    if (!m_accessToken.isEmpty()) {
        emit authenticationChanged(true);
    }
}

void SpotifyService::authenticate() {
    if (m_oauth2) {
        m_oauth2->grant();
    }
}

void SpotifyService::search(const QString &query) {
    if (m_accessToken.isEmpty()) {
        qWarning() << "Not authenticated with Spotify";
        emit errorOccurred("Not authenticated");
        return;
    }

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
        } else if (reply->error() == QNetworkReply::AuthenticationRequiredError) {
            refreshAccessToken();
        } else {
            emit errorOccurred(reply->errorString());
        }
        reply->deleteLater();
    });
}

// Остальные методы остаются аналогичными, но с проверкой аутентификации