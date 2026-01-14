
import React from 'react';
import { TreeParams, TreeSpecies, SliceStats, ObservationMode } from '../types';
import { SPECIES_DEFAULTS } from '../constants';

interface SidebarProps {
  params: TreeParams;
  setParams: (p: TreeParams) => void;
  sliceHeight: number;
  setSliceHeight: (h: number) => void;
  mode: ObservationMode;
  setMode: (m: ObservationMode) => void;
  volume: number;
  sliceStats: SliceStats;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  params, 
  setParams, 
  sliceHeight, 
  setSliceHeight, 
  mode,
  setMode,
  sliceStats
}) => {
  const updateParam = (key: keyof TreeParams, value: any) => {
    setParams({ ...params, [key]: value });
  };

  const heightPercent = ((sliceHeight / 6.8) * 100).toFixed(0);
  const conversionFactor = 10.7639; // Scaling for visualization

  return (
    <div className="w-full h-full flex flex-col p-8 overflow-y-auto bg-white border-l border-slate-200 font-sans">
      <div className="mb-10 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-[#a65d1a] tracking-tighter leading-none">LEONARDO'S RULE</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Geometric Branching Conservation</p>
        </div>
        <div className="w-10 h-10 bg-[#a65d1a] rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-[#a65d1a]/20">L</div>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-xl mb-8 shadow-inner">
        {Object.values(ObservationMode).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-3 px-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {m === ObservationMode.PIPE_MODEL ? 'View cross-sections' : 'View main path'}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        <div className="bg-[#fffdf0] rounded-3xl p-8 border border-amber-100 shadow-sm transition-all">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-[#a65d1a] mb-2">
              A₀ ≈ Σ Aₙ
            </h2>
            <p className="text-[#a65d1a] text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
              Area conservation Proof
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-4">
            <div className="text-center">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Trunk Area (A₀)</p>
              <div className="w-24 h-24 rounded-full bg-white border-4 border-[#a65d1a] flex items-center justify-center mb-4 mx-auto shadow-inner">
                <span className="text-xl font-black text-[#a65d1a]">BASE</span>
              </div>
              <p className="text-2xl font-black text-slate-800 tabular-nums">
                {(sliceStats.trunkArea * conversionFactor).toFixed(2)}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Units²</p>
            </div>

            <div className="text-center">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Branch Sum (Σ Aₙ)</p>
              <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-dashed border-slate-300 flex items-center justify-center mb-4 mx-auto">
                 <div className="flex flex-wrap gap-0.5 justify-center p-2">
                    {Array.from({ length: Math.min(sliceStats.branchCount, 12) }).map((_, idx) => (
                      <div key={idx} className="w-2 h-2 rounded-full bg-amber-400/50" />
                    ))}
                 </div>
              </div>
              <p className="text-2xl font-black text-slate-800 tabular-nums">
                {(sliceStats.currentSum * conversionFactor).toFixed(2)}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{sliceStats.branchCount} Nodes</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-amber-100/50 text-center">
            <p className="text-[10px] font-bold text-amber-800/60 leading-relaxed max-w-[240px] mx-auto">
              "All the branches of a tree at every stage of its height when put together are equal in thickness to the trunk."
            </p>
            <p className="text-[9px] font-black text-amber-900 uppercase mt-2 opacity-40">— Leonardo da Vinci</p>
          </div>
        </div>

        <section className="space-y-8 pt-4">
          <ControlSlider 
            label="Measuring Height" 
            value={sliceHeight} 
            min={0.1} max={6.5} step={0.1} unit="ft"
            highlight
            onChange={(v) => setSliceHeight(v)} 
          />

          <ControlSlider 
            label="Leonardo Exponent (n)" 
            value={params.exponent} 
            min={1.5} max={2.5} step={0.01}
            onChange={(v) => updateParam('exponent', v)} 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <ControlSlider 
              label="Trunk Girth" 
              value={params.trunkThickness} 
              min={0.1} max={0.6} step={0.01}
              onChange={(v) => updateParam('trunkThickness', v)} 
            />
            <ControlSlider 
              label="Limb Scale" 
              value={params.branchThickness} 
              min={0.8} max={1.2} step={0.01}
              onChange={(v) => updateParam('branchThickness', v)} 
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Reference Species</label>
             <div className="grid grid-cols-2 gap-2">
                {Object.values(TreeSpecies).map(s => (
                  <button 
                    key={s}
                    onClick={() => setParams(SPECIES_DEFAULTS[s])}
                    className={`text-[10px] font-black py-3 px-2 rounded-xl border transition-all ${params.species === s ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}`}
                  >
                    {s}
                  </button>
                ))}
             </div>
          </div>
        </section>
      </div>
      
      <div className="mt-auto pt-10 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">Da Vinci Laboratory v7.0</p>
      </div>
    </div>
  );
};

const ControlSlider: React.FC<{ label: string; value: number; min: number; max: number; step: number; unit?: string; highlight?: boolean; onChange: (v: number) => void }> = ({ label, value, min, max, step, unit = '', highlight = false, onChange }) => (
  <div className="group">
    <div className="flex justify-between items-end mb-3 px-0.5">
      <label className={`text-[10px] font-black uppercase tracking-widest transition-colors ${highlight ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {label}
      </label>
      <span className={`text-[11px] font-black tabular-nums px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 ${highlight ? 'text-blue-600' : 'text-slate-800'}`}>
        {value.toFixed(step >= 1 ? 0 : 2)}{unit}
      </span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className={`w-full h-2 rounded-full appearance-none cursor-pointer transition-all ${highlight ? 'bg-blue-100 accent-blue-600' : 'bg-slate-200 accent-slate-800'}`}
    />
  </div>
);

export default Sidebar;
