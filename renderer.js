const { ipcRenderer } = require("electron");
let audio = new Audio();
let hls = new Hls();

window.onload = async () => {
  const res = await ipcRenderer.invoke("check-auth");
  if (res.success) {
    document.getElementById("login-form").style.display = "none";
    renderPlaylist(res.tracks);
  }
};

async function authAndLoad() {
  const creds = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
    code: document.getElementById("otp-code").value || null,
  };
  const res = await ipcRenderer.invoke("vk-login", creds);
  if (res.success) {
    document.getElementById("login-form").style.display = "none";
    renderPlaylist(res.tracks);
  } else if (res.need2FA) {
    document.getElementById("2fa-area").style.display = "block";
  } else {
    alert(res.error);
  }
}

function renderPlaylist(tracks) {
  const container = document.getElementById("playlist");
  container.innerHTML = "";
  tracks.forEach((t) => {
    const div = document.createElement("div");
    div.className = "song-item";
    div.innerHTML = `<b>${t.artist}</b> - ${t.title}`;
    div.onclick = () => play(t.url, t.artist, t.title);
    container.appendChild(div);
  });
}

function play(url, artist, title) {
  if (!url) return alert("Нет доступа к аудио");

  document.getElementById("player-info").innerText = `${artist} - ${title}`;

  if (url.includes(".m3u8")) {
    if (Hls.isSupported()) {
      hls.destroy();
      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(audio);
      hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play());
    }
  } else {
    audio.src = url;
    audio.play();
  }
}
