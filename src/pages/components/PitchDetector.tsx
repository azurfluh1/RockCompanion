import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    ml5: any;
  }
}

type PitchDetectorProps = {
    onNoteChange: (note: string) => void ;
}

export const PitchDetector: React.FC<PitchDetectorProps> = ({
    onNoteChange
  }) => {
    const streamRef = useRef<MediaStream | null>(null);
    const pitchRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        const init = async () => {
            const AudioContextClass =
                window.AudioContext || (window as any).webkitAudioContext;
            const audioContext = new AudioContextClass();
            audioContextRef.current = audioContext;

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;

                // Wait for ml5 to load
                const waitForML5 = setInterval(() => {
                    if (window.ml5) {
                        clearInterval(waitForML5);
                        startPitchDetection();
                    }
                }, 100);
            } catch (err) {
                console.error('Microphone access error:', err);
            }
        };

        init();
    }, []);

    const startPitchDetection = () => {
        if (!streamRef.current || !audioContextRef.current) return;

        window.ml5.pitchDetection(
            '/models/pitchDetection/crepe', // Make sure you have this folder in /public
            audioContextRef.current,
            streamRef.current,
            modelLoaded
        );
    };

    const modelLoaded = (err: any, model: any) => {
        if (err) {
            console.error('Model load error:', err);
            return;
        }
        pitchRef.current = model;
        getPitch();
    };

    const getPitch = () => {
        if (!pitchRef.current) return;

        pitchRef.current.getPitch((err: any, frequency: number) => {
            if (frequency && !err) {
                const detectedNote = frequencyToNote(frequency);
                onNoteChange(detectedNote);
            } else {
                onNoteChange('---');
            }
            requestAnimationFrame(getPitch);
        });
    };

    const frequencyToNote = (freq: number) => {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const midi = Math.round(69 + 12 * Math.log2(freq / 440));
        const noteName = noteNames[midi % 12];
        const octave = Math.floor(midi / 12) - 1;
        return `${noteName}${octave}`;
    };

    return (<></>);
}

export default PitchDetector;
