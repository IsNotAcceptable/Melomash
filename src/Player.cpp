#include "Player.h"
#include <QAudioOutput>

Player::Player(QObject *parent) : QObject(parent) {
    m_mediaPlayer = new QMediaPlayer(this);
    QAudioOutput *audioOutput = new QAudioOutput(this);
    m_mediaPlayer->setAudioOutput(audioOutput);
}

void Player::playTrack(const QUrl &url) {
    m_mediaPlayer->setSource(url);
    m_mediaPlayer->play();
}