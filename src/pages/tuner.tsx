import { useState } from "react";
import TunedString from "./components/TunedString";
import TuningPresets from "./components/TuningPresets";


export default function Tuner() {
    const tuningPresetsData = [
        {
            name:"Standard Tuning",
            set:["E3","B2","G2","D2","A1","E1"],        
            description:"Most common tuning — great for all styles."
        },
        { 
            name:"Drop D",
            set:["E3","B2","G2","D2","A1","D1"],        
            description:"Just lowers the low E to D — heavier riffs, easy power chords."
        },
        { 
            name:"Full-Step Down",
            set:["D3","A2","F2","C2","G1","D1"],
            description:"Heavier, looser sound — good for singing lower."
        },
        {
            name:"Drop C",
            set:["D3","A2","F2","C2","G1","C1"],
            description: "Metal/rock favorite — deeper and punchy."
        },
        { 
            name:"Open G",
            set:["D3","B2","G2","D2","G1","D1"],
            description:"Slide guitar, bluesy — strums a G chord open."
        },
        { 
            name:"Open D",
            set:["D3","A2","F#2","D2","A1","D1"],
            description:"Strums a D chord — great for fingerstyle and slide."
        },
        {      
            name:"DADGAD",
            set:["D3","A2","G2","D2","A1","D1"],
            description:"Celtic/folk favorite — very modal and expressive."
        }
    ]

    const [selectedPreset, setSelectedPreset] = useState<number>(0);
    
    return (
        <div id="tuner" className="w-full h-auto 2xl:p-4 2xl:p-12 2xl:px-40 !pb-[0] pt-10">
            <div className="px-15 md:px-40 text-center lg:text-left">
                <h1 className="text-3xl md:text-5xl font-bold">Electric Guitar Tuner</h1>
                <h3 className="mt-2 md:mt-4 text-sm md:text-base">
                    Tap on a note, then tune your corresponding guitar string to match the tone.
                </h3>
            </div>
            <div className="flex flex-col md:flex-row flex-wrap items-start mt-6 md:mt-8 gap-2 mg:gap-4 justify-center">
                {/* Tuning Presets - on top in mobile, right side in desktop */}
                <div className="order-1 lg:order-2 w-auto px-15">
                    <TuningPresets presets={tuningPresetsData} onPresetSelect={setSelectedPreset} />
                </div>

                {/* Guitar & Strings */}
                <div className="order-2 md:order-1 tuner-container text-center relative w-auto">
                    {tuningPresetsData[selectedPreset].set.map((note, index) => (
                    <TunedString key={index} note={note} position={index} />
                    ))}
                    <img
                    className="inline-block mt-[48px] w-[500px] max-w-none lg:max-w-[100%] lg:w-[550px] xl:w-[550px] w-auto ml-20 lg:ml-0"
                    src="https://stuff.fendergarage.com/f-com/prod/fender-tuner/assets/tuner/img/strat/bg-df15e047a2a48ae32ce1e693baf842c4.png"
                    />
                </div>
            </div>
        </div>
    );
}