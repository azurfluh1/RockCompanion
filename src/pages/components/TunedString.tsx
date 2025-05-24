
import React, { useEffect, useRef, useState } from 'react';

const TunedString: React.FC<{ note: string, position: number }> = ({ note, position }) => {
    const [positionFromTop, setPositionFromTop] = useState(
        `calc(5.8rem + ${position * (window.innerWidth <= 640 ? 3.2 : 3.6)}rem)`
    );

    useEffect(() => {
        const handleResize = () => {
            setPositionFromTop(
                `calc(5.8rem + ${position * (window.innerWidth <= 640 ? 3.2 : 3.6)}rem)`
            );
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [position]);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
        setTimeout(() => setIsPlaying(false), 2500);
    };

    return (
        <div
            className="absolute ml-[15px] sm:ml-25 lg:ml-0 w-10 md:w-12 h-10 md:h-12 rounded-full p-2 text-lg sm:text-xl cursor-pointer bg-[#ffd4a2] mb-[-20px]"
            style={{ top: positionFromTop }}
            onClick={handlePlay}
        >
            <audio ref={audioRef} src={`https://s3.amazonaws.com/prod-fender-tuner-assets/audio/strat/${note.replace('b', '%23').replace('#', '%23')}.m4a`} />
            {note[0]}<span className='text-sm'>{note.slice(1)}</span>
            <TunedStringAfter position={position} />
            <div className={`absolute inset-0 rounded-full bg-blue-300 flex items-center justify-center -z-10 ${isPlaying ? "animate-ping" : ""}`} />
        </div>
    );
};

export default TunedString; 

const TunedStringAfter: React.FC<{ position: number }> = ({ position }) => {
    const width = `calc(11rem - ${position * 1.25}rem)`;
    return (
        <div
            className="absolute h-[2px] bg-[#ffd4a1] top-[50%] left-full"
            style={{ width, transform: 'translateY(-50%)' }}
        />
    );
};
