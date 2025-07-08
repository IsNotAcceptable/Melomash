import QtQuick 2.15
import QtQuick.Controls 2.15

Rectangle {
    id: trackItem
    width: ListView.view.width
    height: 60
    color: index % 2 === 0 ? Qt.rgba(0.1, 0.1, 0.2, 0.3) : "transparent"
    radius: 8

    RowLayout {
        anchors.fill: parent
        spacing: 15
        anchors.margins: 10

        Label {
            text: model.index + 1
            color: "white"
            Layout.preferredWidth: 30
        }

        ColumnLayout {
            Layout.fillWidth: true
            Label {
                text: model.title
                color: "white"
                elide: Text.ElideRight
            }
            Label {
                text: model.artist
                color: Qt.rgba(1, 1, 1, 0.6)
                font.pixelSize: 12
            }
        }

        Label {
            text: model.duration
            color: Qt.rgba(1, 1, 1, 0.5)
        }

        GlassButton {
            text: "▶"
            width: 30
            height: 30
            onClicked: player.playTrack(model.url)
        }
    }
}