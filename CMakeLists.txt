cmake_minimum_required(VERSION 3.16)
project(Melomash LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Включите AUTOMOC явно
set(CMAKE_AUTOMOC ON)

find_package(Qt6 REQUIRED COMPONENTS Quick QuickControls2 Network Multimedia)

qt_add_executable(Melomash
    src/main.cpp
    src/services/SpotifyService.cpp
    src/services/YandexMusicService.cpp
)

# Обновленный qt_add_qml_module с явным указанием ресурсов
qt_add_qml_module(Melomash
    URI Melomash
    VERSION 1.0
    RESOURCE_PREFIX "/melomash"
    QML_FILES
        resources/qml/MainWindow.qml
        resources/qml/components/MelomashButton.qml
        resources/qml/components/TabBar.qml
        resources/qml/components/TrackItem.qml
        resources/qml/views/LibraryView.qml
        resources/qml/views/PlayerView.qml
        resources/qml/views/SearchView.qml
    SOURCES
        src/services/SpotifyService.h
        src/services/YandexMusicService.h
)

target_link_libraries(Melomash PRIVATE
    Qt6::Quick
    Qt6::QuickControls2
    Qt6::Network
    Qt6::Multimedia
)