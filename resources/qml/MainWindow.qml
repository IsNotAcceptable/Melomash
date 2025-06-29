import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Controls.Material 2.15
import QtQuick.Layouts 1.15
import Melomash.Services 1.0

ApplicationWindow {
    id: root
    width: 375
    height: 812
    visible: true
    title: "Melomash"
    Material.theme: Material.Dark
    Material.accent: "#FF375F"

    // iOS-style palette
    property color backgroundColor: "#121212"
    property color cardColor: "#1E1E1E"
    property color textColor: "#FFFFFF"
    property color secondaryTextColor: "#B3B3B3"

    property string currentService: "spotify"

    // Сервисы
    SpotifyService {
        id: spotifyService
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
        Item {
            ColumnLayout {
                anchors.fill: parent
                spacing: 0

                // Header
                Rectangle {
                    Layout.fillWidth: true
                    height: 60
                    color: root.backgroundColor

                    RowLayout {
                        anchors.fill: parent
                        anchors.leftMargin: 16
                        anchors.rightMargin: 16

                        Label {
                            text: "Music"
                            font.pixelSize: 28
                            font.weight: Font.Bold
                            color: root.textColor
                        }

                        Item { Layout.fillWidth: true }

                        MelomashButton {
                            text: {
                                if (root.currentService === "spotify") return "Spotify"
                                else return "Яндекс.Музыка"
                            }
                            onClicked: serviceMenu.open()
                            
                            Menu {
                                id: serviceMenu
                                MenuItem {
                                    text: "Spotify"
                                    onTriggered: {
                                        root.currentService = "spotify";
                                        spotifyService.authenticate();
                                    }
                                }
                                MenuItem {
                                    text: "Яндекс.Музыка"
                                    onTriggered: {
                                        root.currentService = "yandex";
                                        yandexMusicService.authenticate();
                                    }
                                }
                            }
                        }
                    }
                }

                // Content
                SwipeView {
                    id: swipeView
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    currentIndex: tabBar.currentIndex

                    LibraryView {
                        service: root.currentService
                    }

                    SearchView {
                        service: root.currentService
                    }

                    PlayerView {
                        service: root.currentService
                    }
                }

                // Tab bar (iOS style)
                TabBar {
                    id: tabBar
                    Layout.fillWidth: true
                    currentIndex: swipeView.currentIndex
                }
            }
        }
    }
}