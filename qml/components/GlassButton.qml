import QtQuick 2.15
import QtQuick.Controls 2.15

Button {
    id: control
    width: 120
    height: 40

    background: Rectangle {
        color: control.pressed ? Qt.rgba(0.4, 0.4, 0.6, 0.5) : Qt.rgba(0.3, 0.3, 0.5, 0.3)
        border.color: "white"
        border.width: 1
        radius: 8
    }

    contentItem: Text {
        text: control.text
        color: "white"
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
    }
}