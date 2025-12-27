const { ipcRenderer } = require("electron");

async function authAndLoad() {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const otpInput = document.getElementById("otp-code");
  const status = document.getElementById("status");
  const playlist = document.getElementById("playlist");
  const loginForm = document.getElementById("login-form");
  const otpArea = document.getElementById("2fa-area");

  const credentials = {
    username: usernameInput.value.trim(),
    password: passwordInput.value.trim(),
    code: otpInput ? otpInput.value.trim() : null,
  };

  if (!credentials.username || !credentials.password) {
    alert("Введите логин и пароль!");
    return;
  }

  status.innerText = "Попытка входа...";

  const response = await ipcRenderer.invoke("vk-login", credentials);

  if (response && response.success) {
    status.innerText = `Успешно! Найдено треков: ${response.tracks.length}`;
    loginForm.style.display = "none";
    playlist.innerHTML = "";

    response.tracks.forEach((track) => {
      const div = document.createElement("div");
      div.className = "song-item";
      div.style =
        "padding: 12px; border-bottom: 1px solid #333; cursor: pointer; transition: 0.2s;";
      div.innerHTML = `<strong>${track.artist}</strong> — ${track.title}`;

      div.onmouseover = () => (div.style.backgroundColor = "#2a2a2a");
      div.onmouseout = () => (div.style.backgroundColor = "transparent");

      div.onclick = () => playTrack(track.url, track.artist, track.title);

      playlist.appendChild(div);
    });
  } else if (response && response.need2FA) {
    status.innerText = "Введите код из SMS или приложения!";
    if (otpArea) otpArea.style.display = "block";
  } else {
    status.innerText =
      "Ошибка: " + (response ? response.error : "Неизвестная ошибка");
  }
}

let currentAudio = null;

function playTrack(url, artist, title) {
  if (currentAudio) currentAudio.pause();

  currentAudio = new Audio(url);
  currentAudio.play();

  document.getElementById("status").innerText =
    `Сейчас играет: ${artist} - ${title}`;
}
