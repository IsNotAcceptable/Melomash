#include "MainWindow.h"
#include <QApplication>

int main(int argc, char *argv[]) {
  QApplication app(argc, argv);
  app.setStyle("Fusion");  // Для стилизации Qt Widgets

  MainWindow window;
  window.show();
  return app.exec();
}