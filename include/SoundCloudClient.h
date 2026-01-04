#pragma once
#include <QObject>
#include <QNetworkAccessManager>

class SoundCloudClient : public QObject {
    Q_OBJECT
public:
    explicit SoundCloudClient(QObject *parent = nullptr);
    void searchTracks(const QString &query);

signals:
    void searchResultsReceived(const QJsonArray &tracks);

private:
    QNetworkAccessManager *m_networkManager;
};