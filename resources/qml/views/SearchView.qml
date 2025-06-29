import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

Item {
    property string service
    
    ColumnLayout {
        anchors.fill: parent
        spacing: 0
        
        Rectangle {
            Layout.fillWidth: true
            Layout.topMargin: 10
            Layout.leftMargin: 15
            Layout.rightMargin: 15
            height: 50
            radius: 25
            color: "#2A2A2A"
            
            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 20
                anchors.rightMargin: 20
                
                Image {
                    source: "qrc:/icons/search.png"
                    Layout.preferredWidth: 20
                    Layout.preferredHeight: 20
                }
                
                TextField {
                    id: searchField
                    Layout.fillWidth: true
                    placeholderText: "Search for songs, artists or albums"
                    color: "#FFFFFF"
                    font.pixelSize: 16
                    background: Item {}
                    
                    onTextChanged: {
                        if (text.length > 2) {
                            if (service === "spotify") {
                                spotifyService.search(text);
                            } else {
                                yandexMusicService.search(text);
                            }
                        }
                    }
                }
            }
        }
        
        ListView {
            id: searchResults
            Layout.fillWidth: true
            Layout.fillHeight: true
            clip: true
            model: ListModel {
                id: searchModel
            }
            
            delegate: IOSTrackItem {
                trackName: title
                artist: artist
                album: album
                cover: cover
                duration: duration
                
                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        if (service === "spotify") {
                            spotifyService.playTrack(trackId);
                        } else {
                            yandexMusicService.playTrack(trackId);
                        }
                        stackView.push(playerView);
                    }
                }
            }
            
            ScrollBar.vertical: ScrollBar {
                policy: ScrollBar.AsNeeded
            }
        }
    }
    
    Connections {
        target: service === "spotify" ? spotifyService : yandexMusicService
        function onSearchResultsReceived(items) {
            searchModel.clear();
            for (var i = 0; i < items.length; i++) {
                searchModel.append(items[i]);
            }
        }
    }
}