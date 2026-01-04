cmake_minimum_required(VERSION 3.21)
project(Melomash VERSION 1.0 LANGUAGES CXX)

# Поиск Qt6
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
find_package(Qt6 REQUIRED COMPONENTS Core Quick Widgets Network Multimedia)

# QML-модули
set(QML_IMPORT_PATH "${CMAKE_SOURCE_DIR}/qml")

# Исходные файлы
add_executable(Melomash
  src/main.cpp
  src/MainWindow.cpp
  src/Player.cpp
  src/SpotifyClient.cpp
  src/SoundCloudClient.cpp
)

# Подключение Qt-модулей
target_link_libraries(Melomash PRIVATE
  Qt6::Core
  Qt6::Quick
  Qt6::Widgets
  Qt6::Network
  Qt6::Multimedia
)

# Ресурсы
qt_add_resources(Melomash "resources"
  PREFIX "/"
  FILES
    resources/icons/play.svg
    resources/fonts/Montserrat.ttf
)

# Установка QML-файлов
install(DIRECTORY qml DESTINATION .)