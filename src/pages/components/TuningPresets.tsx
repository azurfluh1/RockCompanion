import React, { useState } from 'react';

const TuningPresets: React.FC<{
    presets: { name: string; set: string[]; description: string }[];
    onPresetSelect: (index: number) => void;
}> = ({ presets, onPresetSelect }) => {
    const [selectedPreset, setSelectedPreset] = useState<number>(0);

    const handlePresetSelect = (index: number) => {
        setSelectedPreset(index);
        onPresetSelect(index);
    };

    return (
        <div className="flex-grow border-2 rounded-lg border-gray-300 p-6 lg:w-[400px] lg:h-[200px] lg:h-[400px] lg:mt-30">
            <h1 className="font-bold text-2xl w-full border-b border-gray-300 py-3">Tuning Preset</h1>

            {/* Mobile Dropdown */}
            <div className="block lg:hidden mt-4">
                <select
                    className="w-full border border-gray-300 rounded border-none lg:border-auto lg:px-4 lg:py-2 "
                    value={selectedPreset}
                    onChange={(e) => handlePresetSelect(Number(e.target.value))}
                >
                    {presets.map((preset, index) => (
                        <option key={index} value={index}>
                            {preset.name} – {preset.description}
                        </option>
                    ))}
                </select>
            </div>

            {/* Desktop List */}
            <div className="hidden lg:block overflow-scroll max-h-[calc(100%-57px)]">
                {presets.map((preset, index) => {
                    const isSelected = selectedPreset === index;
                    return (
                        <div
                            key={index}
                            className="flex flex-col mt-4 border-b border-gray-300 pb-4 relative cursor-pointer"
                            onClick={() => handlePresetSelect(index)}
                        >
                            <h1 className="text-md font-bold">{preset.name}</h1>
                            <p className="text-sm text-gray-500">{preset.description}</p>
                            <div className="flex flex-row mt-2">
                                {preset.set.slice().reverse().map((note, noteIndex) => (
                                    <div key={noteIndex} style={{ lineHeight: 1 }}>
                                        {note[0]}
                                    </div>
                                ))}
                            </div>
                            <div
                                className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 ${
                                    isSelected ? 'bg-green-500 border-green-500' : 'bg-transparent border-gray-300'
                                }`}
                            ></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TuningPresets;