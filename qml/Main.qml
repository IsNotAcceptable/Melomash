import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

ApplicationWindow {
    visible: true
    width: 1280
    height: 720
    color: "transparent"
    title: "Melomash"

    // Стеклянный фон
    Rectangle {
        anchors.fill: parent
        color: Qt.rgba(0.1, 0.1, 0.2, 0.7)
        radius: 12
        border.width: 1
        border.color: Qt.rgba(1, 1, 1, 0.2)

        layer.enabled: true
        layer.effect: ShaderEffect {
            property real blur: 5.0
            fragmentShader: "
                uniform lowp float qt_Opacity;
                uniform lowp float blur;
                varying highp vec2 qt_TexCoord0;
                void main() {
                    gl_FragColor = vec4(0.1, 0.1, 0.2, 0.7) * qt_Opacity;
                }"
        }
    }

    // Кнопка воспроизведения
    GlassButton {
        anchors.centerIn: parent
        text: "Play"
        onClicked: player.playTrack("https://example.com/track.mp3")
    }
}