#pragma once

#include "MusicService.h"
#include <QtCore>
#include <QtNetwork>
#include <QtOAuth2>

class SpotifyService : public MusicService {
    Q_OBJECT
    Q_PROPERTY(bool authenticated READ isAuthenticated NOTIFY authenticationChanged)
public:
    explicit SpotifyService(QObject *parent = nullptr);
    
    bool isAuthenticated() const { return !m_accessToken.isEmpty(); }
    
    void authenticate() override;
    void search(const QString &query) override;
    void getLibrary() override;
    void playTrack(const QString &trackId) override;

private:
    QString m_accessToken;
    QString m_refreshToken;
    QOAuth2AuthorizationCodeFlow *m_oauth2 = nullptr;
    
    void setupOAuth();
    void refreshAccessToken();
    void parseSearchResults(const QJsonObject &json);
    void parseTrack(const QJsonObject &json);

signals:
    void authenticationChanged(bool authenticated);
};

Q_DECLARE_METATYPE(SpotifyService*)