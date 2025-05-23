import React, { useEffect, useMemo, useRef, useState } from 'react';
import PitchDetector from './PitchDetector';

const one_metallica = [
  { note: "E4", tab: "---------------------|---------------------|---------------------|----------------------|---------------------|---------------------|---------------------|-------------|-------------------------------------------------|-----------------------------------------------------------------------|----14-19----17p15-14-15----------|-------------------------------------------|" },
  { note: "B3", tab: "---------------------|---------------------|---------------------|----------------------|---------------------|---------------------|---------------------|-------------|----------------------3p2-----3p2-----3-3p2------|-----------------------------------------2h3-2---------2-3p2-----------|---15--------------------15-------|-------------------------------------------|" },
  { note: "G3", tab: "---------------------|---------------------|---------------------|---------------0------|---------------------|---------------------|---------------------|-------------|-----2--4b6r4-------------4-------2---------4----|-11p9---9p7---7p6---6p4---2--/4~~-----/4------------/4-------2-/4------|--16------------------------------|-7p6-7---9p7-9---11p9-11---/12-12-11-------|" },
  { note: "D3", tab: "----4-----0----------|----4-----0----------|----4-----0----------|----4-----0-----------|----4------0---------|----4-----0----------|----4-----0----------|-------------|-2h4---------------------------------------------|------0-----0-----0-----0----------------------------------------------|-17-------------------------------|-------------------------------------------|" },
  { note: "A2", tab: "-2-----2-------------|---------------------|-2-----2-------------|----------------------|-2-----2-------------|-0-----0-------------|---------------------|----2-----2--|-------------------------------------------------|-----------------------------------------------------------------------|----------------------------------|-------------------------------------------|" },
  { note: "E2", tab: "---------------------|-3-----3-------------|---------------------|-3-----3--------------|---------------------|---------------------|-3-----3-------------|-0-----2-----|-------------------------------------------------|-----------------------------------------------------------------------|----------------------------------|-------------------------------------------|" },
];

const chromaticScale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const TabHero: React.FC = () => {
  const noteLockedRef = useRef(false);
  const [targetNote, setTargetNote] = useState<string>("");
  const targetNoteRef = useRef<string>("");

  const getHzRangeForNote = (note: string, tolerance = 1.0): [number, number] => {
    const A4 = 440;
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    const match = note.match(/^([A-G]#?)(-?\d)$/);
    if (!match) throw new Error(`Invalid note format: ${note}`);

    const [, noteName, octaveStr] = match;
    const semitoneIndex = noteNames.indexOf(noteName);
    const octave = parseInt(octaveStr, 10);

    if (semitoneIndex === -1) throw new Error(`Invalid note name: ${noteName}`);

    const midiNote = (octave + 2) * 12 + semitoneIndex;
    const frequency = A4 * Math.pow(2, (midiNote - 69) / 12);

    return [frequency - tolerance, frequency + tolerance];
  };

  const tokenizeTabLine = (line: string): string[] => {
    const tokens: string[] = [];
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (/\d/.test(char) && /\d/.test(nextChar)) {
        tokens.push("-");
        tokens.push(char + nextChar);
        i += 2;
      } else {
        tokens.push(char);
        i++;
      }
    }

    return tokens;
  };

  const precomputedExpectedNotes = useMemo(() => {
    const result: { notes: string[]; tabIndex: number; hzRanges: Array<[number, number]> }[] = [];
    const tokenizedTabs = one_metallica.map(line => tokenizeTabLine(line.tab));
    const totalSteps = tokenizedTabs[0].length;

    let charIndex = 0;

    for (let step = 0; step < totalSteps; step++) {
      const notesAtStep: Array<{note: string, fret: string}> = [];

      one_metallica.forEach((line, stringIndex) => {
        const token = tokenizedTabs[stringIndex][step];
        const fret = /^\d+$/.test(token) ? parseInt(token, 10) : null;

        if (fret !== null) {
          const openNoteName = line.note.slice(0, -1);
          const openNoteOctave = parseInt(line.note.slice(-1));
          const baseIndex = chromaticScale.indexOf(openNoteName);
          const totalSemitone = baseIndex + fret;
          const newNoteName = chromaticScale[totalSemitone % 12];
          const newOctave = openNoteOctave + Math.floor(totalSemitone / 12);
          notesAtStep.push({note:`${newNoteName}${newOctave}`,fret:''+fret});
        }
      });

      const currentToken = tokenizedTabs[0][step];

      if (notesAtStep.length > 0) {
        const hzRanges = notesAtStep.map(note => getHzRangeForNote(note.note));
        const formattedNotesAtStep = notesAtStep.map(note => note.note);
        result.push({ notes: formattedNotesAtStep, tabIndex: step, hzRanges });
      }

      charIndex += currentToken.length;
    }

    return result;
  }, []);

  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const lastMatchedIndexRef = useRef<number>(-1);

  const currentNoteData = precomputedExpectedNotes[currentNoteIndex];
  const tabCursorIndex = currentNoteData?.tabIndex || 0;

  useEffect(() => {
    const next = precomputedExpectedNotes[currentNoteIndex];
    if (next && next.notes.length > 0) {
        setTargetNote(next.notes[0]); // Update targetNote state
        targetNoteRef.current = next.notes[0]; // Keep the ref in sync
    }
}, [currentNoteIndex, precomputedExpectedNotes]);

  const handleNextNote = () => {
    setCurrentNoteIndex(prev => {
      const next = prev + 1;
      lastMatchedIndexRef.current = next;
      return next;
    });
  };

  const [currentNote, setCurrentNote] = useState<string>("");

  const handleNoteChange = (note: any) => {
    if (noteLockedRef.current || note === "---" || note.note === currentNote) return;
  
    setCurrentNote(note);
  
    if (note === targetNoteRef.current) {
      noteLockedRef.current = true;
      handleNextNote();
      setTimeout(() => {
        noteLockedRef.current = false;
      }, 300);
    } else {
        const noteOctave = parseInt(note.slice(-1));
        const targetOctave = parseInt(targetNoteRef.current.slice(-1));
        const noteName = note.slice(0, -1);
        const targetNoteName = targetNoteRef.current.slice(0, -1);

        if (noteName === targetNoteName && Math.abs(noteOctave - targetOctave) === 1) {
            noteLockedRef.current = true;
            handleNextNote();
            setTimeout(() => {
              noteLockedRef.current = false;
            }, 300);
        }
    }
  };

  return (
    <div className='relative'>
      <div
        className='text-xl absolute left-[100px] top-[150px] cursor-pointer rounded bg-rose-300 px-12 py-2 text-white'
        onClick={handleNextNote}
      >
        Next Note
      </div>
      <PitchDetector onNoteChange={handleNoteChange}/>

      <div className='absolute top-[200px] w-full text-center text-2xl'>
        Next Note: {targetNote}
        {" --- "}
        Being Played: {currentNote}
      </div>

      <div id="string_names" className='absolute top-[228px] left-[40px]'>
        {one_metallica.map((note, index) => (
          <div key={index} className="text-2xl" style={{ marginTop: index === 0 ? 30 : "28px" }}>
            {note.note}
          </div>
        ))}
      </div>

      <div className='bg-[#442426] absolute mt-[240px] h-[360px] w-[90%] left-[5%] rounded-xl overflow-hidden'>
        <div className='bg-[#cac9c6] w-[20px] h-full'></div>
        <div className='absolute w-[50px] bg-[#778b8b] h-full top-0 left-[70px]'></div>

        {one_metallica.map((_, stringIndex) => (
          <div
            key={`static-line-${stringIndex}`}
            className='absolute w-full h-[7px] bg-[#cac9c6]'
            style={{ top: `${30 + stringIndex * 60}px` }}
          />
        ))}

        <div
          className='absolute top-0 left-0 transition-transform duration-300'
          style={{ transform: `translateX(-${(tabCursorIndex * 20) - 20}px)` }}
        >
          {one_metallica.map((stringData, stringIndex) => {
            const tokens = tokenizeTabLine(stringData.tab);
            return tokens.map((char, index) => {
              if (Math.abs(index - tabCursorIndex) > 70) return null;

              return (
                <div
                  key={`char-${stringIndex}-${index}`}
                  className='absolute'
                  style={{
                    top: `${30 + stringIndex * 60}px`,
                    left: `${60 + index * 20}px`,
                    width: '20px'
                  }}
                >
                  {!isNaN(parseInt(char)) ? (
                    <div id={`tab-index-${index}`} className={`absolute top-[-12px] w-[30px] h-[30px] text-center rounded-full pt-[2px] text-lg font-bold ${index < tabCursorIndex ? "exploding bg-green-300" : "bg-[#ffd4a2]"}`}>
                      {char}
                    </div>
                  ) : char === "|" ? (
                    <div className='w-[5px] h-[70px] absolute bg-[#cac9c6] top-[-30px]'></div>
                  ) : null}
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
};

export default TabHero;
