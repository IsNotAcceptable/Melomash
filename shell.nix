{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_20
    nodePackages.npm
    git
    electron
  ];

  LD_LIBRARY_PATH = with pkgs; lib.makeLibraryPath [
    alsa-lib
    at-spi2-atk
    at-spi2-core
    wineWowPackages.stable mono
    atk
    cairo
    cups
    dbus
    expat
    fontconfig
    freetype
    gdk-pixbuf
    glib
    gtk3
    libGL
    libgbm
    xorg.libX11
    xorg.libXcomposite
    xorg.libXcursor
    xorg.libXdamage
    xorg.libXext
    xorg.libXfixes
    xorg.libXi
    xorg.libXrandr
    xorg.libXrender
    xorg.libXtst
    libdrm
    libnotify
    xorg.libxcb
    libxkbcommon
    mesa
    nspr
    nss
    pango
    systemd
    wayland
  ];

  shellHook = ''
    export ELECTRON_OVERRIDE_DIST_PATH="${pkgs.electron}/bin/electron"
    export PATH="${pkgs.electron}/bin:$PATH"

    export ELECTRON_FLAGS="--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage --disable-gpu-sandbox"

    if [ -z "$XDG_RUNTIME_DIR" ]; then
      export XDG_RUNTIME_DIR="/tmp/runtime-$USER"
      mkdir -p $XDG_RUNTIME_DIR
      chmod 700 $XDG_RUNTIME_DIR
    fi

    echo "-------------------------------------------------------"
    echo "Melomash Dev Environment"
    echo "-------------------------------------------------------"
  '';
}
