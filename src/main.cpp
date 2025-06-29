#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include "services/SpotifyService.h"
#include "services/YandexMusicService.h"

int main(int argc, char *argv[]) {
    QGuiApplication app(argc, argv);
    app.setApplicationName("Melomash");
    app.setApplicationDisplayName("Melomash");
    app.setOrganizationName("Melomash");
    app.setOrganizationDomain("melomash.app");

    qmlRegisterType<SpotifyService>("Melomash.Services", 1, 0, "SpotifyService");
    qmlRegisterType<YandexMusicService>("Melomash.Services", 1, 0, "YandexMusicService");

    QQmlApplicationEngine engine;
    const QUrl url(u"qrc:/Melomash/qml/MainWindow.qml"_qs);
    QObject::connect(&engine, &QQmlApplicationEngine::objectCreated,
                     &app, [url](QObject *obj, const QUrl &objUrl) {
        if (!obj && url == objUrl)
            QCoreApplication::exit(-1);
    }, Qt::QueuedConnection);
    engine.load(url);

    return app.exec();
}