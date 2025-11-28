import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { BeerCard } from './components/BeerCard';
import { Button } from './components/Button';
import { SequencingLoader } from './components/SequencingLoader';
import { GeoMap } from './components/GeoMap';
import { About } from './components/About';
import { Beaker, RotateCcw, Dna } from 'lucide-react';
import { DataProvider, useData } from './context/DataContext';
import { SelectionProvider, useSelection } from './context/SelectionContext';

const MainContent: React.FC = () => {
  const { beers, loading, ramanData } = useData();
  const {
    selectedIds,
    toggleSelection,
    analyze,
    recommendations,
    isAnalyzing,
    reset
  } = useSelection();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-pulse mb-4">
          <Dna size={48} className="text-yellow-400" />
        </div>
        <p className="font-mono text-green-400 text-xl">INITIALIZING_SEQUENCER...</p>
      </div>
    );
  }

  if (isAnalyzing) {
    return <SequencingLoader />;
  }

  if (recommendations.length > 0) {
    return (
      <div className="animate-fade-in-up">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-50 mb-2">ANALYSIS_COMPLETE</h2>
            <p className="text-slate-400">
              Found matches based on <span className="text-yellow-400 font-mono">{recommendations[0].mode === 'Wander Away' ? 'EXPLORATION_MODE' : 'MOLECULAR_SIMILARITY'}</span>.
            </p>
          </div>
          <Button variant="secondary" onClick={reset}>
            <RotateCcw size={18} />
            RESET
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {recommendations.map((rec, idx) => (
            <div
              key={rec.beer.id}
              className={`relative animate-fade-in-up ${idx === 1 ? 'delay-100' : ''}`}
            >
              <div className="absolute -top-3 -left-3 bg-yellow-400 text-black font-bold font-mono px-3 py-1 z-10 shadow-lg">
                #{idx + 1} // {(rec.score * 100).toFixed(1)}% MATCH
              </div>
              <BeerCard
                beer={rec.beer}
                ramanVector={ramanData[rec.beer.id]}
              />

            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-16 bg-slate-950/95 backdrop-blur z-40 py-4 border-b border-slate-900">
        <div>
          <h2 className="text-xl font-bold text-slate-50">SAMPLE_SELECTION</h2>
          <p className="text-slate-400 text-sm">
            Navigate the map to select up to 3 beers.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-500 font-mono uppercase">Selection</p>
            <p className="text-xl font-mono text-yellow-400">{selectedIds.length} / 3</p>
          </div>
          <Button
            disabled={selectedIds.length === 0}
            onClick={analyze}
            className={selectedIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <Beaker size={18} />
            ANALYZE
          </Button>
        </div>
      </div>

      <GeoMap
        beers={beers}
        onSelectBeer={(beer) => toggleSelection(beer.id)}
        selectedBeerIds={selectedIds}
      />
    </>
  );
};

function App() {
  const [view, setView] = useState<'home' | 'about'>('home');

  return (
    <DataProvider>
      <SelectionProvider>
        <Layout currentView={view} onNavigate={setView}>
          {view === 'home' ? <MainContent /> : <About onBack={() => setView('home')} />}
        </Layout>
      </SelectionProvider>
    </DataProvider>
  );
}

export default App;
