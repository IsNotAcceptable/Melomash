import QtQuick 2.15
import QtQuick.Controls 2.15

Button {
    id: control
    property color backgroundColor: "#6C5CE7"  // Фиолетовый цвет Melomash
    property color pressedColor: Qt.darker(backgroundColor, 1.2)
    property real radius: 8
    implicitHeight: 36
    padding: 12
    
    background: Rectangle {
        radius: control.radius
        color: control.down ? pressedColor : backgroundColor
        opacity: control.enabled ? 1 : 0.6
        
        Behavior on color {
            ColorAnimation { duration: 100 }
        }
    }
    
    contentItem: Text {
        text: control.text
        font.pixelSize: 14
        font.weight: Font.DemiBold
        color: "white"
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        elide: Text.ElideRight
    }
}