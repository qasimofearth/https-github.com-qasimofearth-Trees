
import React, { useState, useEffect, useMemo } from 'react';
import { TreeParams, TreeSpecies, SliceStats, ObservationMode } from '../types';
import { SPECIES_DEFAULTS } from '../constants';
import { getTreeInsights } from '../services/geminiService';

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
  volume, 
  sliceStats
}) => {
  const [insight, setInsight] = useState<string>('Analyzing botanical logic...');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      const text = await getTreeInsights(params);
      setInsight(text);
      setLoading(false);
    };

    const timer = setTimeout(fetchInsight, 1000);
    return () => clearTimeout(timer);
  }, [params]);

  const updateParam = (key: keyof TreeParams, value: any) => {
    setParams({ ...params, [key]: value });
  };

  const heightPercent = ((sliceHeight / 6.8) * 100).toFixed(0);
  const conversionFactor = 10.7639;

  // Realism calculation: Leonardo's rule is perfectly realistic at exponent 2.0
  // Thickness scaling is realistic when branchThickness is near 1.0
  const realismScore = useMemo(() => {
    const exponentDiff = Math.abs(params.exponent - 2.0);
    const branchDiff = Math.abs(params.branchThickness - 1.0);
    const score = Math.max(0, 100 - (exponentDiff * 50) - (branchDiff * 100));
    return Math.round(score);
  }, [params.exponent, params.branchThickness]);

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-y-auto bg-white border-l border-slate-200 font-sans">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-[#a65d1a] tracking-tight leading-none">Rule of Trees</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Leonardo's Botanical Math</p>
        </div>
        <div className="w-8 h-8 bg-[#a65d1a] rounded-lg flex items-center justify-center text-white font-black italic">L</div>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-xl mb-6 shadow-inner">
        {Object.values(ObservationMode).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2.5 px-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {m === ObservationMode.PIPE_MODEL ? 'System (Pipe)' : 'Taper (Path)'}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Realism Status Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Biological Realism</p>
                <p className="text-sm font-bold text-slate-700">
                    {realismScore > 85 ? 'Highly Accurate' : realismScore > 60 ? 'Stressed Specimen' : 'Mathematical Theory'}
                </p>
            </div>
            <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-200" />
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" 
                        strokeDasharray={126} 
                        strokeDashoffset={126 - (126 * realismScore) / 100}
                        className={realismScore > 85 ? 'text-emerald-500' : realismScore > 60 ? 'text-amber-500' : 'text-rose-500'} 
                    />
                </svg>
                <span className="absolute text-[10px] font-black">{realismScore}%</span>
            </div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-600'}`}></div>
            <h3 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Botanist's Insights</h3>
          </div>
          <p className={`text-xs text-emerald-900 leading-relaxed italic transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
            "{insight}"
          </p>
        </div>

        <div className="bg-[#fffdf0] rounded-2xl p-6 border border-amber-100 shadow-sm transition-all">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-[#a65d1a] mb-1">
              A₀ ≈ Σ Aₙ
            </h2>
            <p className="text-[#a65d1a] text-[11px] font-black uppercase tracking-widest opacity-80">
              Cross-section Area Conservation
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-around items-center gap-8 mb-4">
            <div className="text-center">
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-3">Base (A₀)</p>
              <div className="w-20 h-20 rounded-full bg-[#fef3c7] border-2 border-[#a65d1a]/20 flex items-center justify-center mb-3 mx-auto shadow-sm">
                <span className="text-2xl font-black text-[#a65d1a]">Trunk</span>
              </div>
              <p className="text-xl font-black text-slate-800 tabular-nums">
                {(sliceStats.trunkArea * conversionFactor).toFixed(1)} <span className="text-[10px] text-slate-400">ft²</span>
              </p>
            </div>

            <div className="text-center">
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-3">Upper Area Sum</p>
              <div className="flex gap-2 justify-center mb-3">
                 <div className="w-16 h-16 rounded-full bg-[#fef3c7] border border-[#a65d1a]/10 flex items-center justify-center shadow-sm">
                    <span className="text-[10px] font-black text-[#a65d1a]">Slices</span>
                  </div>
              </div>
              <p className="text-xl font-black text-slate-800 tabular-nums">
                {(sliceStats.currentSum * conversionFactor).toFixed(1)} <span className="text-[10px] text-slate-400">ft²</span>
              </p>
            </div>
          </div>
        </div>

        <section className="space-y-6 pt-4 border-t border-slate-100">
          <ControlSlider 
            label="Trunk Girth (Radius)" 
            value={params.trunkThickness} 
            min={0.1} max={0.6} step={0.01}
            onChange={(v) => updateParam('trunkThickness', v)} 
          />

          <ControlSlider 
            label="Branch Mass (Scale)" 
            value={params.branchThickness} 
            min={0.8} max={1.2} step={0.01}
            onChange={(v) => updateParam('branchThickness', v)} 
          />

          <ControlSlider 
            label="Leonardo Exponent (n)" 
            value={params.exponent} 
            min={1.5} max={2.5} step={0.01}
            onChange={(v) => updateParam('exponent', v)} 
          />

          <ControlSlider 
            label="Measuring Height" 
            value={sliceHeight} 
            min={0} max={6.8} step={0.1} unit="ft"
            highlight
            onChange={(v) => setSliceHeight(v)} 
          />

          <div className="pt-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Model Specimen</label>
             <div className="relative">
                <select 
                  value={params.species}
                  onChange={(e) => setParams(SPECIES_DEFAULTS[e.target.value as TreeSpecies])}
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 font-bold outline-none cursor-pointer appearance-none hover:bg-slate-100 transition-colors"
                >
                  {Object.values(TreeSpecies).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </div>
             </div>
          </div>
        </section>
      </div>
      
      <div className="mt-auto pt-6 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Botanical Geometry v6.4</p>
      </div>
    </div>
  );
};

const ControlSlider: React.FC<{ label: string; value: number; min: number; max: number; step: number; unit?: string; highlight?: boolean; onChange: (v: number) => void }> = ({ label, value, min, max, step, unit = '', highlight = false, onChange }) => (
  <div className="group">
    <div className="flex justify-between items-end mb-2 px-0.5">
      <label className={`text-[10px] font-black uppercase tracking-widest transition-colors ${highlight ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {label}
      </label>
      <span className={`text-[11px] font-black tabular-nums px-2 py-0.5 rounded bg-slate-50 border border-slate-100 ${highlight ? 'text-blue-600' : 'text-slate-800'}`}>
        {value.toFixed(step >= 1 ? 0 : 2)}{unit}
      </span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className={`w-full h-1.5 rounded-full appearance-none cursor-pointer transition-all ${highlight ? 'bg-blue-100 accent-blue-600' : 'bg-slate-200 accent-slate-800'}`}
    />
  </div>
);

export default Sidebar;
