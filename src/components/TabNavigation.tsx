import React from 'react';
import type { TabType } from '../types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TAB_LABELS: Record<TabType, string> = {
  truth: 'Truth Table',
  kmap: 'K-Maps',
  circuit: 'Logic Circuit'
};

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: TabType[] = ['truth', 'kmap', 'circuit'];

  return (
    <div className="bg-white rounded-t-xl shadow-lg">
      <div className="flex border-b">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 py-3 px-2 sm:py-4 sm:px-4 md:px-6 text-sm sm:text-base font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-blue-500 text-white border-b-4 border-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="hidden sm:inline">{TAB_LABELS[tab]}</span>
            <span className="sm:hidden">
              {tab === 'truth' ? 'Table' : tab === 'kmap' ? 'K-Maps' : 'Circuit'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
