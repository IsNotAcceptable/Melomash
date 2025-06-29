import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

Item {
    property string service
    
    ListView {
        id: listView
        anchors.fill: parent
        clip: true
        model: ListModel {
            id: libraryModel
        }
        
        delegate: IOSTrackItem {
            trackName: title
            artist: artist
            album: album
            cover: cover
            duration: duration
        }
        
        ScrollBar.vertical: ScrollBar {
            policy: ScrollBar.AsNeeded
        }
        
        header: ColumnLayout {
            width: listView.width
            spacing: 15
            
            Label {
                text: "Recently Played"
                font.pixelSize: 22
                font.weight: Font.Bold
                color: "#FFFFFF"
                Layout.leftMargin: 15
                Layout.topMargin: 10
            }
        }
    }
    
    Connections {
        target: service === "spotify" ? spotifyService : yandexMusicService
        function onLibraryReceived(items) {
            libraryModel.clear();
            for (var i = 0; i < items.length; i++) {
                libraryModel.append(items[i]);
            }
        }
    }
    
    Component.onCompleted: {
        if (service === "spotify") {
            spotifyService.getLibrary();
        } else {
            yandexMusicService.getLibrary();
        }
    }
}