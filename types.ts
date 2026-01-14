
export enum TreeSpecies {
  COAST_REDWOOD = 'Coast Redwood',
  DOUGLAS_FIR = 'Douglas Fir',
  BAY_LAUREL = 'California Bay Laurel',
  PONDEROSA_PINE = 'Ponderosa Pine'
}

export enum ObservationMode {
  PIPE_MODEL = 'Pipe Model (System)',
  CONICAL_TAPER = 'Conical Taper (Individual)'
}

export interface TreeParams {
  branchingAngle: number;
  depth: number;
  lengthRatio: number;
  exponent: number;
  trunkThickness: number;
  branchThickness: number;
  species: TreeSpecies;
  randomness: number;
}

export interface BranchData {
  start: [number, number, number];
  end: [number, number, number];
  radius: number;
  depth: number;
  volume: number;
  isMainPath: boolean;
}

export interface SliceStats {
  trunkArea: number;
  currentSum: number;
  branchCount: number;
  branchAreas: number[];
  height: number;
}
