import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Controls.Material 2.15
import QtQuick.Layouts 1.15

ApplicationWindow {
    id: root
    width: 375
    height: 812
    visible: true
    title: "Music Service"
    Material.theme: Material.Dark
    Material.accent: "#FF375F"

    // iOS-style palette
    property color backgroundColor: "#121212"
    property color cardColor: "#1E1E1E"
    property color textColor: "#FFFFFF"
    property color secondaryTextColor: "#B3B3B3"

    // Состояние текущего сервиса
    property string currentService: "spotify" // "apple", "youtube"

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

                        Button {
                            text: {
                                if (root.currentService === "spotify") return "Spotify"
                                else if (root.currentService === "apple") return "Apple Music"
                                else return "YouTube Music"
                            }
                            flat: true
                            onClicked: serviceMenu.open()
                            
                            Menu {
                                id: serviceMenu
                                MenuItem {
                                    text: "Spotify"
                                    onTriggered: root.currentService = "spotify"
                                }
                                MenuItem {
                                    text: "Apple Music"
                                    onTriggered: root.currentService = "apple"
                                }
                                MenuItem {
                                    text: "YouTube Music"
                                    onTriggered: root.currentService = "youtube"
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
                    height: 60
                    currentIndex: swipeView.currentIndex
                    position: TabBar.Footer
                    background: Rectangle {
                        color: root.cardColor
                    }

                    TabButton {
                        icon.source: "qrc:/icons/library.png"
                        icon.color: tabBar.currentIndex === 0 ? root.Material.accent : root.secondaryTextColor
                    }
                    TabButton {
                        icon.source: "qrc:/icons/search.png"
                        icon.color: tabBar.currentIndex === 1 ? root.Material.accent : root.secondaryTextColor
                    }
                    TabButton {
                        icon.source: "qrc:/icons/player.png"
                        icon.color: tabBar.currentIndex === 2 ? root.Material.accent : root.secondaryTextColor
                    }
                }
            }
        }
    }
}