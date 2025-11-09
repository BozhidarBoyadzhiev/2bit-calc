import React from 'react';
import type { TruthTableRow, OutputType } from '../types';

interface TruthTableProps {
  data: TruthTableRow[];
  highlightedOutput: OutputType | null;
  selectedRows: Set<number>;
  onOutputClick: (output: OutputType | null) => void;
  onRowClick: (index: number) => void;
}

const TruthTable: React.FC<TruthTableProps> = ({
  data,
  highlightedOutput,
  selectedRows,
  onOutputClick,
  onRowClick
}) => {
  const outputs: OutputType[] = ['C2', 'C1', 'C0'];

  const handleOutputClick = (output: OutputType) => {
    onOutputClick(highlightedOutput === output ? null : output);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-blue-400 text-white">
            <th className="border border-blue-500 px-4 py-2">#</th>
            <th className="border border-blue-500 px-4 py-2">D</th>
            <th className="border border-blue-500 px-4 py-2">A1</th>
            <th className="border border-blue-500 px-4 py-2">A0</th>
            <th className="border border-blue-500 px-4 py-2">B1</th>
            <th className="border border-blue-500 px-4 py-2">B0</th>
            {outputs.map(output => (
              <th
                key={output}
                className="border border-blue-500 px-4 py-2 cursor-pointer hover:bg-blue-500 transition-colors"
                onClick={() => handleOutputClick(output)}
                title={`Click to highlight rows where ${output}=1`}
              >
                {output} {highlightedOutput === output && '✓'}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-mono">
          {data.map((row, idx) => {
            const shouldHighlight = highlightedOutput && row[highlightedOutput] === 1;
            const isRowSelected = selectedRows.has(idx);
            const isHighlighted = shouldHighlight || isRowSelected;

            return (
              <tr
                key={idx}
                onClick={() => onRowClick(idx)}
                className={`cursor-pointer transition-colors ${
                  isHighlighted
                    ? isRowSelected
                      ? 'bg-green-100 ring-2 ring-green-400'
                      : 'bg-yellow-100 ring-2 ring-yellow-400'
                    : idx % 2 === 0 ? 'bg-gray-50 hover:bg-blue-50' : 'bg-white hover:bg-blue-50'
                }`}
                title="Click to highlight/unhighlight this row"
              >
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-500">{idx + 1}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{row.D}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{row.A1}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{row.A0}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{row.B1}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{row.B0}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-bold text-blue-600">{row.C2}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-bold text-blue-600">{row.C1}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-bold text-blue-600">{row.C0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TruthTable;
