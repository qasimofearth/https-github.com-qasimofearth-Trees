import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment, ContactShadows } from '@react-three/drei';
import RecursiveTree from './RecursiveTree';
import { TreeParams, SliceStats, ObservationMode } from '../types';
import * as THREE from 'three';

interface TreeCanvasProps {
  params: TreeParams;
  sliceHeight: number;
  mode: ObservationMode;
  onUpdateStats: (volume: number, sliceStats: SliceStats) => void;
}

const TreeCanvas: React.FC<TreeCanvasProps> = ({ params, sliceHeight, mode, onUpdateStats }) => {
  return (
    <div className="w-full h-full bg-slate-50 relative">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[6, 4, 10]} fov={40} />
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} />
        
        <Suspense fallback={null}>
          <Environment preset="forest" />
          <ambientLight intensity={0.6} />
          <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
          
          <RecursiveTree 
            params={params} 
            sliceHeight={sliceHeight} 
            mode={mode}
            onUpdateStats={onUpdateStats} 
          />

          {/* Measuring Plane (Visible in Pipe Model mode) */}
          {mode === ObservationMode.PIPE_MODEL && (
            <group position={[0, -2.5 + sliceHeight, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0, 4.5, 64]} />
                <meshBasicMaterial color="#ef4444" transparent opacity={0.15} side={THREE.DoubleSide} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[4.45, 4.5, 64]} />
                <meshBasicMaterial color="#ef4444" side={THREE.DoubleSide} />
              </mesh>
            </group>
          )}
          
          <ContactShadows position={[0, -2.5, 0]} opacity={0.3} scale={15} blur={3} far={10} color="#223322" />
          <Grid infiniteGrid fadeDistance={25} fadeStrength={4} sectionSize={1} cellSize={0.5} position={[0, -2.51, 0]} sectionColor="#cbd5e1" cellColor="#f1f5f9" />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-8 right-8 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl shadow-xl border border-white/50 text-right">
          <p className="text-[9px] uppercase tracking-[0.3em] text-emerald-600 font-black mb-1">Observation Target</p>
          <h2 className="text-xl font-black text-slate-800 italic leading-tight">{params.species}</h2>
          <div className="flex justify-end items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Live Mathematical Proof</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeCanvas;