#pragma once
#include <QObject>
#include <QMediaPlayer>

class Player : public QObject {
    Q_OBJECT
public:
    explicit Player(QObject *parent = nullptr);
    void playTrack(const QUrl &url);
    void pause();
    void setVolume(int volume);

private:
    QMediaPlayer *m_mediaPlayer;
};