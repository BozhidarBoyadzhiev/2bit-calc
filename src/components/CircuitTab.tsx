import React, { useState, useMemo } from 'react';

const LogisimCircuit: React.FC = () => {
  const [D, setD] = useState(0);
  const [A1, setA1] = useState(0);
  const [A0, setA0] = useState(0);
  const [B1, setB1] = useState(0);
  const [B0, setB0] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isImageZoomed || !containerRef.current) return;
    e.preventDefault();
    setIsDragging(true);
    setHasDragged(false);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
    setScrollStart({
      x: containerRef.current.scrollLeft,
      y: containerRef.current.scrollTop
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    
    const deltaX = dragStart.x - e.clientX;
    const deltaY = dragStart.y - e.clientY;
    
    // Mark as dragged if moved more than 5 pixels
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      setHasDragged(true);
    }
    
    containerRef.current.scrollLeft = scrollStart.x + deltaX;
    containerRef.current.scrollTop = scrollStart.y + deltaY;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging && hasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    // Only toggle zoom if we didn't drag
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      setHasDragged(false);
      return;
    }
    
    if (!isImageZoomed && containerRef.current) {
      // Zooming in - center on click position
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setIsImageZoomed(true);
      
      // After zoom, scroll to center the clicked position
      setTimeout(() => {
        if (containerRef.current) {
          // At 2x zoom, we need to scroll to keep the click point centered
          const scrollX = x * 2 - rect.width / 2;
          const scrollY = y * 2 - rect.height / 2;
          
          containerRef.current.scrollLeft = Math.max(0, scrollX);
          containerRef.current.scrollTop = Math.max(0, scrollY);
        }
      }, 0);
    } else {
      // Zooming out - reset to normal
      setIsImageZoomed(false);
    }
  };

  const circuit = useMemo(() => {
    // 2-bit Adder/Subtractor Circuit
    // When D=0: C = A + B (addition)
    // When D=1: C = A - B (subtraction)
    
    // Convert inputs to numbers
    const A = (A1 << 1) | A0;  // 2-bit number A
    const B = (B1 << 1) | B0;  // 2-bit number B
    
    let result: number;
    
    if (D === 0) {
      // Addition mode
      result = A + B;
    } else {
      // Subtraction mode
      result = A - B;
      // Handle negative results in 2's complement (3-bit signed)
      if (result < 0) {
        result = (1 << 3) + result; // Convert to 3-bit 2's complement
      }
    }
    
    // Extract output bits
    const C0 = (result >> 0) & 1;
    const C1 = (result >> 1) & 1;
    const C2 = (result >> 2) & 1;
    
    return { C0, C1, C2 };
  }, [D, A1, A0, B1, B0]);

  // Calculate decimal values
  const A_decimal = (A1 << 1) | A0;
  const B_decimal = (B1 << 1) | B0;
  
  // Calculate C decimal
  const C_raw = (circuit.C2 << 2) | (circuit.C1 << 1) | circuit.C0;
  // For subtraction (D=1), interpret as signed (two's complement)
  // For addition (D=0), interpret as unsigned
  const C_decimal = D === 1 && circuit.C2 === 1 ? C_raw - 8 : C_raw;
  
  const operation = D === 0 ? '+' : '-';
  const operationName = D === 0 ? 'Addition' : 'Subtraction';

  return (
    <div className="space-y-6">
      {/* Information Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
          <h3 className="font-bold text-2xl text-white flex items-center gap-3">
            <span className="text-3xl">⚡</span>
            2-Bit Adder/Subtractor Circuit
          </h3>
        </div>
        
        <div className="p-6 space-y-5">
          {/* Operation Display */}
          <div className="bg-white rounded-lg p-5 shadow-md border border-indigo-100">
            <div className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Current Operation: <span className="text-indigo-600">{operationName}</span>
            </div>
            
            {/* Equation Display */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 text-center flex-wrap">
              {/* Input A */}
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1">Input 1</div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 min-w-[80px] sm:min-w-[100px]">
                  <div className="font-mono text-xs sm:text-sm text-gray-600">{A1}{A0}<sub>2</sub></div>
                  <div className="text-xl sm:text-2xl font-bold text-green-700">{A_decimal}</div>
                </div>
              </div>

              {/* Operator */}
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1 opacity-0">Op</div>
                <div className="text-3xl sm:text-4xl font-bold text-indigo-600 px-2 sm:px-3">
                  {operation}
                </div>
              </div>

              {/* Input B */}
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1">Input 2</div>
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 min-w-[80px] sm:min-w-[100px]">
                  <div className="font-mono text-xs sm:text-sm text-gray-600">{B1}{B0}<sub>2</sub></div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-700">{B_decimal}</div>
                </div>
              </div>

              {/* Equals */}
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1 opacity-0">=</div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-400 px-2 sm:px-3">
                  =
                </div>
              </div>

              {/* Output C */}
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1">Output</div>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 min-w-[80px] sm:min-w-[100px]">
                  <div className="font-mono text-xs sm:text-sm text-gray-600">{circuit.C2}{circuit.C1}{circuit.C0}<sub>2</sub></div>
                  <div className="text-xl sm:text-2xl font-bold text-purple-700">{C_decimal}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Inputs */}
          <div className="bg-white rounded-lg p-3 sm:p-5 shadow-md border border-indigo-100">
            <div className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Control & Inputs
            </div>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {/* Mode Control */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setD(D ? 0 : 1)}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full font-bold text-lg sm:text-xl transition-all transform active:scale-95 sm:hover:scale-110 shadow-lg ${
                    D === 0
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white ring-2 sm:ring-4 ring-green-200'
                      : 'bg-gradient-to-br from-red-400 to-rose-500 text-white ring-2 sm:ring-4 ring-red-200'
                  }`}
                >
                  {D === 0 ? '+' : '−'}
                </button>
                <div className="text-[10px] sm:text-xs font-semibold text-gray-600 mt-1 sm:mt-2">D (Mode)</div>
                <div className="text-[9px] sm:text-xs text-gray-500 hidden sm:block">{D === 0 ? 'Add' : 'Sub'}</div>
              </div>

              {/* Input A1 */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setA1(A1 ? 0 : 1)}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full font-bold text-xl sm:text-2xl transition-all transform active:scale-95 sm:hover:scale-110 shadow-lg ${
                    A1
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white ring-2 sm:ring-4 ring-green-200'
                      : 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700 ring-2 sm:ring-4 ring-gray-200'
                  }`}
                >
                  {A1}
                </button>
                <div className="text-[10px] sm:text-xs font-semibold text-gray-600 mt-1 sm:mt-2">A<sub>1</sub></div>
              </div>

              {/* Input A0 */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setA0(A0 ? 0 : 1)}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full font-bold text-xl sm:text-2xl transition-all transform active:scale-95 sm:hover:scale-110 shadow-lg ${
                    A0
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white ring-2 sm:ring-4 ring-green-200'
                      : 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700 ring-2 sm:ring-4 ring-gray-200'
                  }`}
                >
                  {A0}
                </button>
                <div className="text-[10px] sm:text-xs font-semibold text-gray-600 mt-1 sm:mt-2">A<sub>0</sub></div>
              </div>

              {/* Input B1 */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setB1(B1 ? 0 : 1)}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full font-bold text-xl sm:text-2xl transition-all transform active:scale-95 sm:hover:scale-110 shadow-lg ${
                    B1
                      ? 'bg-gradient-to-br from-blue-400 to-sky-500 text-white ring-2 sm:ring-4 ring-blue-200'
                      : 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700 ring-2 sm:ring-4 ring-gray-200'
                  }`}
                >
                  {B1}
                </button>
                <div className="text-[10px] sm:text-xs font-semibold text-gray-600 mt-1 sm:mt-2">B<sub>1</sub></div>
              </div>

              {/* Input B0 */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setB0(B0 ? 0 : 1)}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full font-bold text-xl sm:text-2xl transition-all transform active:scale-95 sm:hover:scale-110 shadow-lg ${
                    B0
                      ? 'bg-gradient-to-br from-blue-400 to-sky-500 text-white ring-2 sm:ring-4 ring-blue-200'
                      : 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700 ring-2 sm:ring-4 ring-gray-200'
                  }`}
                >
                  {B0}
                </button>
                <div className="text-[10px] sm:text-xs font-semibold text-gray-600 mt-1 sm:mt-2">B<sub>0</sub></div>
              </div>
            </div>
            
            <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-500 italic">
              💡 Click the buttons above to toggle input values and see the circuit respond in real-time
            </div>
          </div>
        </div>
      </div>

      {/* Circuit Diagram */}
      <div className="bg-white border-2 border-gray-300 p-4 rounded-xl shadow-lg">
        <h4 className="font-bold text-lg mb-3 text-gray-700 flex items-center gap-2">
          <span>🔌</span> Logic Gate Circuit Diagram
        </h4>
        <div className="text-sm text-gray-500 mb-4">
          The circuit shows the internal logic gates implementing the 2-bit adder/subtractor functionality.
          <span className="block sm:hidden text-indigo-600 font-semibold mt-1">
            👆 Tap image to zoom
          </span>
        </div>
        <div 
          ref={containerRef}
          className={`relative ${isImageZoomed ? 'overflow-auto' : 'overflow-hidden'}`}
          style={isImageZoomed ? { maxHeight: '70vh' } : {}}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className={`relative inline-block ${isImageZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
            onClick={handleImageClick}
            onMouseDown={handleMouseDown}
            style={isImageZoomed ? { minWidth: '200%', userSelect: 'none' } : { width: '100%' }}
          >
            <img 
              src="/src/assets/circuit.png" 
              alt="2-Bit Adder/Subtractor Circuit Diagram" 
              className={`w-full h-auto transition-transform duration-300 ${
                isImageZoomed ? 'scale-200 sm:scale-100' : 'scale-100'
              }`}
            />
            
            {/* Overlay lights for inputs and outputs - responsive positioning */}
            {/* Light size is 1.5% of image width for better scaling */}
            
            {/* Input D light */}
            {D === 1 && (
              <div 
                className="absolute rounded-full animate-pulse shadow-lg shadow-green-400/50 bg-green-400 border-2 border-green-300 pointer-events-none"
                style={{ 
                  left: '2.2%', 
                  top: '0%', 
                  width: '1.5%',
                  height: 'auto',
                  aspectRatio: '1',
                  opacity: 0.9 
                }}
                title="D input ON"
              />
            )}
            
            {/* Input A1 light */}
            {A1 === 1 && (
              <div 
                className="absolute rounded-full animate-pulse shadow-lg shadow-green-400/50 bg-green-400 border-2 border-green-300 pointer-events-none"
                style={{ 
                  left: '2.7%', 
                  top: '21.7%', 
                  width: '1.5%',
                  height: 'auto',
                  aspectRatio: '1',
                  opacity: 0.9 
                }}
                title="A1 input ON"
              />
            )}
            
            {/* Input A0 light */}
            {A0 === 1 && (
              <div 
                className="absolute rounded-full animate-pulse shadow-lg shadow-green-400/50 bg-green-400 border-2 border-green-300 pointer-events-none"
                style={{ 
                  left: '2.7%', 
                  top: '46.5%', 
                  width: '1.5%',
                  height: 'auto',
                  aspectRatio: '1',
                  opacity: 0.9 
                }}
                title="A0 input ON"
              />
            )}
            
            {/* Input B1 light */}
            {B1 === 1 && (
              <div 
                className="absolute rounded-full animate-pulse shadow-lg shadow-blue-400/50 bg-blue-400 border-2 border-blue-300 pointer-events-none"
                style={{ 
                  left: '2.2%', 
                  top: '74%', 
                  width: '1.5%',
                  height: 'auto',
                  aspectRatio: '1',
                  opacity: 0.9 
                }}
                title="B1 input ON"
              />
            )}
            
            {/* Input B0 light */}
            {B0 === 1 && (
              <div 
                className="absolute rounded-full animate-pulse shadow-lg shadow-blue-400/50 bg-blue-400 border-2 border-blue-300 pointer-events-none"
                style={{ 
                  left: '2.2%', 
                  top: '93%', 
                  width: '1.5%',
                  height: 'auto',
                  aspectRatio: '1',
                  opacity: 0.9 
                }}
                title="B0 input ON"
              />
            )}
            
            {/* Output C2 light */}
            {circuit.C2 === 1 && (
              <div 
                className="absolute rounded-full animate-pulse shadow-lg shadow-red-400/50 bg-red-400 border-2 border-red-300 pointer-events-none"
                style={{ 
                  left: '96.3%', 
                  top: '9.7%', 
                  width: '1.5%',
                  height: 'auto',
                  aspectRatio: '1',
                  opacity: 0.9 
                }}
                title="C2 output ON"
              />
            )}
            
            {/* Output C1 light */}
            {circuit.C1 === 1 && (
              <div 
                className="absolute rounded-full animate-pulse shadow-lg shadow-red-400/50 bg-red-400 border-2 border-red-300 pointer-events-none"
                style={{ 
                  left: '96.3%', 
                  top: '46.6%', 
                  width: '1.5%',
                  height: 'auto',
                  aspectRatio: '1',
                  opacity: 0.9 
                }}
                title="C1 output ON"
              />
            )}
            
            {/* Output C0 light */}
            {circuit.C0 === 1 && (
              <div 
                className="absolute rounded-full animate-pulse shadow-lg shadow-red-400/50 bg-red-400 border-2 border-red-300 pointer-events-none"
                style={{ 
                  left: '96.85%', 
                  top: '89.9%', 
                  width: '1.5%',
                  height: 'auto',
                  aspectRatio: '1',
                  opacity: 0.9 
                }}
                title="C0 output ON"
              />
            )}
          </div>
        </div>
        
        {isImageZoomed && (
          <div className="mt-3 text-center text-sm text-indigo-600 font-semibold sm:hidden">
            👆 Tap again to zoom out • Scroll to pan around
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisimCircuit;