#pragma once
#include "MelomashService.h"

class YandexMusicService : public MelomashService {
    Q_OBJECT
public:
    explicit YandexMusicService(QObject *parent = nullptr);
    
    void authenticate() override;
    void search(const QString &query) override;
    void getLibrary() override;
    void playTrack(const QString &trackId) override;

private:
    QString m_oauthToken;
};