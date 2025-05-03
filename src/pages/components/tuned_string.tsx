
import React, { useEffect, useRef, useState } from 'react';

const TunedString: React.FC<{ note: string, position: number }> = ({ note, position }) => {
    const positionFromTop = 362 + (position * 59) + "px";
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const handlePlay = () => {
        setIsPlaying(!isPlaying);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
        setTimeout(() => {
            setIsPlaying(false);
        }, 2500);
    };

    return (
        <div className={`bg-[#ffd4a2] w-[45px] h-[45px] rounded-[100%] p-[8px] left-[345px] absolute text-xl cursor-pointer`} onClick={()=>{handlePlay()}}style={{top:positionFromTop}}>
            <audio ref={audioRef} src={`https://s3.amazonaws.com/prod-fender-tuner-assets/audio/strat/${note.replace('b', '%23').replace('#', '%23')}.m4a`} />
            {note[0]}<span className='text-sm'>{note[1]+(note[2]?note[2]:"")}</span>
            <TunedStringAfter position={position}></TunedStringAfter>
            <div className={`w-full h-full rounded-[100%] bg-blue-300 flex justify-center items-center absolute left-0 top-0 -z-1 ${isPlaying ? "animate-ping" : ""}`}></div>
        </div>
    );
}
const TunedStringAfter: React.FC<{ position: number}> = ({ position }) => {
    const positionToWidth = 192 - (position * 20) + "px";
    return (
        <div className={`absolute h-[2px] bg-[#ffd4a1] top-[22px] left-[49px]`} style={{width: positionToWidth}}></div>
    )
}
export default TunedString;