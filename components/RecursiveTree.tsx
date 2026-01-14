
import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { TreeParams, BranchData, SliceStats, ObservationMode, TreeSpecies } from '../types';

interface RecursiveTreeProps {
  params: TreeParams;
  sliceHeight: number;
  mode: ObservationMode;
  onUpdateStats: (volume: number, sliceStats: SliceStats) => void;
}

const RecursiveTree: React.FC<RecursiveTreeProps> = ({ params, sliceHeight, mode, onUpdateStats }) => {
  const { branchingAngle, depth, lengthRatio, exponent, randomness, species, trunkThickness, branchThickness } = params;

  const { branches, totalVolume, trunkArea } = useMemo(() => {
    const list: BranchData[] = [];
    const rad = (deg: number) => (deg * Math.PI) / 180;
    let volumeSum = 0;

    const trunkAreaVal = Math.PI * Math.pow(trunkThickness, 2);

    const generate = (
      start: [number, number, number],
      dir: THREE.Vector3,
      currentRadius: number,
      currentDepth: number,
      currentLength: number,
      isMain: boolean
    ) => {
      if (currentDepth <= 0) return;

      const endVec = new THREE.Vector3(...start).add(dir.clone().multiplyScalar(currentLength));
      const end: [number, number, number] = [endVec.x, endVec.y, endVec.z];

      const segmentVolume = Math.PI * Math.pow(currentRadius, 2) * currentLength;
      volumeSum += segmentVolume;

      list.push({ start, end, radius: currentRadius, depth: currentDepth, volume: segmentVolume, isMainPath: isMain });

      // Leonardo's Rule calculation
      let nextRadius = currentRadius / Math.pow(2, 1 / exponent);
      
      // Apply the user's branch mass/thickness tweak
      nextRadius *= branchThickness;

      // BIOLOGICAL REALISM LOCK:
      // In nature, a branch almost never grows thicker than its parent.
      // We cap the child radius at 95% of the parent to ensure a visible taper.
      nextRadius = Math.min(nextRadius, currentRadius * 0.95);

      const isConic = species === TreeSpecies.PONDEROSA_PINE || species === TreeSpecies.DOUGLAS_FIR || species === TreeSpecies.COAST_REDWOOD;
      
      // Main Leader
      const mainLength = currentLength * lengthRatio;
      const mainAngle = rad(branchingAngle * 0.2) + (Math.random() - 0.5) * randomness;
      const axis1 = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2);
      const dir1 = dir.clone().applyAxisAngle(axis1, mainAngle).normalize();
      generate(end, dir1, nextRadius, currentDepth - 1, mainLength, isMain);

      // Lateral Branch
      const lateralLength = isConic ? currentLength * (lengthRatio * 0.7) : currentLength * lengthRatio;
      const lateralAngle = rad(branchingAngle * (isConic ? 1.5 : 1.0)) + (Math.random() - 0.5) * randomness;
      const axis2 = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2);
      const dir2 = dir.clone().applyAxisAngle(axis2, -lateralAngle).normalize();
      generate(end, dir2, nextRadius, currentDepth - 1, lateralLength, false);
    };

    generate([0, -2.5, 0], new THREE.Vector3(0, 1, 0), trunkThickness, depth, 1.8, true);
    return { branches: list, totalVolume: volumeSum, trunkArea: trunkAreaVal };
  }, [branchingAngle, depth, lengthRatio, exponent, randomness, species, trunkThickness, branchThickness]);

  useEffect(() => {
    let currentSum = 0;
    const branchAreas: number[] = [];
    const worldSliceY = -2.5 + sliceHeight;

    branches.forEach(b => {
      const minY = Math.min(b.start[1], b.end[1]);
      const maxY = Math.max(b.start[1], b.end[1]);
      if (worldSliceY >= minY && worldSliceY <= maxY) {
        const area = Math.PI * Math.pow(b.radius, 2);
        currentSum += area;
        branchAreas.push(area);
      }
    });

    onUpdateStats(totalVolume, {
      trunkArea,
      currentSum,
      branchCount: branchAreas.length,
      branchAreas,
      height: sliceHeight
    });
  }, [branches, sliceHeight, totalVolume, trunkArea, onUpdateStats]);

  return (
    <group>
      {branches.map((b, i) => {
        const start = new THREE.Vector3(...b.start);
        const end = new THREE.Vector3(...b.end);
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction.clone().normalize()
        );

        const worldSliceY = -2.5 + sliceHeight;
        const isSliced = mode === ObservationMode.PIPE_MODEL && worldSliceY >= Math.min(b.start[1], b.end[1]) && worldSliceY <= Math.max(b.start[1], b.end[1]);
        
        const isDimmed = mode === ObservationMode.CONICAL_TAPER && !b.isMainPath;
        const isHighlighted = mode === ObservationMode.CONICAL_TAPER && b.isMainPath;

        return (
          <group key={i}>
            <mesh position={midpoint} quaternion={quaternion}>
              <cylinderGeometry args={[b.radius * 0.85, b.radius, length, 8]} />
              <meshStandardMaterial 
                color={isSliced ? "#ef4444" : new THREE.Color(`hsl(25, ${15 + b.depth * 5}%, ${15 + b.depth * 5}%)`)} 
                transparent={isDimmed}
                opacity={isDimmed ? 0.08 : 1.0}
                roughness={0.9}
                emissive={isHighlighted ? "#fbbf24" : (isSliced ? "#f87171" : "#000")}
                emissiveIntensity={isHighlighted ? 0.6 : (isSliced ? 0.4 : 0)}
              />
            </mesh>
            
            {isSliced && (
              <mesh position={[midpoint.x, worldSliceY, midpoint.z]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[b.radius, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.8} side={THREE.DoubleSide} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

export default RecursiveTree;
