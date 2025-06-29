#pragma once

#include "SpotifyService.h"
#include <QNetworkAccessManager>
#include <QDesktopServices>
#include <QJsonDocument>
#include <QTcpServer>

class CallbackServer;  // Предварительное объявление

class SpotifyService : public MusicService {
    Q_OBJECT
public:
    SpotifyService(QObject *parent = nullptr);
    void authenticate() override;
    void search(const QString &query) override;
    void playTrack(const QString &trackId) override;

private slots:
    void handleTokenReply();
    void handleSearchReply();
    void handlePlayReply();
    void handleCurrentTrackReply();

private:
    QNetworkAccessManager m_networkManager;
    QString m_accessToken;
    QString m_refreshToken;
    CallbackServer *m_callbackServer;

    void requestAccessToken(const QString &authCode);
    void refreshAccessToken();
    void parseSearchResults(const QJsonObject &json);
    void parseTrack(const QJsonObject &json);
};