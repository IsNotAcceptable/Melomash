import QtQuick 2.15
import QtQuick.Controls 2.15

Rectangle {
    id: nowPlayingBar
    height: 80
    color: Qt.rgba(0.15, 0.15, 0.25, 0.8)
    radius: 12

    // Текущий трек
    RowLayout {
        anchors.fill: parent
        spacing: 20
        anchors.margins: 15

        Image {
            id: albumArt
            width: 50
            height: 50
            source: "qrc:/resources/icons/default_album.png"
            layer.enabled: true
            layer.effect: OpacityMask {
                maskSource: Rectangle {
                    width: albumArt.width
                    height: albumArt.height
                    radius: 8
                }
            }
        }

        ColumnLayout {
            Label {
                text: "Название трека"
                color: "white"
                font.pixelSize: 16
            }
            Label {
                text: "Исполнитель"
                color: Qt.rgba(1, 1, 1, 0.7)
                font.pixelSize: 12
            }
        }

        // Кнопки управления
        RowLayout {
            Layout.alignment: Qt.AlignRight
            spacing: 10

            GlassButton {
                text: "⏮"
                width: 40
                onClicked: player.previous()
            }

            GlassButton {
                text: "⏸"
                width: 50
                onClicked: player.togglePlay()
            }

            GlassButton {
                text: "⏭"
                width: 40
                onClicked: player.next()
            }
        }
    }
}