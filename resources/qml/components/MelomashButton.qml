import QtQuick 2.15
import QtQuick.Controls 2.15

Button {
    id: control
    property color backgroundColor: "#FF375F"
    property color pressedColor: Qt.darker(backgroundColor, 1.2)
    property real radius: 10
    implicitHeight: 40
    
    background: Rectangle {
        implicitWidth: 100
        implicitHeight: control.implicitHeight
        radius: control.radius
        color: control.down ? pressedColor : backgroundColor
        
        Behavior on color {
            ColorAnimation { duration: 100 }
        }
    }
    
    contentItem: Text {
        text: control.text
        font.pixelSize: 16
        font.weight: Font.Medium
        color: "white"
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
    }
}