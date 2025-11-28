import React from 'react';
import { Dna, Check, Triangle } from 'lucide-react';
import { Barcode } from './Barcode';

interface Beer {
    id: number;
    name: string;
    brewery: string;
    has_yeast_data: boolean;
}

interface BeerCardProps {
    beer: Beer;
    ramanVector?: number[]; // Optional for now
    selected?: boolean;
    onSelect?: (beer: Beer) => void;
}

/**
 * BeerCard Component
 * 
 * Displays beer information with a "Biohacker" aesthetic.
 * - Rectangular, sharp corners.
 * - Dark background with subtle border.
 * - Hover: Vibrant Yellow border + glow.
 * - "DNA" icon if yeast data is available.
 */
export const BeerCard: React.FC<BeerCardProps> = ({
    beer,
    ramanVector,
    selected = false,
    onSelect
}) => {
    return (
        <div
            className={`
        relative group cursor-pointer
        bg-slate-900 border 
        transition-all duration-300 ease-out
        min-h-[160px] flex flex-col justify-between
        ${selected
                    ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                    : 'border-slate-800 hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                }
      `}
            onClick={() => onSelect && onSelect(beer)}
        >
            {/* Selection Indicator */}
            {selected && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-black p-1 z-10">
                    <Check size={16} strokeWidth={3} />
                </div>
            )}

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs text-slate-500">ID:{beer.id.toString().padStart(3, '0')}</span>
                    <div className="flex gap-2">
                        {ramanVector && ramanVector.length > 0 && (
                            <div className="text-blue-400" title="Raman Spectra Available">
                                <Triangle size={16} className="rotate-180" />
                            </div>
                        )}
                        {beer.has_yeast_data && (
                            <div className="text-green-400" title="Genomic Data Available">
                                <Dna size={16} />
                            </div>
                        )}
                    </div>
                </div>

                <h3 className="text-slate-50 font-bold text-lg leading-tight mb-1 group-hover:text-yellow-400 transition-colors">
                    {beer.name}
                </h3>
                <p className="text-slate-400 text-sm uppercase tracking-wide">
                    {beer.brewery}
                </p>
            </div>

            {/* Footer / Visuals */}
            <div className="mt-auto border-t border-slate-800 bg-slate-950/50">
                <Barcode ramanVector={ramanVector} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    );
};
