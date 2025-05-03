
import React, { useEffect, useRef, useState } from 'react';

const TuningPresets: React.FC<{ presets: { name: string; set: string[]; description: string; }[], onPresetSelect: Function}> = ({ presets, onPresetSelect }) => {
    
    const [selectedPreset, setSelectedPreset] = useState<number>(0);

    const handlePresetClick = (index: number) => {
        setSelectedPreset(index);
        // Notify parent component about the selected preset
        onPresetSelect(index);
    };

    return (
            <div className="h-[400px] flex-grow-1 border-2 rounded-2 border-gray-300 max-w-[400px] rounded-lg p-6">
                <h1 className="font-bold text-2xl w-full border-b-1 border-gray-300 py-3">Tuning Preset</h1>
                <div className="overflow-scroll h-100% max-h-[calc(100%-57px)]">
                    {
                        presets.map((preset, index) => {
                            const isSelected = selectedPreset === index;
                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col mt-4 border-b-1 border-gray-300 pb-4 relative cursor-pointer`}
                                    onClick={() => handlePresetClick(index)}
                                >
                                    <h1 className="text-md font-bold">{preset.name}</h1>
                                    <p className="text-sm text-gray-500">{preset.description}</p>
                                    <div className="flex flex-row mt-2">
                                        {preset.set.slice().reverse().map((note: String, noteIndex: number) => {
                                            return (
                                                <div key={noteIndex} className="" style={{ lineHeight: 1 }}>
                                                    {note[0]}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div
                                        className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 ${
                                            isSelected ? 'bg-green-500 border-green-500' : 'bg-transparent border-gray-300'
                                        }`}
                                    ></div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    
}
export default TuningPresets;
