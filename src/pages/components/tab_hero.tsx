import React, { useEffect, useRef, useState } from 'react';
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
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(0);
  const [targetTab, setTargetTab] = useState<string[]>([]);
  const didMountRef = useRef(false);

  useEffect(() => {
    const nextNotes: string[] = [];
  
    one_metallica.forEach((stringLine) => {
      const char = stringLine.tab[currentNoteIndex];
      if (!isNaN(parseInt(char))) {
        nextNotes.push(`${stringLine.note}-${char}`);
      }
    });
  
    if (nextNotes.length === 0) {
      // Don't auto-skip the very first render
      if (didMountRef.current) {
        setCurrentNoteIndex(prev => prev + 1);
      }
    } else {
      setTargetTab(nextNotes);
    }
  
    didMountRef.current = true;
  }, [currentNoteIndex]);

  useEffect(() => {
    if (!currentNote || targetTab.length === 0) return;
  
    const targetNotes = targetTab.map((note) => {
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
  }, [currentNote]);

  const handleNextNote = () => {
    let nextIndex = currentNoteIndex + 1;
  
    // Keep moving forward until there's a note present
    while (nextIndex < one_metallica[0].tab.length) {
      const hasNote = one_metallica.some(stringLine => {
        const char = stringLine.tab[nextIndex];
        return !isNaN(parseInt(char)); // check if it's a number (a fret)
      });
  
      if (hasNote) break;
      nextIndex++;
    }
  
    setCurrentNoteIndex(nextIndex);
  };

  return (
    <div className='relative'>
      <div className='text-xl absolute left-[100px] top-[150px] cursor-pointer rounded bg-rose-300 px-12 py-2 text-white' onClick={handleNextNote}>Next Note</div>
      {currentNote && <TuningFork currentNote={currentNote} setCurrentNote={setCurrentNote} />}
      <div className='absolute top-[200px] w-full text-center text-2xl'>Next Note: {targetTab.join(", ")}</div>

      <div id="string_names" className='absolute top-[232px] left-[40px]'>
        {one_metallica.map((note, index) => (
          <div key={index} className="text-2xl" style={{ marginTop: index === 0 ? 30 : 24 + "px" }}>{note.note}</div>
        ))}
      </div>

      <div className='bg-[#442426] absolute mt-[240px] h-[360px] w-[90%] left-[5%] rounded-xl overflow-hidden'>
        <div id="neck silver" className='bg-[#cac9c6] w-[20px] h-full'></div>
        <div id="guide_neck" className='absolute w-[50px] bg-[#778b8b] h-full top-0 left-[70px]'></div>

        {one_metallica.map((stringData, stringIndex) => (
          <div key={stringIndex}
            className={`absolute bg-[#cac9c6] w-[9000000px] h-[7px] pl-[60px] transition-left duration-300`}
            style={{ top: `${30 + stringIndex * 60}px`, left: `${20 - (currentNoteIndex * 20)}px` }}>
            {stringData.tab.split("").map((char, index) => {
              return (
                <div key={index} className={`'inline-block w-[20px] absolute`} style={{ left: `${60 + ((index) * 20)}px` }}>
                  {!isNaN(parseInt(char)) ? (
                    <div className="absolute top-[-12px] bg-[#ffd4a2] w-[30px] h-[30px] text-center rounded-[100%] pt-[2px] text-lg font-bold">
                      {char}
                    </div>
                  ) : char === "|" ? (
                    <div className='w-[5px] h-[70px] absolute bg-[#cac9c6] top-[-30px]'></div>
                  ) : (
                    <div className='text-white'></div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabHero;