cmake_minimum_required(VERSION 3.16)
project(MusicService LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt6 REQUIRED COMPONENTS Quick QuickControls2 Network Multimedia)

qt_add_executable(MusicService
    src/main.cpp
)

qt_add_qml_module(MusicService
    URI MusicService
    VERSION 1.0
    QML_FILES
        resources/qml/main.qml
        resources/qml/views/PlayerView.qml
        resources/qml/views/LibraryView.qml
        resources/qml/components/IOSButton.qml
)

target_link_libraries(MusicService PRIVATE
    Qt6::Quick
    Qt6::QuickControls2
    Qt6::Network
    Qt6::Multimedia
)