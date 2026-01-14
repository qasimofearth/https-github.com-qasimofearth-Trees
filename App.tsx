
import React, { useState, useCallback } from 'react';
import TreeCanvas from './components/TreeCanvas';
import Sidebar from './components/Sidebar';
import { TreeParams, TreeSpecies, SliceStats, ObservationMode } from './types';
import { SPECIES_DEFAULTS } from './constants';

const App: React.FC = () => {
  const [params, setParams] = useState<TreeParams>(SPECIES_DEFAULTS[TreeSpecies.COAST_REDWOOD]);
  const [mode, setMode] = useState<ObservationMode>(ObservationMode.PIPE_MODEL);
  const [volume, setVolume] = useState<number>(0);
  const [sliceHeight, setSliceHeight] = useState<number>(3.5); // Default to middle of height
  const [sliceStats, setSliceStats] = useState<SliceStats>({
    trunkArea: 0,
    currentSum: 0,
    branchCount: 0,
    branchAreas: [],
    height: 3.5
  });

  const handleUpdateStats = useCallback((v: number, stats: SliceStats) => {
    setVolume(v);
    setSliceStats(stats);
  }, []);

  return (
    <div className="flex w-screen h-screen bg-slate-100 text-slate-900 overflow-hidden font-sans">
      <main className="flex-1 relative">
        <TreeCanvas 
          params={params} 
          sliceHeight={sliceHeight}
          mode={mode}
          onUpdateStats={handleUpdateStats} 
        />
        
        {/* Simplified Header */}
        <div className="absolute top-8 left-8 pointer-events-none">
           <div className="bg-white/90 backdrop-blur-xl p-2.5 rounded-2xl shadow-xl border border-white/50 flex items-center pr-6 gap-3">
              <div className="w-10 h-10 bg-[#a65d1a] rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg shadow-[#a65d1a]/20">L</div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-800 block leading-none">Botanical Logic</span>
                <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-emerald-600 block mt-1.5">Simulation Laboratory</span>
              </div>
           </div>
        </div>
      </main>

      <aside className="w-[480px] shadow-2xl relative z-10 hidden lg:block border-l border-slate-200">
        <Sidebar 
          params={params} 
          setParams={setParams} 
          sliceHeight={sliceHeight}
          setSliceHeight={setSliceHeight}
          mode={mode}
          setMode={setMode}
          volume={volume}
          sliceStats={sliceStats}
        />
      </aside>

      {/* Mobile Disclaimer */}
      <div className="lg:hidden absolute inset-0 bg-white flex items-center justify-center p-12 text-center z-[100]">
        <div className="max-w-xs">
          <div className="w-12 h-12 bg-[#a65d1a] rounded-xl flex items-center justify-center text-white font-black italic mx-auto mb-6">L</div>
          <p className="text-sm font-bold text-slate-600 leading-relaxed">
            Please use a desktop browser to explore Leonardo's botanical mathematical models.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
