cmake_minimum_required(VERSION 3.16)
project(Melomash LANGUAGES CXX)

# Явно указываем путь к Qt6
set(Qt6_DIR "/usr/lib/cmake/Qt6")
find_package(Qt6 REQUIRED COMPONENTS Core Quick QuickControls2 Network Multimedia)

# Стандартный add_executable вместо qt_add_executable
add_executable(Melomash
    src/main.cpp
    src/services/SpotifyService.cpp
    src/services/YandexMusicService.cpp
)

# Подключаем модули Qt
target_link_libraries(Melomash PRIVATE
    Qt6::Core
    Qt6::Quick
    Qt6::QuickControls2
    Qt6::Network
    Qt6::Multimedia
)

# Для QML модулей используем qt_standard_project_setup()
qt_standard_project_setup()

# Вручную добавляем QML файлы
file(GLOB QML_FILES "resources/qml/*.qml")
qt_add_resources(Melomash "qml"
    PREFIX "/Melomash"
    FILES ${QML_FILES}
)