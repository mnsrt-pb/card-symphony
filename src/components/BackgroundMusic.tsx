import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

interface BackgroundMusicProps {
  track: string;
  isMuted: boolean;
}

export interface BackgroundMusicHandle {
  pause: () => void;
  play: () => void;
}

const BackgroundMusic = forwardRef<BackgroundMusicHandle, BackgroundMusicProps>(
  ({ track, isMuted }, ref) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      if (isMuted) {
        audio.pause();
      } else {
        const tryPlay = async () => {
          try {
            await audio.play();
          } catch {
            const resumeOnInteraction = () => {
              audio.play();
              window.removeEventListener("click", resumeOnInteraction);
            };
            window.addEventListener("click", resumeOnInteraction);
          }
        };
        tryPlay();
      }
    }, [track, isMuted]);

    // Expose play/pause methods to parent via ref
    useImperativeHandle(ref, () => ({
      pause: () => {
        audioRef.current?.pause();
      },
      play: () => {
        audioRef.current?.play().catch((err) => {
          console.warn("Playback failed:", err);
        });
      },
    }));

    return <audio ref={audioRef} src={track} loop autoPlay />;
  },
);

export default BackgroundMusic;
