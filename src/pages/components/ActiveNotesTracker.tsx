import React, { useEffect, useRef, useState } from 'react';
import { YIN } from 'pitchfinder';

type Props = {
  onNotesChange: (notes: Set<string>) => void;
  activeNoteDurationMs?: number;
};

const noteFromFrequency = (freq: number): string => {
  const A4 = 440;
  const notes = [
    'C', 'C#', 'D', 'D#', 'E', 'F',
    'F#', 'G', 'G#', 'A', 'A#', 'B',
  ];
  const semitones = Math.round(12 * Math.log2(freq / A4));
  const octave = Math.floor((semitones + 57) / 12);
  const note = notes[(semitones + 57) % 12];
  return `${note}${octave}`;
};

export const ActiveNotesTracker: React.FC<Props> = ({
    onNotesChange,
    activeNoteDurationMs = 300,
  }) => {
    const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const activeNotesRef = useRef<Map<string, number>>(new Map());
  
    const MIN_RMS = 0.005;
    const MIN_FREQ = 60; // Guitar frequencies start around here
    const MAX_FREQ = 1100; // Upper end of guitar range
  
    useEffect(() => {
      const pitchDetector = YIN();
  
      const updateActiveNotes = () => {
        const now = Date.now();
        for (const [note, timestamp] of activeNotesRef.current.entries()) {
          if (now - timestamp > activeNoteDurationMs) {
            activeNotesRef.current.delete(note);
          }
        }
        const updatedNotes = new Set(activeNotesRef.current.keys());
        setActiveNotes(updatedNotes);
        onNotesChange(updatedNotes);
      };
  
      const initMic = async () => {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const audioContext = new AudioContextClass();
          audioContextRef.current = audioContext;
  
          streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
          const micSource = audioContext.createMediaStreamSource(streamRef.current);
  
          const processor = audioContext.createScriptProcessor(2048, 1, 1);
          processorRef.current = processor;
  
          micSource.connect(processor);
          processor.connect(audioContext.destination);
  
          processor.onaudioprocess = (event) => {
            const inputBuffer = event.inputBuffer.getChannelData(0);
            const rms = Math.sqrt(inputBuffer.reduce((sum, x) => sum + x * x, 0) / inputBuffer.length);
            if (rms < MIN_RMS) return; // Ignore low volume noise
  
            const frequency = pitchDetector(inputBuffer);
            if (typeof frequency === 'number' && frequency > MIN_FREQ && frequency < MAX_FREQ) {
              const note = noteFromFrequency(frequency);
              activeNotesRef.current.set(note, Date.now());
              updateActiveNotes();
            }
          };
        } catch (err) {
          console.error('Error accessing microphone:', err);
        }
      };
  
      initMic();
  
      const interval = setInterval(updateActiveNotes, activeNoteDurationMs / 2);
  
      return () => {
        clearInterval(interval);
        processorRef.current?.disconnect();
        streamRef.current?.getTracks().forEach((track) => track.stop());
        audioContextRef.current?.close();
      };
    }, [onNotesChange, activeNoteDurationMs]);
  
    return null;
  };
  
export default ActiveNotesTracker;
