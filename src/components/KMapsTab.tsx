import React, { useState } from 'react';
import type { OutputType } from '../types';
import KMapView from './KMapView';

interface KMapsTabProps {
  kmaps: Record<OutputType, number[][]>;
}

const KMapsTab: React.FC<KMapsTabProps> = ({ kmaps }) => {
  const outputs: OutputType[] = ['C2', 'C1', 'C0'];
  const [expandedOutput, setExpandedOutput] = useState<OutputType | null>(null);

  const handleToggle = (output: OutputType) => {
    setExpandedOutput(expandedOutput === output ? null : output);
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className={`grid gap-3 sm:gap-4 ${
        expandedOutput 
          ? 'grid-cols-1' 
          : 'grid-cols-1 lg:grid-cols-3'
      }`}
      style={{ transition: 'grid-template-columns 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        {outputs.map(output => (
          <div
            key={output}
            style={{
              transformOrigin: 'top left',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            className={`${
              expandedOutput && expandedOutput !== output
                ? 'opacity-0 scale-0 h-0 pointer-events-none'
                : 'opacity-100 scale-100'
            }`}
          >
            <KMapView
              output={output}
              kmap={kmaps[output]}
              isExpanded={expandedOutput === output}
              onToggle={() => handleToggle(output)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default KMapsTab;
