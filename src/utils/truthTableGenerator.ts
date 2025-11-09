import type { TruthTableRow } from '../types';

export const generateTruthTable = (): TruthTableRow[] => {
  return [
    { D: 0, A1: 0, A0: 0, B1: 0, B0: 0, C2: 0, C1: 0, C0: 0 },
    { D: 0, A1: 0, A0: 0, B1: 0, B0: 1, C2: 0, C1: 0, C0: 1 },
    { D: 0, A1: 0, A0: 0, B1: 1, B0: 0, C2: 0, C1: 1, C0: 0 },
    { D: 0, A1: 0, A0: 0, B1: 1, B0: 1, C2: 0, C1: 1, C0: 1 },
    { D: 0, A1: 0, A0: 1, B1: 0, B0: 0, C2: 0, C1: 0, C0: 1 },
    { D: 0, A1: 0, A0: 1, B1: 0, B0: 1, C2: 0, C1: 1, C0: 0 },
    { D: 0, A1: 0, A0: 1, B1: 1, B0: 0, C2: 0, C1: 1, C0: 1 },
    { D: 0, A1: 0, A0: 1, B1: 1, B0: 1, C2: 1, C1: 0, C0: 0 },
    { D: 0, A1: 1, A0: 0, B1: 0, B0: 0, C2: 0, C1: 1, C0: 0 },
    { D: 0, A1: 1, A0: 0, B1: 0, B0: 1, C2: 0, C1: 1, C0: 1 },
    { D: 0, A1: 1, A0: 0, B1: 1, B0: 0, C2: 1, C1: 0, C0: 0 },
    { D: 0, A1: 1, A0: 0, B1: 1, B0: 1, C2: 1, C1: 0, C0: 1 },
    { D: 0, A1: 1, A0: 1, B1: 0, B0: 0, C2: 0, C1: 1, C0: 1 },
    { D: 0, A1: 1, A0: 1, B1: 0, B0: 1, C2: 1, C1: 0, C0: 0 },
    { D: 0, A1: 1, A0: 1, B1: 1, B0: 0, C2: 1, C1: 0, C0: 1 },
    { D: 0, A1: 1, A0: 1, B1: 1, B0: 1, C2: 1, C1: 1, C0: 0 },
    { D: 1, A1: 0, A0: 0, B1: 0, B0: 0, C2: 0, C1: 0, C0: 0 },
    { D: 1, A1: 0, A0: 0, B1: 0, B0: 1, C2: 1, C1: 1, C0: 1 },
    { D: 1, A1: 0, A0: 0, B1: 1, B0: 0, C2: 1, C1: 1, C0: 0 },
    { D: 1, A1: 0, A0: 0, B1: 1, B0: 1, C2: 1, C1: 0, C0: 1 },
    { D: 1, A1: 0, A0: 1, B1: 0, B0: 0, C2: 0, C1: 0, C0: 1 },
    { D: 1, A1: 0, A0: 1, B1: 0, B0: 1, C2: 0, C1: 0, C0: 0 },
    { D: 1, A1: 0, A0: 1, B1: 1, B0: 0, C2: 1, C1: 1, C0: 1 },
    { D: 1, A1: 0, A0: 1, B1: 1, B0: 1, C2: 1, C1: 1, C0: 0 },
    { D: 1, A1: 1, A0: 0, B1: 0, B0: 0, C2: 0, C1: 1, C0: 0 },
    { D: 1, A1: 1, A0: 0, B1: 0, B0: 1, C2: 0, C1: 0, C0: 1 },
    { D: 1, A1: 1, A0: 0, B1: 1, B0: 0, C2: 0, C1: 0, C0: 0 },
    { D: 1, A1: 1, A0: 0, B1: 1, B0: 1, C2: 1, C1: 1, C0: 1 },
    { D: 1, A1: 1, A0: 1, B1: 0, B0: 0, C2: 0, C1: 1, C0: 1 },
    { D: 1, A1: 1, A0: 1, B1: 0, B0: 1, C2: 0, C1: 1, C0: 0 },
    { D: 1, A1: 1, A0: 1, B1: 1, B0: 0, C2: 0, C1: 0, C0: 1 },
    { D: 1, A1: 1, A0: 1, B1: 1, B0: 1, C2: 0, C1: 0, C0: 0 },
  ];
};

export const generateKMap = (truthTable: TruthTableRow[], output: 'C2' | 'C1' | 'C0'): number[][] => {
  const kmap: number[][] = Array(8).fill(0).map(() => Array(4).fill(0));
  
  truthTable.forEach(row => {
    const rowIndex = row.D * 4 + row.A1 * 2 + row.A0;
    const colIndex = row.B1 * 2 + row.B0;
    kmap[rowIndex][colIndex] = row[output];
  });
  
  return kmap;
};
