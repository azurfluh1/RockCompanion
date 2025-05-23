import React, { useEffect, useRef } from "react";
import * as Pitchfinder from "pitchfinder";

interface TuningForkProps {
  setCurrentNote: ({ note, db }: { note: string; db: number }) => void;
}

const TuningFork: React.FC<TuningForkProps> = ({setCurrentNote }) => {
  const lastStableNote = useRef<string | null>(null);
  const lastTriggerTime = useRef<number>(0);

  useEffect(() => {
    const setupAudio = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      await audioContext.audioWorklet.addModule("/pitch-processor.js");
  
      const pitchDetector = Pitchfinder.YIN({ sampleRate: audioContext.sampleRate });
  
      const source = audioContext.createMediaStreamSource(stream);
      const node = new AudioWorkletNode(audioContext, "pitch-processor");
  
      node.port.onmessage = (event) => {
        const input = event.data;
        const max = Math.max(...input.map(Math.abs));
        const normalized = max > 0 ? input.map((v: any) => v / max) : input;
        const rms = Math.sqrt(normalized.reduce((sum: number, v: number) => sum + v * v, 0) / normalized.length);
        const decibels = 20 * Math.log10(rms);
        const now = performance.now();
  
        const MIN_RMS = 0.01;
        const COOLDOWN_MS = 150;
        const MIN_FREQ = 60;
        const MAX_FREQ = 1100;
  
        if (rms < MIN_RMS || now - lastTriggerTime.current < COOLDOWN_MS) return;
  
        const pitch = pitchDetector(normalized);
        if (!pitch || pitch < MIN_FREQ || pitch > MAX_FREQ) return;
  
        const noteInfo = frequencyToNoteInfo(pitch);
        if (Math.abs(noteInfo.cents) <= 30 && decibels > -8) {
          setCurrentNote({ note: noteInfo.name, db: decibels });
          lastStableNote.current = noteInfo.name;
          lastTriggerTime.current = now;
        }
      };
  
      source.connect(node);
    };
  
    setupAudio();
  }, []);

  const frequencyToNoteInfo = (freq: number): { name: string; cents: number } => {
    const A4 = 440;
    const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const exactMidi = 69 + 12 * Math.log2(freq / A4);
    const roundedMidi = Math.round(exactMidi);
    const cents = Math.floor((exactMidi - roundedMidi) * 100);
    const note = NOTES[roundedMidi % 12];
    const octave = Math.floor(roundedMidi / 12) - 1;
    return { name: `${note}${octave}`, cents };
  };

  return (
    <div className="relative">
      <div className="absolute left-[-370px] top-[-250px] text-2xl">
        {/* {currentNote ? `Current Note: ${currentNote}` : "Listening for pitch..."} */}
      </div>
    </div>
  );
};

export default TuningFork;