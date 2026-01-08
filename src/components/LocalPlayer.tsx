import React, { useState, useEffect, useRef } from "react";
import {
  FolderOpen,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
  HardDrive,
  Volume2,
  ListMusic,
} from "lucide-react";
import { useTheme, themes } from "./../context/ThemeContext";

interface Track {
  name: string;
  path: string;
  url: string;
}

interface LocalPlayerProps {
  onPlayingChange?: (isPlaying: boolean) => void;
}

const LocalPlayer: React.FC<LocalPlayerProps> = ({ onPlayingChange }) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  const [folderPath, setFolderPath] = useState<string>(
    localStorage.getItem("melomash_local_path") || "",
  );
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    onPlayingChange?.(isPlaying);
  }, [isPlaying, onPlayingChange]);
  const [volume, setVolume] = useState(
    Number(localStorage.getItem("melomash_volume")) || 0.7,
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (folderPath) {
      loadTracks(folderPath);
    }
  }, [folderPath]);

  const loadTracks = async (path: string) => {
    try {
      // @ts-ignore
      const files = await window.electron.getAudioFiles(path);
      setTracks(files || []);
    } catch (e) {
      console.error("Ошибка при загрузке треков:", e);
      setTracks([]);
    }
  };

  const handleSelectFolder = async () => {
    // @ts-ignore
    const path = await window.electron.selectFolder();
    if (path) {
      setFolderPath(path);
      localStorage.setItem("melomash_local_path", path);
    }
  };

  const playTrack = (index: number) => {
    if (index < 0 || index >= tracks.length) return;
    setCurrentTrackIndex(index);
    setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.src = tracks[index].url;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(console.error);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || currentTrackIndex === -1) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (tracks.length === 0) return;
    playTrack((currentTrackIndex + 1) % tracks.length);
  };

  const prevTrack = () => {
    if (tracks.length === 0) return;
    playTrack((currentTrackIndex - 1 + tracks.length) % tracks.length);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    localStorage.setItem("melomash_volume", v.toString());
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  };

  return (
    <div
      className="flex flex-col h-full p-8 overflow-hidden select-none"
      style={{ color: currentTheme.text }}
    >
      <header className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 shadow-inner">
            <HardDrive size={32} className="opacity-80" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Локальная музыка
            </h1>
            <p className="opacity-40 text-xs mt-1 truncate max-w-md font-mono">
              {folderPath || "Папка не выбрана"}
            </p>
          </div>
        </div>
        <button
          onClick={handleSelectFolder}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium border hover:scale-105 active:scale-95"
          style={{
            backgroundColor: currentTheme.hover,
            borderColor: currentTheme.border,
          }}
        >
          <FolderOpen size={18} />
          <span>Выбрать директорию</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
        {tracks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-10 py-20">
            <ListMusic size={120} strokeWidth={1} />
            <p className="mt-4 text-xl font-medium">Здесь пока пусто</p>
          </div>
        ) : (
          tracks.map((track, index) => (
            <div
              key={track.path}
              onClick={() => playTrack(index)}
              className={`group p-3.5 rounded-xl cursor-pointer flex items-center gap-4 transition-all duration-200 ${
                currentTrackIndex === index
                  ? "bg-white/10 shadow-sm"
                  : "hover:bg-white/5 opacity-70 hover:opacity-100"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  currentTrackIndex === index
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-black/20 text-gray-500"
                }`}
              >
                {currentTrackIndex === index && isPlaying ? (
                  <div className="flex gap-0.5 items-end h-3">
                    <div
                      className="w-0.5 bg-current animate-bounce h-full"
                      style={{ animationDuration: "0.6s" }}
                    ></div>
                    <div
                      className="w-0.5 bg-current animate-bounce h-2/3"
                      style={{ animationDuration: "0.8s" }}
                    ></div>
                    <div
                      className="w-0.5 bg-current animate-bounce h-full"
                      style={{ animationDuration: "0.5s" }}
                    ></div>
                  </div>
                ) : (
                  <Music size={18} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <span
                  className={`truncate block font-medium ${currentTrackIndex === index ? "text-white" : ""}`}
                >
                  {track.name.replace(/\.[^/.]+$/, "")}
                </span>
                <span className="text-[10px] opacity-30 uppercase tracking-widest">
                  {track.name.split(".").pop()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {currentTrackIndex !== -1 && (
        <div
          className="mt-6 p-6 rounded-3xl border animate-in slide-in-from-bottom-4 duration-500 shadow-2xl"
          style={{
            backgroundColor: currentTheme.sidebar,
            borderColor: currentTheme.border,
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                <Music size={24} className="opacity-50" />
              </div>
              <div className="min-w-0">
                <p className="font-bold truncate text-sm">
                  {tracks[currentTrackIndex].name}
                </p>
                <p className="text-[10px] opacity-40 uppercase tracking-tighter">
                  Now Playing
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-6">
                <button
                  onClick={prevTrack}
                  className="opacity-60 hover:opacity-100 transition-opacity hover:scale-110 active:scale-90"
                >
                  <SkipBack size={24} fill="currentColor" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  {isPlaying ? (
                    <Pause fill="black" size={24} />
                  ) : (
                    <Play fill="black" size={24} className="ml-1" />
                  )}
                </button>

                <button
                  onClick={nextTrack}
                  className="opacity-60 hover:opacity-100 transition-opacity hover:scale-110 active:scale-90"
                >
                  <SkipForward size={24} fill="currentColor" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 justify-end max-w-[200px]">
              <Volume2 size={16} className="opacity-40" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 accent-white h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        onEnded={nextTrack}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${currentTheme.border};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${currentTheme.textSecondary};
        }
      `}</style>
    </div>
  );
};

export default LocalPlayer;
