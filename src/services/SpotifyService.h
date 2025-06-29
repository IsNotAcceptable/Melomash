#pragma once

#include "MelomashService.h"

class SpotifyService : public MelomashService {
    Q_OBJECT
public:
    explicit SpotifyService(QObject *parent = nullptr);
    
    void authenticate() override;
    void search(const QString &query) override;
    void getLibrary() override;
    void playTrack(const QString &trackId) override;

private:
    QString m_accessToken;
    QString m_refreshToken;
    
    void refreshAccessToken();
    void parseSearchResults(const QJsonObject &json);
    void parseTrack(const QJsonObject &json);
};