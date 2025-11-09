import React from 'react';

interface KMapCellProps {
  value: number;
  highlight?: boolean;
}

const KMapCell: React.FC<KMapCellProps> = ({ value, highlight }) => (
  <div
    className={`w-12 h-12 flex items-center justify-center border font-mono text-lg font-semibold
      ${value === 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-400'}
      ${highlight ? 'ring-2 ring-yellow-400' : ''}`}
  >
    {value}
  </div>
);

export default KMapCell;
