import React from 'react';
import { Layout } from './components/Layout';
import { BeerCard } from './components/BeerCard';
import { Button } from './components/Button';
import { SequencingLoader } from './components/SequencingLoader';
import { Beaker, RotateCcw, Dna, AlertTriangle } from 'lucide-react';
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
              {rec.missingYeastData && (
                <div className="mt-2 flex items-start gap-2 text-yellow-500 text-xs bg-yellow-500/10 p-2 rounded font-mono">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  <p>YEAST_DATA_UNAVAILABLE // SCORE_WEIGHT: RAMAN(61.8%)</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4 sticky top-16 bg-slate-950/95 backdrop-blur z-40 py-4 border-b border-slate-900">
        <div>
          <h2 className="text-3xl font-bold text-slate-50 mb-2">SELECT_SAMPLES</h2>
          <p className="text-slate-400 max-w-xl">
            Select up to 3 beers to analyze their molecular fingerprint.
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
        {beers.map(beer => (
          <BeerCard
            key={beer.id}
            beer={beer}
            ramanVector={ramanData[beer.id]}
            selected={selectedIds.includes(beer.id)}
            onSelect={() => toggleSelection(beer.id)}
          />
        ))}
      </div>
    </>
  );
};

function App() {
  return (
    <DataProvider>
      <SelectionProvider>
        <Layout>
          <MainContent />
        </Layout>
      </SelectionProvider>
    </DataProvider>
  );
}

export default App;
