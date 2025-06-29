#pragma once
#include <QObject>
#include <QNetworkAccessManager>
#include <QJsonObject>

class MelomashService : public QObject {
    Q_OBJECT
public:
    explicit MelomashService(QObject *parent = nullptr) : QObject(parent) {}
    virtual ~MelomashService() = default;

    virtual void authenticate() = 0;
    virtual void search(const QString &query) = 0;
    virtual void getLibrary() = 0;
    virtual void playTrack(const QString &trackId) = 0;

signals:
    void authenticationComplete(bool success);
    void searchResultsReceived(const QJsonArray &results);
    void libraryReceived(const QJsonArray &items);
    void trackChanged(const QJsonObject &track);
    void errorOccurred(const QString &message);

protected:
    QNetworkAccessManager m_networkManager;
};