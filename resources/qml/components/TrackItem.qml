import QtQuick 2.15
import QtQuick.Controls 2.15

Item {
    id: root
    width: ListView.view.width
    height: 60
    
    property string trackName: "Track Name"
    property string artist: "Artist"
    property string album: "Album"
    property string cover: ""
    property string duration: "3:45"
    
    Rectangle {
        anchors.fill: parent
        anchors.margins: 5
        radius: 10
        color: "#1E1E1E"
        
        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 10
            anchors.rightMargin: 10
            spacing: 10
            
            Image {
                Layout.preferredWidth: 40
                Layout.preferredHeight: 40
                source: root.cover || "qrc:/icons/default_cover.png"
                fillMode: Image.PreserveAspectFit
                radius: 5
            }
            
            Column {
                Layout.fillWidth: true
                Layout.alignment: Qt.AlignVCenter
                spacing: 2
                
                Label {
                    text: root.trackName
                    font.pixelSize: 16
                    font.weight: Font.Medium
                    color: "#FFFFFF"
                    elide: Text.ElideRight
                    width: parent.width
                }
                
                Label {
                    text: root.artist + " • " + root.album
                    font.pixelSize: 12
                    color: "#B3B3B3"
                    elide: Text.ElideRight
                    width: parent.width
                }
            }
            
            Label {
                text: root.duration
                font.pixelSize: 14
                color: "#B3B3B3"
            }
        }
    }
}