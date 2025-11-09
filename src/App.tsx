import React, { useState, useMemo } from 'react';
import type { TabType, OutputType } from './types';
import { generateTruthTable, generateKMap } from './utils/truthTableGenerator';
import { useToggleSet } from './hooks/useToggleSet';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import TruthTable from './components/TruthTable';
import KMapsTab from './components/KMapsTab';
import CircuitTab from './components/CircuitTab';

const BitCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('truth');
  const [highlightedOutput, setHighlightedOutput] = useState<OutputType | null>(null);
  
  const { set: selectedRows, toggle: toggleRowSelection } = useToggleSet<number>();

  const truthTable = useMemo(() => generateTruthTable(), []);
  
  const kmaps = useMemo(() => ({
    C2: generateKMap(truthTable, 'C2'),
    C1: generateKMap(truthTable, 'C1'),
    C0: generateKMap(truthTable, 'C0')
  }), [truthTable]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Header />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="bg-white rounded-b-xl shadow-lg p-3 sm:p-5 md:p-8">
          {activeTab === 'truth' && (
            <TruthTable
              data={truthTable}
              highlightedOutput={highlightedOutput}
              selectedRows={selectedRows}
              onOutputClick={setHighlightedOutput}
              onRowClick={toggleRowSelection}
            />
          )}

          {activeTab === 'kmap' && (
            <KMapsTab kmaps={kmaps} />
          )}

          {activeTab === 'circuit' && <CircuitTab />}
        </div>
      </div>
    </div>
  );
};

export default BitCalculator;