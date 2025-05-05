import React, { useEffect, useMemo, useState } from 'react';
import TuningFork from './tuning_fork';

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
  const [currentNote, setCurrentNote] = useState<string | null>("");
  const [lastMatchedNote, setLastMatchedNote] = useState<string | null>(null);

  // Parse a single line of tab into fret positions
  const parseTabLine = (line: string): (string | null)[] => {
    const result: (string | null)[] = [];
    for (let i = 0; i < line.length;) {
      const char = line[i];
      const nextChar = line[i + 1];
      if (!isNaN(parseInt(char)) && !isNaN(parseInt(nextChar))) {
        result.push(char + nextChar); // e.g., "11"
        i += 2;
      } else if (!isNaN(parseInt(char))) {
        result.push(char);
        i += 1;
      } else {
        result.push(null);
        i += 1;
      }
    }
    return result;
  };

  const parsedTab = useMemo(() => {
    return one_metallica.map(line => parseTabLine(line.tab));
  }, []);

  const notePositions = useMemo(() => {
    const maxLength = Math.max(...parsedTab.map(line => line.length));
    const positions: string[][] = [];

    for (let i = 0; i < maxLength; i++) {
      const column = parsedTab.map((line, stringIndex) => {
        const fret = line[i];
        if (fret !== null) {
          return `${one_metallica[stringIndex].note}-${fret}`;
        }
        return null;
      }).filter(Boolean) as string[];
      positions.push(column);
    }

    return positions;
  }, [parsedTab]);

  const nextNoteMap = useMemo(() => {
    const map: number[] = [];
    const totalSteps = notePositions.length;
    let next = -1;
    for (let i = totalSteps - 1; i >= 0; i--) {
      if (notePositions[i].length > 0) {
        next = i;
      }
      map[i] = next;
    }
    return map;
  }, [notePositions]);

  const firstNoteIndex = useMemo(() => {
    return notePositions.findIndex(step => step.length > 0);
  }, [notePositions]);

  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(firstNoteIndex);

  const targetTab = useMemo(() => notePositions[currentNoteIndex] || [], [notePositions, currentNoteIndex]);

  useEffect(() => {
    if (!currentNote || targetTab.length === 0) return;
  
    const targetNotes = targetTab.map(note => {
      const [openNote, fret] = note.split("-");
      const openNoteName = openNote.slice(0, -1);
      const openNoteOctave = parseInt(openNote.slice(-1));
      const fretNum = parseInt(fret);
      const baseIndex = chromaticScale.indexOf(openNoteName);
      const totalSemitone = baseIndex + fretNum;
      const newNoteName = chromaticScale[totalSemitone % 12];
      const newOctave = openNoteOctave + Math.floor((baseIndex + fretNum) / 12);
      return `${newNoteName}${newOctave}`;
    });
  
    if (targetNotes.includes(currentNote) && currentNote !== lastMatchedNote) {
      console.log("Correct note played:", currentNote);
      setLastMatchedNote(currentNote); // Update to avoid skipping
      handleNextNote();
    }
  }, [currentNote, targetTab, lastMatchedNote]);

  const handleNextNote = () => {
    const next = nextNoteMap[currentNoteIndex + 1] ?? currentNoteIndex + 1;
    setCurrentNoteIndex(next);
    setLastMatchedNote(null); // Allow the same note again
  };

  return (
    <div className='relative'>
      <div
        className='text-xl absolute left-[100px] top-[150px] cursor-pointer rounded bg-rose-300 px-12 py-2 text-white'
        onClick={handleNextNote}
      >
        Next Note
      </div>

      <TuningFork currentNote={currentNote} setCurrentNote={setCurrentNote} />

      <div className='absolute top-[200px] w-full text-center text-2xl'>
        Next Note: {targetTab.join(", ")}
      </div>

      <div id="string_names" className='absolute top-[232px] left-[40px]'>
        {one_metallica.map((note, index) => (
          <div key={index} className="text-2xl" style={{ marginTop: index === 0 ? 30 : "24px" }}>
            {note.note}
          </div>
        ))}
      </div>

      <div className='bg-[#442426] absolute mt-[240px] h-[360px] w-[90%] left-[5%] rounded-xl overflow-hidden'>
        {/* Fixed vertical stripe markers */}
        <div className='bg-[#cac9c6] w-[20px] h-full'></div>
        <div className='absolute w-[50px] bg-[#778b8b] h-full top-0 left-[70px]'></div>

        {/* Static strings */}
        {one_metallica.map((_, stringIndex) => (
          <div
            key={`static-line-${stringIndex}`}
            className='absolute w-full h-[7px] bg-[#cac9c6]'
            style={{ top: `${30 + stringIndex * 60}px` }}
          />
        ))}

        {/* Moving notes */}
        <div
          className='absolute top-0 left-0 transition-transform duration-300'
          style={{ transform: `translateX(-${(currentNoteIndex * 20) - 20}px)` }}
        >
          {parsedTab.map((parsedLine, stringIndex) =>
            parsedLine.map((char, index) => {
              if (Math.abs(index - currentNoteIndex) > 70) return null;

              return (
                <div
                  key={`char-${stringIndex}-${index}`}
                  className='absolute'
                  style={{
                    top: `${30 + stringIndex * 60}px`,
                    left: `${60 + index * 20}px`,
                    width: '20px',
                  }}
                >
                  {char && !isNaN(parseInt(char)) ? (
                    <div className={`absolute top-[-12px] w-[30px] h-[30px] text-center rounded-full pt-[2px] text-lg font-bold ${index < currentNoteIndex ? "exploding bg-green-300" : "bg-[#ffd4a2]"}`}>
                      {char}
                    </div>
                  ) : char === "|" ? (
                    <div className='w-[5px] h-[70px] absolute bg-[#cac9c6] top-[-30px]'></div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TabHero;
