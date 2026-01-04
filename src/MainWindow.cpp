#include "MainWindow.h"
#include <QQuickView>
#include <QQmlEngine>
#include <QQmlContext>

MainWindow::MainWindow(QWidget *parent) : QMainWindow(parent) {
    // Инициализация плеера и API-клиентов
    m_player = new Player(this);
    m_spotifyClient = new SpotifyClient(this);
    m_soundCloudClient = new SoundCloudClient(this);

    // Настройка QML-интерфейса
    QQuickView *qmlView = new QQuickView();
    qmlView->setSource(QUrl("qrc:/qml/Main.qml"));
    qmlView->engine()->rootContext()->setContextProperty("player", m_player);
    QWidget *container = QWidget::createWindowContainer(qmlView, this);
    setCentralWidget(container);
}

void MainWindow::onPlayClicked() {
    m_player->playTrack(QUrl("https://example.com/track.mp3"));
}