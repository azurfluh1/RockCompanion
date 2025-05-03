import { useState } from "react";
import TunedString from "./components/tuned_string";
import TuningPresets from "./components/tuning_presets";


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
        <div id="tuner" className="w-full h-[calc(100vh-97px)] p-12 pl-40 pb-0">
            <h1 className="text-5xl font-bold">Electric Guitar Tuner</h1>
            <h3 className="mt-4">Tap on a note, then tune your corresponding guitar string to match the tone.</h3>
            <div className="flex items-center mt-8 w-full">
                <div className="tuner-container text-center w-[60%]">
                    <TunedString note={tuningPresetsData[selectedPreset].set[0]} position={0}></TunedString>
                    <TunedString note={tuningPresetsData[selectedPreset].set[1]} position={1}></TunedString>
                    <TunedString note={tuningPresetsData[selectedPreset].set[2]} position={2}></TunedString>
                    <TunedString note={tuningPresetsData[selectedPreset].set[3]} position={3}></TunedString>
                    <TunedString note={tuningPresetsData[selectedPreset].set[4]} position={4}></TunedString>
                    <TunedString note={tuningPresetsData[selectedPreset].set[5]} position={5}></TunedString>
                    <img className="inline-block mt-[47px]" src="https://stuff.fendergarage.com/f-com/prod/fender-tuner/assets/tuner/img/strat/bg-df15e047a2a48ae32ce1e693baf842c4.png"/>
                </div>
                <TuningPresets presets={tuningPresetsData} onPresetSelect={setSelectedPreset}></TuningPresets>
            </div>
        </div>
    );
}