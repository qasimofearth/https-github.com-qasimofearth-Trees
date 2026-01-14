
import { TreeSpecies, TreeParams } from './types';

export const SPECIES_DEFAULTS: Record<TreeSpecies, TreeParams> = {
  [TreeSpecies.COAST_REDWOOD]: {
    branchingAngle: 25,
    depth: 7,
    lengthRatio: 0.88,
    exponent: 2.1,
    trunkThickness: 0.45,
    branchThickness: 1.0,
    species: TreeSpecies.COAST_REDWOOD,
    randomness: 0.05
  },
  [TreeSpecies.DOUGLAS_FIR]: {
    branchingAngle: 40,
    depth: 7,
    lengthRatio: 0.82,
    exponent: 1.85,
    trunkThickness: 0.35,
    branchThickness: 0.95,
    species: TreeSpecies.DOUGLAS_FIR,
    randomness: 0.12
  },
  [TreeSpecies.BAY_LAUREL]: {
    branchingAngle: 35,
    depth: 6,
    lengthRatio: 0.78,
    exponent: 2.0,
    trunkThickness: 0.28,
    branchThickness: 1.05,
    species: TreeSpecies.BAY_LAUREL,
    randomness: 0.25
  },
  [TreeSpecies.PONDEROSA_PINE]: {
    branchingAngle: 50,
    depth: 7,
    lengthRatio: 0.84,
    exponent: 1.95,
    trunkThickness: 0.38,
    branchThickness: 1.0,
    species: TreeSpecies.PONDEROSA_PINE,
    randomness: 0.08
  }
};

export const SPECIES_INFO = {
  [TreeSpecies.COAST_REDWOOD]: "Coast Redwoods show extreme apical dominance, forming a massive central pillar with short, horizontal, water-collecting branches.",
  [TreeSpecies.DOUGLAS_FIR]: "Douglas Firs are quintessential conic trees. Their architecture ensures that heavy snow loads slide off the tapered branches rather than breaking them.",
  [TreeSpecies.BAY_LAUREL]: "The Bay Laurel is a broadleaf tree. Without the conic requirement of snow-shedding, it grows in a more rounded, chaotic 'bushy' volume.",
  [TreeSpecies.PONDEROSA_PINE]: "Ponderosa Pines exhibit clear whorled branching. Their conic shape in youth maximizes sunlight capture in the open mountain forests."
};
