import React, { useEffect, useRef } from "react";
import * as Pitchfinder from "pitchfinder";

interface TuningForkProps {
  setCurrentNote: Function;
  currentNote: string;
}

const TuningFork: React.FC<TuningForkProps> = ({ currentNote, setCurrentNote }) => {
  const lastStableNote = useRef<string>("");

  useEffect(() => {
    const setupAudio = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);

      const detectPitch = Pitchfinder.YIN({ sampleRate: audioContext.sampleRate });
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);

      analyser.fftSize = 4096; // Reasonable for performance/accuracy
      const buffer = new Float32Array(analyser.fftSize);

      const getPitch = () => {
        analyser.getFloatTimeDomainData(buffer);

        const rms = Math.sqrt(buffer.reduce((sum, val) => sum + val * val, 0) / buffer.length);
        const MIN_RMS = 0.01;
        const MIN_FREQ = 60;
        const MAX_FREQ = 1000;

        if (rms < MIN_RMS) {
          requestAnimationFrame(getPitch);
          return;
        }

        const pitch = detectPitch(buffer);

        if (pitch && pitch > MIN_FREQ && pitch < MAX_FREQ) {
          const noteInfo = frequencyToNoteInfo(pitch);

          // Only update if within 30 cents of center
          if (Math.abs(noteInfo.cents) <= 30 && noteInfo.name !== lastStableNote.current) {
            setCurrentNote(noteInfo.name);
            lastStableNote.current = noteInfo.name;
          }

          // Debugging (optional):
          // console.log(`Detected: ${pitch.toFixed(2)} Hz -> ${noteInfo.name} (${noteInfo.cents} cents)`);
        }

        requestAnimationFrame(getPitch);
      };

      getPitch();
    };

    setupAudio();
  }, []);

  function frequencyToNoteInfo(freq: number): { name: string; cents: number } {
    const A4 = 440;
    const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

    const exactMidi = 69 + 12 * Math.log2(freq / A4);
    const roundedMidi = Math.round(exactMidi);
    const cents = Math.floor((exactMidi - roundedMidi) * 100);

    const note = NOTES[roundedMidi % 12];
    const octave = Math.floor(roundedMidi / 12) - 1;

    return {
      name: `${note}${octave}`,
      cents,
    };
  }

  return (
    <div className="relative">
      <div className="absolute left-[-370px] top-[-250px] text-2xl">
        {currentNote ? `Current Note: ${currentNote}` : "Listening for pitch..."}
      </div>
    </div>
  );
};

export default TuningFork;