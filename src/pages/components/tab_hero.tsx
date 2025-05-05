import React, { useEffect, useMemo, useRef, useState } from 'react';
import TuningFork from './tuning_fork';

const one_metallica = [
  { note: "E3", tab: "---------------------|---------------------|---------------------|----------------------|---------------------|---------------------|---------------------|-------------|-------------------------------------------------|-----------------------------------------------------------------------|----14-19----17p15-14-15----------|-------------------------------------------|" },
  { note: "B2", tab: "---------------------|---------------------|---------------------|----------------------|---------------------|---------------------|---------------------|-------------|----------------------3p2-----3p2-----3-3p2------|-----------------------------------------2h3-2---------2-3p2-----------|---15--------------------15-------|-------------------------------------------|" },
  { note: "G2", tab: "---------------------|---------------------|---------------------|---------------0------|---------------------|---------------------|---------------------|-------------|-----2--4b6r4-------------4-------2---------4----|-11p9---9p7---7p6---6p4---2--/4~~-----/4------------/4-------2-/4------|--16------------------------------|-7p6-7---9p7-9---11p9-11---/12-12-11-------|" },
  { note: "D2", tab: "----4-----0----------|----4-----0----------|----4-----0----------|----4-----0-----------|----4------0---------|----4-----0----------|----4-----0----------|-------------|-2h4---------------------------------------------|------0-----0-----0-----0----------------------------------------------|-17-------------------------------|-------------------------------------------|" },
  { note: "A1", tab: "-2-----2-------------|---------------------|-2-----2-------------|----------------------|-2-----2-------------|-0-----0-------------|---------------------|----2-----2--|-------------------------------------------------|-----------------------------------------------------------------------|----------------------------------|-------------------------------------------|" },
  { note: "E1", tab: "---------------------|-3-----3-------------|---------------------|-3-----3--------------|---------------------|---------------------|-3-----3-------------|-0-----2-----|-------------------------------------------------|-----------------------------------------------------------------------|----------------------------------|-------------------------------------------|" },
];

const chromaticScale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const TabHero: React.FC = () => {
  const [currentNote, setCurrentNote] = useState<string | null>("");
  const firstNoteIndex = useMemo(() => {
    return one_metallica[0].tab.split("").findIndex((_, index) =>
      one_metallica.some(line => !isNaN(parseInt(line.tab[index])))
    );
  }, []);
  
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(firstNoteIndex);
  const didMountRef = useRef(false);

  // Precompute note map
  const notePositions = useMemo(() => {
    return one_metallica[0].tab.split("").map((_, index) => {
      return one_metallica
        .map(line => {
          const char = line.tab[index];
          return !isNaN(parseInt(char)) ? `${line.note}-${char}` : null;
        })
        .filter(Boolean) as string[];
    });
  }, []);

  // Precompute next note index map
  const nextNoteMap = useMemo(() => {
    const map: number[] = [];
    const totalLength = one_metallica[0].tab.length;
    let next = -1;
    for (let i = totalLength - 1; i >= 0; i--) {
      const hasNote = one_metallica.some(line => !isNaN(parseInt(line.tab[i])));
      if (hasNote) next = i;
      map[i] = next;
    }
    return map;
  }, []);

  // Derive current target tab
  const targetTab = useMemo(() => notePositions[currentNoteIndex] || [], [notePositions, currentNoteIndex]);

  // Respond to correct note
  useEffect(() => {
    if (!currentNote || targetTab.length === 0) return;

    const targetNotes = targetTab.map(note => {
      const [noteName, fret] = note.split("-");
      const base = noteName.replace(/[0-9]/g, '');
      const fretNum = parseInt(fret);
      const baseIndex = chromaticScale.indexOf(base);
      return chromaticScale[(baseIndex + fretNum) % 12];
    });

    const played = currentNote.replace(/[0-9]/g, '');
    if (targetNotes.includes(played)) {
      console.log("Correct note played:", currentNote);
      handleNextNote();
    }
  }, [currentNote, targetTab]);

  const handleNextNote = () => {
    const next = nextNoteMap[currentNoteIndex + 1] ?? currentNoteIndex + 1;
    setCurrentNoteIndex(next);
  };

  return (
    <div className='relative'>
      <div
        className='text-xl absolute left-[100px] top-[150px] cursor-pointer rounded bg-rose-300 px-12 py-2 text-white'
        onClick={handleNextNote}
      >
        Next Note
      </div>

      {currentNote && <TuningFork currentNote={currentNote} setCurrentNote={setCurrentNote} />}

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

        {/* Static strings - always in same place */}
        {one_metallica.map((_, stringIndex) => (
            <div
            key={`static-line-${stringIndex}`}
            className='absolute w-full h-[7px] bg-[#cac9c6]'
            style={{ top: `${30 + stringIndex * 60}px` }}
            />
        ))}

        {/* Moving notes and bars */}
        <div
            className='absolute top-0 left-0 transition-transform duration-300'
            style={{ transform: `translateX(-${(currentNoteIndex * 20) - 20}px)` }}
        >
            {one_metallica.map((stringData, stringIndex) => {
            return stringData.tab.split("").map((char, index) => {
                if (Math.abs(index - currentNoteIndex) > 70) return null;

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
                    <div className={`absolute top-[-12px] bg-[#ffd4a2] w-[30px] h-[30px] text-center rounded-full pt-[2px] text-lg font-bold ${index < currentNoteIndex ? "exploding" : ""}`}>
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
