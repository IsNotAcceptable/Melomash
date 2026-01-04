# Поиск Qt6 для Windows/Linux
find_package(Qt6 REQUIRED COMPONENTS
    Core
    Gui
    Widgets
    Quick
    Network
    Multimedia
)

if(NOT Qt6_FOUND)
    message(FATAL_ERROR "Qt6 not found! Install Qt6 via Qt Online Installer.")
endif()

# Подключение QML-модулей
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_CXX_STANDARD 17)