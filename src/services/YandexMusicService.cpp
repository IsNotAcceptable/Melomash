#include "YandexMusicService.h"

YandexMusicService::YandexMusicService(QObject *parent) 
    : MelomashService(parent) {}

void YandexMusicService::authenticate() {
    // TODO: Реализация аутентификации
    emit authenticationComplete(false);
}

void YandexMusicService::search(const QString &query) {
    Q_UNUSED(query)
    // TODO: Реализация поиска
    emit searchResultsReceived(QJsonArray());
}

void YandexMusicService::getLibrary() {
    // TODO: Реализация получения библиотеки
    emit libraryReceived(QJsonArray());
}

void YandexMusicService::playTrack(const QString &trackId) {
    Q_UNUSED(trackId)
    // TODO: Реализация воспроизведения
}