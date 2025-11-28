import React, { useState, useMemo } from 'react';
import { ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from './Button';

// Simplified SVG paths for continents (approximate for visual representation)
const CONTINENT_PATHS = {
    'North America': "M 50 50 L 150 50 L 120 150 L 80 180 L 40 120 Z", // Placeholder shape
    'South America': "M 100 180 L 140 180 L 130 280 L 90 260 Z",
    'Europe': "M 160 40 L 240 40 L 230 100 L 170 110 Z",
    'Africa': "M 160 120 L 240 120 L 220 250 L 180 230 Z",
    'Asia': "M 250 40 L 450 40 L 420 180 L 260 150 Z",
    'Oceania': "M 350 200 L 420 200 L 400 260 L 340 240 Z"
};

// Center points for zooming
const CONTINENT_CENTERS = {
    'North America': { x: 100, y: 100, scale: 3 },
    'South America': { x: 115, y: 230, scale: 3 },
    'Europe': { x: 200, y: 75, scale: 4 },
    'Africa': { x: 200, y: 185, scale: 3 },
    'Asia': { x: 350, y: 100, scale: 2.5 },
    'Oceania': { x: 380, y: 230, scale: 4 }
};

interface Beer {
    id: number;
    name: string;
    brewery: string;
    country: string;
    region: string;
    subregion: string;
    style: string;
    abv: number;
    has_yeast_data: boolean;
}

interface GeoMapProps {
    beers: Beer[];
    onSelectBeer: (beer: Beer) => void;
    selectedBeerIds: number[];
}

export const GeoMap: React.FC<GeoMapProps> = ({ beers, onSelectBeer, selectedBeerIds }) => {
    const [view, setView] = useState<'world' | 'continent' | 'subregion'>('world');
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedSubregion, setSelectedSubregion] = useState<string | null>(null);

    // Group beers by region
    const regionCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        beers.forEach(beer => {
            counts[beer.region] = (counts[beer.region] || 0) + 1;
        });
        return counts;
    }, [beers]);

    // Group beers by subregion for the selected region
    const subregionCounts = useMemo(() => {
        if (!selectedRegion) return {};
        const counts: Record<string, number> = {};
        beers
            .filter(beer => beer.region === selectedRegion)
            .forEach(beer => {
                counts[beer.subregion] = (counts[beer.subregion] || 0) + 1;
            });
        return counts;
    }, [beers, selectedRegion]);

    // Handle region click
    const handleRegionClick = (region: string) => {
        const count = regionCounts[region] || 0;
        setSelectedRegion(region);

        if (count <= 20) {
            // Scenario A: Low beer count -> Show list directly
            setView('subregion'); // Treat whole region as one subregion list
            setSelectedSubregion('all'); // Special flag
        } else {
            // Scenario B: High beer count -> Show subregions
            setView('continent');
        }
    };

    // Handle subregion click
    const handleSubregionClick = (subregion: string) => {
        setSelectedSubregion(subregion);
        setView('subregion');
    };

    // Reset navigation
    const resetView = () => {
        setView('world');
        setSelectedRegion(null);
        setSelectedSubregion(null);
    };

    // Render World Map
    if (view === 'world') {
        return (
            <div className="relative w-full aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
                <div className="absolute top-4 left-4 z-10">
                    <h2 className="text-2xl font-bold text-slate-50">GLOBAL_BEER_INDEX</h2>
                    <p className="text-slate-400 text-sm">SELECT_REGION_TO_EXPLORE</p>
                </div>

                <svg viewBox="0 0 500 300" className="w-full h-full">
                    {Object.entries(CONTINENT_PATHS).map(([region, path]) => {
                        const count = regionCounts[region] || 0;

                        return (
                            <g
                                key={region}
                                onClick={() => handleRegionClick(region)}
                                className="cursor-pointer group transition-all duration-300"
                            >
                                <path
                                    d={path}
                                    className="fill-slate-800 stroke-slate-600 stroke-1 group-hover:fill-slate-700 group-hover:stroke-yellow-400 transition-all duration-300"
                                />
                                {/* Region Label & Count */}
                                <text
                                    x={CONTINENT_CENTERS[region as keyof typeof CONTINENT_CENTERS].x}
                                    y={CONTINENT_CENTERS[region as keyof typeof CONTINENT_CENTERS].y}
                                    textAnchor="middle"
                                    className="fill-slate-400 text-[10px] font-mono pointer-events-none group-hover:fill-yellow-400 group-hover:font-bold"
                                >
                                    {region.toUpperCase()}
                                </text>
                                <text
                                    x={CONTINENT_CENTERS[region as keyof typeof CONTINENT_CENTERS].x}
                                    y={CONTINENT_CENTERS[region as keyof typeof CONTINENT_CENTERS].y + 12}
                                    textAnchor="middle"
                                    className="fill-green-400 text-[8px] font-mono pointer-events-none"
                                >
                                    [{count}]
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        );
    }

    // Render Continent View (Subregions)
    if (view === 'continent' && selectedRegion) {
        return (
            <div className="relative w-full h-[600px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-yellow-400">{selectedRegion.toUpperCase()}</h2>
                        <p className="text-slate-400">SELECT_SUBREGION</p>
                    </div>
                    <Button variant="secondary" onClick={resetView}>
                        <ZoomOut size={16} /> WORLD_VIEW
                    </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {Object.entries(subregionCounts).map(([subregion, count]) => (
                        <div
                            key={subregion}
                            onClick={() => handleSubregionClick(subregion)}
                            className="bg-slate-900 border border-slate-800 p-6 rounded-lg cursor-pointer hover:border-yellow-400 hover:bg-slate-800 transition-all group"
                        >
                            <h3 className="text-xl font-bold text-slate-200 group-hover:text-yellow-400 mb-2">{subregion}</h3>
                            <div className="flex items-center gap-2">
                                <div className="h-1 flex-grow bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-400 w-1/2"></div> {/* Dummy visual bar */}
                                </div>
                                <span className="font-mono text-green-400">{count} BEERS</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Render Pub Menu (Beer List)
    if (view === 'subregion' && selectedRegion) {
        const filteredBeers = beers.filter(b =>
            b.region === selectedRegion &&
            (selectedSubregion === 'all' || b.subregion === selectedSubregion)
        );

        return (
            <div className="relative w-full bg-slate-950 rounded-lg border border-slate-800 p-6 animate-fade-in-up">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-slate-950/95 backdrop-blur z-20 py-4 border-b border-slate-800">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-50">
                            {selectedSubregion === 'all' ? selectedRegion : selectedSubregion}
                        </h2>
                        <p className="text-slate-400 font-mono text-sm">PUB_MENU // {filteredBeers.length} SELECTIONS</p>
                    </div>
                    <Button variant="secondary" onClick={() => setView(selectedSubregion === 'all' ? 'world' : 'continent')}>
                        <RotateCcw size={16} /> RETURN
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    {filteredBeers.map(beer => (
                        <div
                            key={beer.id}
                            onClick={() => onSelectBeer(beer)}
                            className={`
                flex items-center justify-between p-4 rounded border cursor-pointer transition-all
                ${selectedBeerIds.includes(beer.id)
                                    ? 'bg-yellow-400/10 border-yellow-400'
                                    : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800'}
              `}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-lg">
                                    🍺 {/* Placeholder for flag */}
                                </div>
                                <div>
                                    <h4 className={`font-bold ${selectedBeerIds.includes(beer.id) ? 'text-yellow-400' : 'text-slate-200'}`}>
                                        {beer.name}
                                    </h4>
                                    <p className="text-xs text-slate-500 uppercase">{beer.brewery} // {beer.style}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-mono text-green-400 font-bold">{beer.abv}% ABV</p>
                                {selectedBeerIds.includes(beer.id) && (
                                    <span className="text-[10px] bg-yellow-400 text-black px-1 rounded font-bold">SELECTED</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};
