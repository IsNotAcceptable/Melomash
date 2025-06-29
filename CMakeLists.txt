cmake_minimum_required(VERSION 3.16)
project(Melomash LANGUAGES CXX)  # Изменено название проекта

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt6 REQUIRED COMPONENTS Quick QuickControls2 Network Multimedia)

qt_add_executable(Melomash  # Изменено имя исполняемого файла
    src/main.cpp
    src/services/SpotifyService.cpp
    src/services/YandexMusicService.cpp
)

qt_add_qml_module(Melomash  # Изменено имя модуля
    URI Melomash  # Обновлен URI
    VERSION 1.0
    QML_FILES
        resources/qml/MainWindow.qml
        resources/qml/components/MelomashButton.qml
        resources/qml/components/TabBar.qml
        resources/qml/components/TrackItem.qml
        resources/qml/views/LibraryView.qml
        resources/qml/views/PlayerView.qml
        resources/qml/views/SearchView.qml
)

target_link_libraries(Melomash PRIVATE
    Qt6::Quick
    Qt6::QuickControls2
    Qt6::Network
    Qt6::Multimedia
)