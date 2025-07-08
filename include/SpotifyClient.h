#pragma once
#include <QObject>
#include <QNetworkAccessManager>

class SpotifyClient : public QObject {
    Q_OBJECT
public:
    explicit SpotifyClient(QObject *parent = nullptr);
    void authenticate(const QString &clientId, const QString &clientSecret);
    void searchTracks(const QString &query);

signals:
    void searchResultsReceived(const QJsonArray &tracks);

private:
    QNetworkAccessManager *m_networkManager;
    QString m_accessToken;
};