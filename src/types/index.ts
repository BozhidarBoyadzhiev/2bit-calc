export interface TruthTableRow {
  D: number;
  A1: number;
  A0: number;
  B1: number;
  B0: number;
  C2: number;
  C1: number;
  C0: number;
}

export type OutputType = 'C2' | 'C1' | 'C0';
export type TabType = 'truth' | 'kmap' | 'circuit';
