import QtQuick 2.15
import QtQuick.Controls 2.15

pragma Singleton

QtObject {
    readonly property color primaryColor: Qt.rgba(0.1, 0.1, 0.2, 0.7)
    readonly property color accentColor: "#5e17eb"
    readonly property color textColor: "white"

    // Стиль для кнопок
    function createButtonStyle(control) {
        return `
            background: Rectangle {
                color: ${control.pressed ? "Qt.rgba(0.4, 0.4, 0.6, 0.5)" : "Qt.rgba(0.3, 0.3, 0.5, 0.3)"}
                border.color: "white"
                border.width: 1
                radius: 8
            }
        `;
    }
}