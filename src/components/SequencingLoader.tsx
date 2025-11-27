import React, { useEffect, useState } from 'react';

/**
 * SequencingLoader Component
 * 
 * Simulates a scientific data processing sequence.
 * Cycles through "processing" steps and shows a DNA-like progress bar.
 */
export const SequencingLoader: React.FC = () => {
    const [step, setStep] = useState(0);
    const [progress, setProgress] = useState(0);

    const steps = [
        "EXTRACTING_MOLECULAR_DATA",
        "ALIGNING_RAMAN_SPECTRA",
        "CALCULATING_PHYLOGENETIC_DISTANCE",
        "OPTIMIZING_MATCHES"
    ];

    useEffect(() => {
        // Cycle through text steps
        const stepInterval = setInterval(() => {
            setStep(prev => (prev + 1) % steps.length);
        }, 800);

        // Progress bar
        const progressInterval = setInterval(() => {
            setProgress(prev => Math.min(prev + 2, 100));
        }, 30);

        return () => {
            clearInterval(stepInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            {/* DNA / Data Stream Visual */}
            <div className="flex gap-1 h-16 mb-8 items-end">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="w-2 bg-yellow-400/80"
                        style={{
                            height: `${Math.random() * 100}%`,
                            opacity: Math.random(),
                            animation: `pulse 0.5s infinite ${i * 0.05}s`
                        }}
                    />
                ))}
            </div>

            {/* Text Cycle */}
            <div className="h-8 mb-2">
                <p className="font-mono text-yellow-400 text-xl tracking-widest animate-pulse">
                    {steps[step]}...
                </p>
            </div>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden mt-4">
                <div
                    className="h-full bg-green-400 transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <p className="font-mono text-slate-500 text-xs mt-2">
                PROCESS_ID: {Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
            </p>
        </div>
    );
};
