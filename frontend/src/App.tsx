import { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { Song } from './types/song';

export function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/songs')
        .then((res) => {
          if (!res.ok) throw new Error('Błąd pobierania utworów z API');
          return res.json();
        })
        .then((data: Song[]) => {
          setSongs(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setCurrentTime(0);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play();
    }, 50);
  };

  const handlePlayPause = (song: Song) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      playSong(song);
    }
  };

  const handleNext = () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex]);
  };

  const handlePrev = () => {
    if (!currentSong || songs.length === 0) return;
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      return;
    }
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(songs[prevIndex]);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatDuration = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
      <div className="min-h-screen bg-zinc-950 text-white pb-32">
        <header className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-full text-black">
            <Music className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">StreamFlow</h1>
        </header>

        <main className="max-w-6xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Polecane utwory</h2>

          {loading && <p className="text-zinc-400">Ładowanie biblioteki...</p>}
          {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
                Nie udało się połączyć z backendem: {error}. Upewnij się, że Spring Boot działa na porcie 8080.
              </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {songs.map((song) => {
              const isCurrent = currentSong?.id === song.id;
              return (
                  <div
                      key={song.id}
                      onClick={() => handlePlayPause(song)}
                      className="group bg-zinc-900/80 hover:bg-zinc-800/90 transition p-4 rounded-xl cursor-pointer border border-zinc-800/60"
                  >
                    <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-zinc-800">
                      <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <button
                          className={`absolute bottom-3 right-3 p-3 rounded-full bg-emerald-500 text-black shadow-lg transition transform ${
                              isCurrent && isPlaying
                                  ? 'opacity-100 translate-y-0'
                                  : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                          }`}
                      >
                        {isCurrent && isPlaying ? (
                            <Pause className="w-5 h-5 fill-current" />
                        ) : (
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>
                    </div>

                    <h3 className={`font-semibold truncate ${isCurrent ? 'text-emerald-400' : 'text-white'}`}>
                      {song.title}
                    </h3>
                    <div className="flex justify-between items-center text-sm text-zinc-400 mt-1">
                      <span className="truncate">{song.artistName}</span>
                      <span>{formatDuration(song.durationSeconds)}</span>
                    </div>
                  </div>
              );
            })}
          </div>
        </main>

        {currentSong && (
            <footer className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 px-6 py-3 flex items-center justify-between gap-4">
              {/* Lewa sekcja: Okładka i tytuł */}
              <div className="flex items-center gap-4 w-1/4 min-w-0">
                <img
                    src={currentSong.coverUrl}
                    alt={currentSong.title}
                    className="w-12 h-12 rounded object-cover shrink-0"
                />
                <div className="truncate">
                  <p className="font-medium text-sm truncate">{currentSong.title}</p>
                  <p className="text-xs text-zinc-400 truncate">{currentSong.artistName}</p>
                </div>
              </div>

              {/* Środkowa sekcja: Przyciski sterowania + pasek czasu */}
              <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-xl">
                <div className="flex items-center gap-5">
                  <button
                      onClick={handlePrev}
                      className="text-zinc-400 hover:text-white transition"
                      title="Poprzedni utwór"
                  >
                    <SkipBack className="w-5 h-5 fill-current" />
                  </button>

                  <button
                      onClick={() => handlePlayPause(currentSong)}
                      className="bg-white text-black p-2.5 rounded-full hover:scale-105 transition"
                      title={isPlaying ? 'Pauza' : 'Odtwórz'}
                  >
                    {isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                    ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                      onClick={handleNext}
                      className="text-zinc-400 hover:text-white transition"
                      title="Następny utwór"
                  >
                    <SkipForward className="w-5 h-5 fill-current" />
                  </button>
                </div>

                <div className="flex items-center gap-2.5 w-full text-xs text-zinc-400">
                  <span className="w-10 text-right tabular-nums">{formatDuration(currentTime)}</span>
                  <input
                      type="range"
                      min={0}
                      max={duration || currentSong.durationSeconds}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <span className="w-10 tabular-nums">
                {formatDuration(duration || currentSong.durationSeconds)}
              </span>
                </div>
              </div>

              {/* Prawa sekcja: Głośność */}
              <div className="flex items-center justify-end gap-2.5 w-1/4">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-zinc-400 hover:text-white transition"
                    title={isMuted ? 'Włącz dźwięk' : 'Wycisz'}
                >
                  {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                  ) : (
                      <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setIsMuted(false);
                      setVolume(Number(e.target.value));
                    }}
                    className="w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <audio
                  ref={audioRef}
                  src={currentSong.audioUrl}
                  onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                  onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                  onEnded={handleNext}
              />
            </footer>
        )}
      </div>
  );
}

export default App;