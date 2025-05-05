import React, { useEffect, useMemo, useRef, useState } from 'react';
import TuningFork from './tuning_fork';
const one_metallica = [
    {note:"E3", tab:"---------------------|---------------------|---------------------|----------------------|---------------------|---------------------|---------------------|-------------|-------------------------------------------------|-----------------------------------------------------------------------|----14-19----17p15-14-15----------|-------------------------------------------|"},
    {note:"B2", tab:"---------------------|---------------------|---------------------|----------------------|---------------------|---------------------|---------------------|-------------|----------------------3p2-----3p2-----3-3p2------|-----------------------------------------2h3-2---------2-3p2-----------|---15--------------------15-------|-------------------------------------------|"},
    {note:"G2", tab:"---------------------|---------------------|---------------------|---------------0------|---------------------|---------------------|---------------------|-------------|-----2--4b6r4-------------4-------2---------4----|-11p9---9p7---7p6---6p4---2--/4~~-----/4------------/4-------2-/4------|--16------------------------------|-7p6-7---9p7-9---11p9-11---/12-12-11-------|"},
    {note:"D2", tab:"----4-----0----------|----4-----0----------|----4-----0----------|----4-----0-----------|----4------0---------|----4-----0----------|----4-----0----------|-------------|-2h4---------------------------------------------|------0-----0-----0-----0----------------------------------------------|-17-------------------------------|-------------------------------------------|"},
    {note:"A1", tab:"-2-----2-------------|---------------------|-2-----2-------------|----------------------|-2-----2-------------|-0-----0-------------|---------------------|----2-----2--|-------------------------------------------------|-----------------------------------------------------------------------|----------------------------------|-------------------------------------------|"},
    {note:"E1", tab:"---------------------|-3-----3-------------|---------------------|-3-----3--------------|---------------------|---------------------|-3-----3-------------|-0-----2-----|-------------------------------------------------|-----------------------------------------------------------------------|----------------------------------|-------------------------------------------|"},
]
//  "E3","B2","G2","D2","A1","E1
const TabHero: React.FC<{ }> = ({ }) => {
    const chromaticScale = [
        "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
    ];
    const [targetTab, setTargetTab] = useState<string[][]>([]);
    const [currentNote, setCurrentNote] = useState<string>("");
    const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(0);
    const [song, setSong] = useState<any[]>(one_metallica);
    
    useEffect(() => {
        return () => {
            var targetNotes: any = [];
            var cont = true;
            song[0].tab.split('').forEach((char: any, index: number) => {
                if (cont) {
                    if (!isNaN(parseInt(song[0].tab[0]))) {
                        targetNotes.push(song[0].note + "-" + song[0].tab[0]);
                    }
                    if (!isNaN(parseInt(song[1].tab[0]))) {                     
                        targetNotes.push(song[1].note + "-" + song[1].tab[0]);
                    }
                    if (!isNaN(parseInt(song[2].tab[0]))) {
                        targetNotes.push(song[2].note + "-" + song[2].tab[0]);
                    }
                    if (!isNaN(parseInt(song[3].tab[0]))) {
                        targetNotes.push(song[3].note + "-" + song[3].tab[0]);
                    }
                    if (!isNaN(parseInt(song[4].tab[0]))) {
                        targetNotes.push(song[4].note + "-" + song[4].tab[0]);
                    }
                    if (!isNaN(parseInt(song[5].tab[0]))) {
                        targetNotes.push(song[5].note + "-" + song[5].tab[0]);
                    }
                    if (targetNotes.length > 0) {
                        setTargetTab(targetNotes);
                        cont = false;
                        return; // This will exit the current iteration of the forEach loop, but not the entire loop
                    } else {
                        var songRemaining = song;
                        songRemaining[0].tab = songRemaining[0].tab.substring(1);
                        songRemaining[1].tab = songRemaining[1].tab.substring(1);
                        songRemaining[2].tab = songRemaining[2].tab.substring(1);
                        songRemaining[3].tab = songRemaining[3].tab.substring(1);
                        songRemaining[4].tab = songRemaining[4].tab.substring(1);
                        songRemaining[5].tab = songRemaining[5].tab.substring(1);
                        setSong(songRemaining);
                    }
                }
            });
        }
    }, [currentNoteIndex]);

    useEffect(() => {
        if (currentNote) {
            var targetNotes: any = [];
            targetTab.forEach((note) => {
                var components = note.split("-");
                var noteName = components[0].replace(/[0-9]/g, '');
                var noteNumber = parseInt(components[1]);
                var noteIndex = chromaticScale.indexOf(noteName);
                targetNotes.push(chromaticScale[(noteIndex + noteNumber) % 12]);
            });
            if (targetNotes.includes(currentNote.replace(/[0-9]/g, ''))) {
                console.log("Correct note played: " + currentNote);
                handleNextNote();
            }
        }
    }, [currentNote]);
    
    const handleNextNote = () => {
        var songRemaining = song;
        songRemaining[0].tab = songRemaining[0].tab.substring(1);
        songRemaining[1].tab = songRemaining[1].tab.substring(1);
        songRemaining[2].tab = songRemaining[2].tab.substring(1);
        songRemaining[3].tab = songRemaining[3].tab.substring(1);
        songRemaining[4].tab = songRemaining[4].tab.substring(1);
        songRemaining[5].tab = songRemaining[5].tab.substring(1);
        setSong(songRemaining);
        setCurrentNoteIndex(currentNoteIndex + 1);
    }

    return (
        <div className='relative'>
            <div className='text-xl absolute left-[100px] top-[150px] cursor-pointer rounded bg-rose-300 px-12 py-2 text-white' onClick={()=>{handleNextNote()}}>Next Note</div>
            <TuningFork currentNote={currentNote} setCurrentNote={setCurrentNote}></TuningFork>
            <div className='absolute top-[200px] w-full text-center text-2xl'>Next Note: {targetTab}</div>
            <div id="string_names" className='absolute top-[232px] left-[40px]'>
                {
                    one_metallica.map((note, index) => {
                        return (
                            <div key={index} className="text-2xl" style={{marginTop: index == 0 ? 30 : 24 +"px"}}>{note.note}</div>
                        )
                    })
                }
            </div>
            <div className='bg-[#442426] absolute mt-[240px] h-[360px] w-[90%] left-[5%] rounded-xl overflow-hidden'>
                <div id="neck silver" className='bg-[#cac9c6] w-[20px] h-full'></div>
                <div id="guide_neck" className='absolute w-[50px] bg-[#778b8b] h-full top-0 left-[70px]'></div>
                <div id="string_1" className={`absolute bg-[#cac9c6] w-[9000000px] h-[7px] top-[30px] pl-[60px]`} style={{left: "20px"}}>
                    {   
                        one_metallica[0].tab.split("").map((note, index) => {
                            return (
                                <>
                                    {!isNaN(parseInt(note)) ? <div className={`inline-block text-black w-[20px] h-[20px]`}><div className="absolute top-[-12px] bg-[#ffd4a2] w-[30px] h-[30px] text-center rounded-[100%] pt-[2px] text-lg font-bold">{note}</div></div> : note == "|" ? <div className='w-[20px] inline-block'><div className='w-[5px] h-[70px] absolute bg-[#cac9c6] top-[-30px]'></div></div> : <div className='w-[20px] inline-block '></div>}
                                    
                                </>
                            )
                        })
                    }
                </div>
                <div id="string_2" className={`absolute bg-[#cac9c6] w-[9000000px] h-[7px] top-[90px] pl-[60px]`} style={{left: "20px"}}>
                    {   
                        one_metallica[1].tab.split("").map((note, index) => {
                            return (
                                <>
                                    {!isNaN(parseInt(note)) ? <div className={`inline-block text-black w-[20px] h-[20px]`}><div className="absolute top-[-12px] bg-[#ffd4a2] w-[30px] h-[30px] text-center rounded-[100%] pt-[2px] text-lg font-bold">{note}</div></div> : note == "|" ? <div className='w-[20px] inline-block'><div className='w-[5px] h-[70px] absolute bg-[#cac9c6] top-[-30px]'></div></div> : <div className='w-[20px] inline-block text-white '></div>}
                                    
                                </>
                            )
                        })
                    }
                </div>
                <div id="string_3" className={`absolute bg-[#cac9c6] w-[9000000px] h-[7px] top-[150px] pl-[60px]`} style={{left: "20px"}}>
                    {   
                        one_metallica[2].tab.split("").map((note, index) => {
                            return (
                                <>
                                    {!isNaN(parseInt(note)) ? <div className={`inline-block text-black w-[20px] h-[20px]`}><div className="absolute top-[-12px] bg-[#ffd4a2] w-[30px] h-[30px] text-center rounded-[100%] pt-[2px] text-lg font-bold">{note}</div></div> : note == "|" ? <div className='w-[20px] inline-block'><div className='w-[5px] h-[70px] absolute bg-[#cac9c6] top-[-30px]'></div></div> : <div className='w-[20px] inline-block text-white '></div>}
                                    
                                </>
                            )
                        })
                    }
                </div>
                <div id="string_4" className={`absolute bg-[#cac9c6] w-[9000000px] h-[7px] top-[210px] pl-[60px]`} style={{left: "20px"}}>
                    {   
                        one_metallica[3].tab.split("").map((note, index) => {
                            return (
                                <>
                                    {!isNaN(parseInt(note)) ? <div className={`inline-block text-black w-[20px] h-[20px]`}><div className="absolute top-[-12px] bg-[#ffd4a2] w-[30px] h-[30px] text-center rounded-[100%] pt-[2px] text-lg font-bold">{note}</div></div> : note == "|" ? <div className='w-[20px] inline-block'><div className='w-[5px] h-[70px] absolute bg-[#cac9c6] top-[-30px]'></div></div> : <div className='w-[20px] inline-block text-white '></div>}
                                    
                                </>
                            )
                        })
                    }
                </div>
                <div id="string_5" className={`absolute bg-[#cac9c6] w-[9000000px] h-[7px] top-[260px] pl-[60px]`} style={{left: "20px"}}>
                    {   
                        one_metallica[4].tab.split("").map((note, index) => {
                            return (
                                <>
                                    {!isNaN(parseInt(note)) ? <div className={`inline-block text-black w-[20px] h-[20px]`}><div className="absolute top-[-12px] bg-[#ffd4a2] w-[30px] h-[30px] text-center rounded-[100%] pt-[2px] text-lg font-bold">{note}</div></div> : note == "|" ? <div className='w-[20px] inline-block'><div className='w-[5px] h-[70px] absolute bg-[#cac9c6] top-[-30px]'></div></div> : <div className='w-[20px] inline-block text-white '></div>}
                                    
                                </>
                            )
                        })
                    }
                </div>
                <div id="string_6" className={`absolute bg-[#cac9c6] w-[9000000px] h-[7px] top-[320px] pl-[60px]`} style={{left: "20px"}}>
                    {   
                        one_metallica[5].tab.split("").map((note, index) => {
                            return (
                                <>
                                    {!isNaN(parseInt(note)) ? <div className={`inline-block text-black w-[20px] h-[20px]`}><div className="absolute top-[-12px] bg-[#ffd4a2] w-[30px] h-[30px] text-center rounded-[100%] pt-[2px] text-lg font-bold">{note}</div></div> : note == "|" ? <div className='w-[20px] inline-block'><div className='w-[5px] h-[70px] absolute bg-[#cac9c6] top-[-30px]'></div></div> : <div className='w-[20px] inline-block text-white '></div>}
                                    
                                </>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
    
}
export default TabHero;
