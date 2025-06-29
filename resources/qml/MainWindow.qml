import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15
import Melomash.Services 1.0

ApplicationWindow {
    id: root
    width: 375
    height: 812
    visible: true
    title: "Melomash"
    color: "#121212"

    property string currentService: "spotify"

    SpotifyService {
        id: spotifyService
        onAuthenticationChanged: {
            if (authenticated) {
                getLibrary()
            }
        }
    }
    
    YandexMusicService {
        id: yandexMusicService
    }

    StackView {
        id: stackView
        anchors.fill: parent
        initialItem: mainView
    }

    Component {
        id: mainView
        ColumnLayout {
            spacing: 0

            // Header with service selector
            Rectangle {
                Layout.fillWidth: true
                height: 60
                color: "transparent"

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 16
                    anchors.rightMargin: 16

                    Label {
                        text: "Melomash"
                        font.pixelSize: 28
                        font.bold: true
                        color: "white"
                    }

                    Item { Layout.fillWidth: true }

                    MelomashButton {
                        text: currentService === "spotify" ? "Spotify" : "Yandex"
                        onClicked: serviceMenu.open()
                        
                        Menu {
                            id: serviceMenu
                            MenuItem {
                                text: "Spotify"
                                onTriggered: {
                                    currentService = "spotify"
                                    if (!spotifyService.authenticated) {
                                        spotifyService.authenticate()
                                    }
                                }
                            }
                            MenuItem {
                                text: "Yandex Music"
                                onTriggered: {
                                    currentService = "yandex"
                                    if (!yandexMusicService.authenticated) {
                                        yandexMusicService.authenticate()
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Main content
            SwipeView {
                id: swipeView
                Layout.fillWidth: true
                Layout.fillHeight: true
                currentIndex: tabBar.currentIndex
                interactive: false

                LibraryView {
                    service: currentService
                    visible: SwipeView.isCurrentItem
                }

                SearchView {
                    service: currentService
                    visible: SwipeView.isCurrentItem
                }

                PlayerView {
                    service: currentService
                    visible: SwipeView.isCurrentItem
                }
            }

            // Tab bar
            MelomashTabBar {
                id: tabBar
                Layout.fillWidth: true
                currentIndex: swipeView.currentIndex
            }
        }
    }
}