import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-xl p-4 sm:p-6 mb-4 md:mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl">🔢</span>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              2-Bit Calculator Visualizer
            </h1>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 text-white text-xs sm:text-sm">
          {/* Inputs */}
          <div className="flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
              <span className="font-semibold text-yellow-300">5 Inputs:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-green-500/20 px-2 py-1 rounded border border-green-300/30 text-green-100">D (Mode)</span>
              <span className="bg-green-500/20 px-2 py-1 rounded border border-green-300/30 text-green-100">A₁, A₀</span>
              <span className="bg-blue-500/20 px-2 py-1 rounded border border-blue-300/30 text-blue-100">B₁, B₀</span>
            </div>
          </div>
          
          {/* Outputs */}
          <div className="flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
              <span className="font-semibold text-green-300">3 Outputs:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-purple-500/20 px-2 py-1 rounded border border-purple-300/30 text-purple-100">C₂, C₁, C₀</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
