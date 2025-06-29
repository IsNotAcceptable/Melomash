import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

Item {
    property string service
    property var currentTrack: ({
        "title": "Unknown",
        "artist": "Unknown",
        "album": "Unknown",
        "cover": "",
        "duration": 0,
        "progress": 0
    })

    ColumnLayout {
        anchors.fill: parent
        spacing: 20

        // Album cover
        Rectangle {
            Layout.alignment: Qt.AlignHCenter
            width: 300
            height: 300
            radius: 10
            color: "#2A2A2A"

            Image {
                anchors.fill: parent
                anchors.margins: 2
                source: currentTrack.cover || "qrc:/icons/default_cover.png"
                fillMode: Image.PreserveAspectFit
                radius: 8
            }
        }

        // Track info
        ColumnLayout {
            Layout.alignment: Qt.AlignHCenter
            Layout.fillWidth: true
            spacing: 5

            Label {
                text: currentTrack.title
                font.pixelSize: 22
                font.weight: Font.Bold
                color: "#FFFFFF"
                Layout.alignment: Qt.AlignHCenter
                elide: Text.ElideRight
                maximumLineCount: 1
            }

            Label {
                text: currentTrack.artist + " • " + currentTrack.album
                font.pixelSize: 16
                color: "#B3B3B3"
                Layout.alignment: Qt.AlignHCenter
                elide: Text.ElideRight
                maximumLineCount: 1
            }
        }

        // Progress bar
        ColumnLayout {
            Layout.fillWidth: true
            Layout.leftMargin: 20
            Layout.rightMargin: 20
            spacing: 5

            Slider {
                id: progressSlider
                Layout.fillWidth: true
                from: 0
                to: currentTrack.duration
                value: currentTrack.progress
                live: false

                background: Rectangle {
                    x: progressSlider.leftPadding
                    y: progressSlider.topPadding + progressSlider.availableHeight / 2 - height / 2
                    implicitWidth: 200
                    implicitHeight: 4
                    width: progressSlider.availableWidth
                    height: implicitHeight
                    radius: 2
                    color: "#404040"

                    Rectangle {
                        width: progressSlider.visualPosition * parent.width
                        height: parent.height
                        color: "#FF375F"
                        radius: 2
                    }
                }

                handle: Rectangle {
                    x: progressSlider.leftPadding + progressSlider.visualPosition * (progressSlider.availableWidth - width)
                    y: progressSlider.topPadding + progressSlider.availableHeight / 2 - height / 2
                    implicitWidth: 16
                    implicitHeight: 16
                    radius: 8
                    color: progressSlider.pressed ? "#FF375F" : "#FFFFFF"
                    border.color: "#FF375F"
                }
            }

            RowLayout {
                Layout.fillWidth: true
                Label {
                    text: formatTime(currentTrack.progress)
                    font.pixelSize: 12
                    color: "#B3B3B3"
                }
                Item { Layout.fillWidth: true }
                Label {
                    text: formatTime(currentTrack.duration)
                    font.pixelSize: 12
                    color: "#B3B3B3"
                }
            }
        }

        // Controls
        RowLayout {
            Layout.alignment: Qt.AlignHCenter
            spacing: 30

            Button {
                icon.source: "qrc:/icons/shuffle.png"
                icon.color: "#B3B3B3"
                flat: true
            }

            Button {
                icon.source: "qrc:/icons/previous.png"
                icon.color: "#FFFFFF"
                flat: true
                icon.width: 32
                icon.height: 32
            }

            Button {
                icon.source: "qrc:/icons/play.png"
                icon.color: "#FFFFFF"
                flat: true
                icon.width: 48
                icon.height: 48
            }

            Button {
                icon.source: "qrc:/icons/next.png"
                icon.color: "#FFFFFF"
                flat: true
                icon.width: 32
                icon.height: 32
            }

            Button {
                icon.source: "qrc:/icons/repeat.png"
                icon.color: "#B3B3B3"
                flat: true
            }
        }

        // Volume control
        RowLayout {
            Layout.fillWidth: true
            Layout.leftMargin: 20
            Layout.rightMargin: 20
            spacing: 10

            Button {
                icon.source: "qrc:/icons/volume.png"
                icon.color: "#B3B3B3"
                flat: true
            }

            Slider {
                Layout.fillWidth: true
                from: 0
                to: 100
                value: 70

                background: Rectangle {
                    x: parent.leftPadding
                    y: parent.topPadding + parent.availableHeight / 2 - height / 2
                    implicitWidth: 200
                    implicitHeight: 4
                    width: parent.availableWidth
                    height: implicitHeight
                    radius: 2
                    color: "#404040"

                    Rectangle {
                        width: parent.visualPosition * parent.width
                        height: parent.height
                        color: "#FF375F"
                        radius: 2
                    }
                }
            }
        }
    }

    function formatTime(ms) {
        let seconds = Math.floor(ms / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }

    Connections {
        target: service === "spotify" ? spotifyService : yandexMusicService
        function onTrackChanged(track) {
            currentTrack = track;
        }
    }
}