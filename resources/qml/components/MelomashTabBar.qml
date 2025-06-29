import QtQuick 2.15
import QtQuick.Controls 2.15

TabBar {
    id: control
    height: 60
    position: TabBar.Footer
    
    background: Rectangle {
        color: "#1E1E1E"
    }

    TabButton {
        icon.source: "qrc:/icons/library.png"
        icon.color: control.currentIndex === 0 ? "#FF375F" : "#B3B3B3"
        icon.width: 24
        icon.height: 24
    }
    
    TabButton {
        icon.source: "qrc:/icons/search.png"
        icon.color: control.currentIndex === 1 ? "#FF375F" : "#B3B3B3"
        icon.width: 24
        icon.height: 24
    }
    
    TabButton {
        icon.source: "qrc:/icons/player.png"
        icon.color: control.currentIndex === 2 ? "#FF375F" : "#B3B3B3"
        icon.width: 24
        icon.height: 24
    }
}