#include "SpotifyClient.h"
#include <QNetworkReply>
#include <QOAuth2AuthorizationCodeFlow>

SpotifyClient::SpotifyClient(QObject *parent) : QObject(parent) {
    m_networkManager = new QNetworkAccessManager(this);
}

void SpotifyClient::authenticate(const QString &clientId, const QString &clientSecret) {
    // Реализация OAuth 2.0
    QOAuth2AuthorizationCodeFlow oauth2;
    oauth2.setAuthorizationUrl(QUrl("https://accounts.spotify.com/authorize"));
    oauth2.setAccessTokenUrl(QUrl("https://accounts.spotify.com/api/token"));
    oauth2.setClientIdentifier(clientId);
    oauth2.setClientIdentifierSharedKey(clientSecret);
}