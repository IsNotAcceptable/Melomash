#include "SoundCloudClient.h"
#include <QNetworkRequest>

SoundCloudClient::SoundCloudClient(QObject *parent) : QObject(parent) {
    m_networkManager = new QNetworkAccessManager(this);
}

void SoundCloudClient::searchTracks(const QString &query) {
    QNetworkRequest request(QUrl("https://api-v2.soundcloud.com/search/tracks?q=" + query));
    QNetworkReply *reply = m_networkManager->get(request);
    connect(reply, &QNetworkReply::finished, [=]() {
        // Обработка ответа
    });
}