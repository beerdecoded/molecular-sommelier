import React from 'react';

interface BarcodeProps {
    ramanVector?: number[];
    className?: string;
}

/**
 * Barcode Component
 * 
 * Visualizes the Raman spectrum as a series of vertical stripes.
 * Uses a "Spectral" color palette (Cyan, Magenta, Lime) to contrast with the dark UI.
 */
export const Barcode: React.FC<BarcodeProps> = ({ ramanVector, className = '' }) => {
    // If no vector provided, generate a dummy pattern based on a random seed or static
    const data = ramanVector || Array.from({ length: 50 }, () => Math.random());

    // We'll sample the vector to fit the display width (e.g., 50 bars)
    const sampleSize = 50;
    const step = Math.floor(data.length / sampleSize);
    const bars = [];

    for (let i = 0; i < sampleSize; i++) {
        const value = data[i * step] || 0;
        // Normalize value for height/opacity (assuming normalized 0-1 or similar)
        // Raman peaks can be sharp.
        bars.push(value);
    }

    return (
        <div className={`flex items-end h-8 gap-[1px] w-full overflow-hidden ${className}`}>
            {bars.map((value, idx) => {
                // Dynamic color based on index (simulating wavelength)
                // Cycle through Cyan -> Magenta -> Lime
                let colorClass = 'bg-cyan-400';
                if (idx % 3 === 1) colorClass = 'bg-fuchsia-400';
                if (idx % 3 === 2) colorClass = 'bg-lime-400';

                return (
                    <div
                        key={idx}
                        className={`flex-1 ${colorClass} barcode-stripe`}
                        style={{
                            height: `${Math.max(20, value * 100)}%`, // Min height 20%
                            opacity: 0.5 + (value * 0.5), // Min opacity 0.5
                            animationDelay: `${idx * 0.05}s` // Staggered pulse
                        }}
                    />
                );
            })}
        </div>
    );
};
