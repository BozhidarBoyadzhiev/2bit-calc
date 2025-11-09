import React from 'react';
import type { OutputType } from '../types';
import { getBooleanEquation, getCombinedEquation } from '../utils/booleanSimplifier';

interface KMapViewProps {
  output: OutputType;
  kmap: number[][];
  isExpanded: boolean;
  onToggle: () => void;
}

const COL_ORDER = [0, 1, 3, 2];
const COL_LABELS = ['00', '01', '11', '10'];
const ROW_LABELS_D0 = ['00', '01', '11', '10'];
const ROW_LABELS_D1 = ['00', '01', '11', '10'];

// Define groupings for K-maps
// Each group: { rows: [indices], cols: [indices], color: string, label: string }
// borderStyle can specify which borders to hide for wrapping groups
type KMapGroup = {
  rows: number[];
  cols: number[];
  color: string;
  label: string;
  // Optional: specify which borders to show/hide for each cell
  // Format: { row_col: 'top|right|bottom|left' } where missing sides are hidden
  borderStyle?: Record<string, string>;
};

const getKMapGroups = (output: OutputType, isAddition: boolean): KMapGroup[] => {
  if (output === 'C0') {
    // Example: wrapping group on row 1, connecting col 0 and col 3
    // borderStyle format: 'row_col': 'top right bottom left' (include sides to draw)
    return [
      { 
        rows: [1, 3], 
        cols: [0, 2], 
        color: 'rgba(59, 130, 246, 0.25)', 
        label: 'A̅0+B0',
        borderStyle: {
          '1_0': 'top bottom right',  // No left border on col 0 (wraps from right)
          '1_2': 'top bottom left',   // No right border on col 3 (wraps to left)
          '3_2': 'top bottom left',   // No right border on col 3 (wraps to left)
          '3_0': 'top bottom right',   // No right border on col 3 (wraps to left)
        }
      },
      { 
        rows: [2, 0], 
        cols: [1,3], 
        color: 'rgba(38, 255, 0, 0.25)', 
        label: 'A0+B̅0',
        borderStyle: {
          '2_1': 'top left right', 
          '2_3': 'top left right',
          '0_3': 'bottom left right',
          '0_1': 'bottom left right',
        }
      },
    ];
  }
  
  if (output === 'C2') {
    if (isAddition) {
    return [
        { 
          rows: [2, 3], 
          cols: [2, 3], 
          color: 'rgba(59, 130, 246, 0.25)', 
          label: 'A1B1',
          borderStyle: {
            '3_2': 'top right',
            '3_3': 'top left',
            '2_2': 'bottom right',
            '2_3': 'bottom left',
          }
        },
        { 
          rows: [3], 
          cols: [1, 3], 
          color: 'rgba(38, 255, 0, 0.25)', 
          label: 'A1A0B0',
          borderStyle: {
            '3_1': 'top left bottom',
            '3_3': 'top bottom right',
          }
        },
        { 
          rows: [1, 3], 
          cols: [3], 
          color: 'rgba(255, 0, 0, 0.25)', 
          label: 'A0B1B0',
          borderStyle: {
            '1_3': 'top left right',
            '3_3': 'left bottom right',
          }
        },
      ];
    } else {

      return [
        { 
          rows: [0, 1], 
          cols: [2, 3], 
          color: 'rgba(59, 130, 246, 0.25)', 
          label: 'A̅1B1',
          borderStyle: {
            '0_2': 'top right',
            '0_3': 'top left',
            '1_2': 'bottom right',
            '1_3': 'bottom left',
          }
        },
        { 
          rows: [0], 
          cols: [1, 3], 
          color: 'rgba(38, 255, 0, 0.25)', 
          label: 'A̅1A̅0B0',
          borderStyle: {
            '0_1': 'top left bottom',
            '0_3': 'top bottom right',
          }
        },
        { 
          rows: [0, 2], 
          cols: [3], 
          color: 'rgba(255, 0, 0, 0.25)', 
          label: 'A̅0B1B0',
          borderStyle: {
            '0_3': 'bottom left right',
            '2_3': 'left top right',
          }
        },
      ];
    }
  }
  
  if (output === 'C1') {
    if (isAddition) {
      return [
        { 
          rows: [2,3], 
          cols: [0], 
          color: 'rgba(0, 98, 255, 0.25)', 
          label: 'A1B̅1B̅0',
          borderStyle: {
            '2_0': 'bottom left right',
            '3_0': 'top right left',
          }
        },
        { 
          rows: [2], 
          cols: [0, 1], 
          color: 'rgba(38, 255, 0, 0.25)', 
          label: 'A1A̅0B̅1',
          borderStyle: {
            '2_0': 'top left bottom',
            '2_1': 'top bottom right',
          }
        },
        { 
          rows: [0], 
          cols: [2,3], 
          color: 'rgba(255, 0, 0, 0.25)', 
          label: 'A̅1A̅0B1',
          borderStyle: {
            '0_3': 'top left bottom',
            '0_2': 'top right bottom',
          }
        },
        { 
          rows: [0,1], 
          cols: [2], 
          color: 'rgba(234, 0, 255, 0.25)', 
          label: 'A̅0B1B̅0',
          borderStyle: {
            '0_2': 'top left right',
            '1_2': 'left bottom right',
          }
        },
        { 
          rows: [3], 
          cols: [3], 
          color: 'rgba(234, 255, 0, 0.25)', 
          label: 'A̅1A0B̅1B0'
        },
        { 
          rows: [1], 
          cols: [1], 
          color: 'rgba(0, 247, 255, 0.25)', 
          label: 'A1A0B1B0'
        },
      ];
    } else {
      return [
        { 
          rows: [2,3], 
          cols: [0], 
          color: 'rgba(0, 98, 255, 0.25)', 
          label: 'A1·B̅1·B̅0',
          borderStyle: {
            '2_0': 'bottom left right',
            '3_0': 'top right left',
          }
        },
        { 
          rows: [3], 
          cols: [0, 1], 
          color: 'rgba(38, 255, 0, 0.25)', 
          label: 'A1·A0·B̅1',
          borderStyle: {
            '3_0': 'top left bottom',
            '3_1': 'top bottom right',
          }
        },
        { 
          rows: [1], 
          cols: [2, 3], 
          color: 'rgba(255, 0, 0, 0.25)', 
          label: 'A̅1·A0·B1',
          borderStyle: {
            '1_3': 'top left bottom',
            '1_2': 'top right bottom',
          }
        },
        { 
          rows: [0,1], 
          cols: [2], 
          color: 'rgba(234, 0, 255, 0.25)', 
          label: 'A̅1·B1·B̅0',
          borderStyle: {
            '0_2': 'top left right',
            '1_2': 'left bottom right',
          }
        },
        { 
          rows: [0], 
          cols: [1], 
          color: 'rgba(234, 255, 0, 0.25)', 
          label: 'A̅1·A̅0·B̅1·B0'
        },
        { 
          rows: [2], 
          cols: [3], 
          color: 'rgba(0, 247, 255, 0.25)', 
          label: 'A1·A̅0·B1·B0'
        },
      ];
    }
  }
  
  return [];
};

const KMapView: React.FC<KMapViewProps> = ({ output, kmap, isExpanded, onToggle }) => {
  // Split the 8x4 map into two 4x4 maps (D=0 and D=1)
  const kmapD0 = kmap.slice(0, 4); // Rows 0-3 (D=0)
  const kmapD1 = kmap.slice(4, 8); // Rows 4-7 (D=1)

  // Responsive breakpoint tracking (md and up)
  const [isMdUp, setIsMdUp] = React.useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(min-width: 768px)').matches;
  });
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMdUp(e.matches);
    // Init & subscribe (including Safari legacy)
    setIsMdUp(mq.matches);
    mq.addEventListener?.('change', handler);
    // @ts-ignore
    mq.addListener?.(handler);
    return () => {
      mq.removeEventListener?.('change', handler);
      // @ts-ignore
      mq.removeListener?.(handler);
    };
  }, []);

  // (Explanation block removed in UI; keeping logic lean for performance)

  const renderKMap = (data: number[][], title: string, rowLabels: string[], isLarge: boolean = false, isAddition: boolean = true) => {
    const cellSize = isLarge ? 'w-12 h-12 sm:w-12 sm:h-12 md:w-14 md:h-14' : 'w-10 h-10 sm:w-10 sm:h-10';
    const labelWidth = isLarge ? 'w-14 sm:w-14 md:w-16' : 'w-12 sm:w-12';
    const fontSize = isLarge ? 'text-sm sm:text-sm md:text-base' : 'text-xs sm:text-xs';
    const valueFontSize = isLarge ? 'text-lg sm:text-lg md:text-xl' : 'text-base sm:text-base';
    const titleSize = isLarge ? 'text-lg sm:text-lg md:text-xl' : 'text-base sm:text-base';
    // Derive pixel size to keep SVG overlay aligned with Tailwind width classes.
    // w-10 ≈ 40px, w-12 ≈ 48px, md:w-14 ≈ 56px
    const cellPixelSize = isLarge ? (isMdUp ? 56 : 48) : 40;
    
  const groups = isExpanded ? getKMapGroups(output, isAddition) : [];
  // Track how many times a specific edge (cell+side) has been drawn so we can offset
  // overlapping borders and show multiple colors in parallel.
  const edgeUsage = new Map<string, number>();
    
    // Helper to draw borders for a specific cell in a group
    const renderGroupBorders = (group: KMapGroup, cellPixelSize: number, edgeUsage: Map<string, number>) => {
      const elements: React.ReactElement[] = [];
      const strokeColor = group.color.replace('0.25', '1').replace('rgba', 'rgb').replace(/, 1\)/, ')');
      // Scale borders for readability on small screens
      const strokeWidth = Math.max(2, Math.round(cellPixelSize * 0.06));
      const padding = Math.max(1, Math.round(cellPixelSize * 0.05));
      const spacing = Math.max(0, Math.round(cellPixelSize * 0.03)); // space between overlapping parallel lines
      
      group.rows.forEach(row => {
        group.cols.forEach(col => {
          // Convert logical indices to visual positions
          const visualRow = [0, 1, 3, 2].indexOf(row);
          const visualCol = COL_ORDER.indexOf(col);
          
          const x = visualCol * cellPixelSize;
          const y = visualRow * cellPixelSize;
          
          // Determine which borders to draw
          const cellKey = `${row}_${col}`;
          const borders = group.borderStyle?.[cellKey] || 'top right bottom left';
          const borderSet = new Set(borders.split(' '));
          
          // Helper to get the next offset index for a specific edge
          const nextOffsetIndex = (edgeKey: string) => {
            const current = edgeUsage.get(edgeKey) ?? 0;
            edgeUsage.set(edgeKey, current + 1);
            return current;
          };

          // Draw each border as a separate line (apply inward offset if overlapping)
          if (borderSet.has('top')) {
            const edgeKey = `${cellKey}_top`;
            const idx = nextOffsetIndex(edgeKey);
            const offset = idx * (strokeWidth + spacing);
            elements.push(
              <line
                key={`${cellKey}_top`}
                x1={x + padding}
                y1={y + padding + offset}
                x2={x + cellPixelSize - padding}
                y2={y + padding + offset}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="butt"
                shapeRendering="crispEdges"
              />
            );
          }
          
          if (borderSet.has('right')) {
            const edgeKey = `${cellKey}_right`;
            const idx = nextOffsetIndex(edgeKey);
            const offset = idx * (strokeWidth + spacing);
            elements.push(
              <line
                key={`${cellKey}_right`}
                x1={x + cellPixelSize - padding - offset}
                y1={y + padding}
                x2={x + cellPixelSize - padding - offset}
                y2={y + cellPixelSize - padding}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="butt"
                shapeRendering="crispEdges"
              />
            );
          }
          
          if (borderSet.has('bottom')) {
            const edgeKey = `${cellKey}_bottom`;
            const idx = nextOffsetIndex(edgeKey);
            const offset = idx * (strokeWidth + spacing);
            elements.push(
              <line
                key={`${cellKey}_bottom`}
                x1={x + padding}
                y1={y + cellPixelSize - padding - offset}
                x2={x + cellPixelSize - padding}
                y2={y + cellPixelSize - padding - offset}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="butt"
                shapeRendering="crispEdges"
              />
            );
          }
          
          if (borderSet.has('left')) {
            const edgeKey = `${cellKey}_left`;
            const idx = nextOffsetIndex(edgeKey);
            const offset = idx * (strokeWidth + spacing);
            elements.push(
              <line
                key={`${cellKey}_left`}
                x1={x + padding + offset}
                y1={y + padding}
                x2={x + padding + offset}
                y2={y + cellPixelSize - padding}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="butt"
                shapeRendering="crispEdges"
              />
            );
          }
        });
      });
      
      return elements;
    };
    
    return (
      <div 
        style={{ transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
        className="flex flex-col items-center"
      >
        <h4 
          style={{ transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
          className={`${titleSize} font-bold text-gray-700 mb-2 sm:mb-3`}
        >
          {title}
        </h4>
        <div 
          style={{ transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
          className="inline-block overflow-x-auto max-w-full overscroll-x-contain scroll-smooth"
        >
          <div className="flex items-start">
            {/* Row labels */}
            <div className="flex flex-col">
              <div 
                style={{ transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
                className={`${cellSize} ${labelWidth} flex items-center justify-center ${fontSize} font-semibold text-gray-600 border bg-gray-100 relative overflow-hidden`}
              >
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 40" preserveAspectRatio="none">
                  <line x1="0" y1="0" x2="48" y2="40" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                  <text x="18" y="18" fontSize="11" fill="currentColor" className="text-gray-700 font-semibold" transform="rotate(40 28 12)">B1 B0</text>
                  <text y="26" fontSize="11" fill="currentColor" className="text-gray-700 font-semibold" transform="rotate(40 12 32)">A1 A0</text>
                </svg>
              </div>
              {rowLabels.map((label, idx) => (
                <div
                  key={idx}
                  style={{ transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  className={`${cellSize} flex items-center justify-center ${labelWidth} ${fontSize} font-mono font-semibold text-gray-700 bg-indigo-100 border`}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* K-map grid */}
            <div className="relative">
              {/* Column labels */}
              <div className="flex">
                {COL_LABELS.map(label => (
                  <div
                    key={label}
                    style={{ transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    className={`${cellSize} flex items-center justify-center ${fontSize} font-semibold text-gray-600 bg-purple-100 border font-mono`}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="relative">
                {[0, 1, 3, 2].map(rowIdx => (
                  <div key={rowIdx} className="flex">
                    {COL_ORDER.map(colIdx => (
                      <div
                        key={colIdx}
                        style={{ 
                          transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        className={`${cellSize} flex items-center justify-center border font-mono ${valueFontSize} font-semibold
                          ${data[rowIdx][colIdx] === 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-400'}`}
                      >
                        {data[rowIdx][colIdx]}
                      </div>
                    ))}
                  </div>
                ))}
                
                {/* SVG overlay for group borders */}
                {groups.length > 0 && (
                  <svg 
                    className="absolute top-0 left-0 pointer-events-none"
                    style={{ width: cellPixelSize * 4, height: cellPixelSize * 4 }}
                  >
                    {groups.map((group, idx) => (
                      <g key={idx}>
                        {renderGroupBorders(group, cellPixelSize, edgeUsage)}
                      </g>
                    ))}
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Group Legend */}
        {groups.length > 0 && isExpanded && (
          <div className="mt-3 sm:mt-4 w-full max-w-md">
            <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Groups:</div>
            <div className="flex flex-wrap gap-2">
              {groups.map((group, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2 text-xs sm:text-sm px-2 py-1 rounded border"
                  style={{ backgroundColor: group.color, borderColor: group.color.replace('0.3', '0.6') }}
                >
                  <div className="font-mono font-semibold text-gray-800">{group.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      style={{
        transformOrigin: isExpanded ? 'top left' : 'center',
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className={`border-2 rounded-lg overflow-hidden transform ${
        isExpanded 
          ? 'border-purple-400 shadow-2xl bg-gradient-to-br from-purple-50 to-indigo-50 scale-100' 
          : 'border-gray-200 shadow-md scale-100'
      }`}
    >
      <button
        onClick={onToggle}
        style={{
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className={`w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 sm:px-4 hover:from-indigo-600 hover:to-purple-600 transform ${
          isExpanded ? 'py-4 sm:py-5 scale-105' : 'py-2.5 sm:py-3 scale-100'
        }`}
      >
        <h3 
          style={{ transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
          className={`font-bold ${isExpanded ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}
        >
          K-Map {output}
        </h3>
        <p className="text-xs mt-1 opacity-80">
          {isExpanded ? '▲ Click to collapse' : '▼ Click to expand'}
        </p>
      </button>
      
      <div 
        style={{ transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
        className={`bg-gray-50 ${isExpanded ? 'p-4 sm:p-6' : 'p-3 sm:p-4'}`}
      >
        {/* Explanation Section - Only in expanded view */}
        <div 
          style={{
            transformOrigin: 'top left',
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className={`overflow-hidden transform ${
            isExpanded 
              ? 'max-h-96 opacity-100 mb-4 sm:mb-6 scale-100 translate-x-0' 
              : 'max-h-0 opacity-0 mb-0 scale-95 -translate-x-2'
          }`}
        >
        </div>

        {/* Boolean Equations Section - Only in expanded view */}
        <div 
          style={{
            transformOrigin: 'top left',
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.1s',
          }}
          className={`overflow-hidden transform ${
            isExpanded 
              ? 'max-h-[500px] opacity-100 mb-4 sm:mb-6 scale-100 translate-x-0' 
              : 'max-h-0 opacity-0 mb-0 scale-95 -translate-x-2'
          }`}
        >
          <div 
            style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
            className="bg-white rounded-xl shadow-lg border-2 border-purple-200 p-4 sm:p-5"
          >
            <h4 className="text-base sm:text-lg font-bold text-purple-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">📐</span>
              Boolean Equations
            </h4>
            
            {/* Individual Equations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div 
                style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-300"
              >
                <div className="text-xs sm:text-sm font-semibold text-green-700 mb-1 sm:mb-2">D = 0 (Addition)</div>
                <div className="text-sm sm:text-base text-green-900 font-mono break-all">
                  {output} = {getBooleanEquation(output, true)} {output === 'C0' ? '(A̅0·B0 + A0·B̅0)': ""}
                </div>
              </div>
              <div 
                style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                className="p-3 sm:p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-300"
              >
                <div className="text-xs sm:text-sm font-semibold text-orange-700 mb-1 sm:mb-2">D = 1 (Subtraction)</div>
                <div className="text-sm sm:text-base text-orange-900 font-mono break-all">
                  {output} = {getBooleanEquation(output, false)} {output === 'C0' ? '(A̅0·B0 + A0·B̅0)': ""}
                </div>
              </div>
            </div>

            {/* Combined Equation */}
            <div 
              style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
              className="p-3 sm:p-4 bg-gradient-to-br from-purple-100 via-indigo-100 to-purple-100 rounded-lg border-2 border-purple-400"
            >
              <div className="text-xs sm:text-sm font-bold text-purple-800 mb-2">✨ Combined with D</div>
              <div className="text-base sm:text-lg text-purple-900 font-mono font-semibold break-all">
                {getCombinedEquation(output)}
              </div>
              
              {/* Simplification steps for C0 */}
              {output === 'C0' && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-purple-300">
                  <div className="text-xs sm:text-sm font-bold text-emerald-800 mb-2 flex items-center gap-2">
                    <span>🎯</span>
                    Simplification Steps
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base font-mono">
                    <div className="text-purple-900">
                      C0 = D̅·(A0 ⊕ B0) + D·(A0 ⊕ B0)
                    </div>
                    <div className="text-purple-800 pl-4">
                      C0 = (A0 ⊕ B0)·(D̅ + D)
                    </div>
                    <div className="text-emerald-800 pl-8">
                      C0 = (A0 ⊕ B0)·(1)
                    </div>
                    <div className="text-emerald-900 font-bold pl-12 text-base sm:text-lg">
                      C0 = A0 ⊕ B0
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* K-Maps with smooth size transition */}
        <div 
          style={{ transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.15s' }}
          className={`grid gap-4 sm:gap-6 ${
            isExpanded ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          <div 
            style={{ 
              transformOrigin: 'top left',
              transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.15s',
            }}
            className={`transform ${
              isExpanded ? 'scale-100 translate-x-0' : 'scale-100 translate-x-0'
            }`}
          >
            {renderKMap(kmapD0, isExpanded ? 'D = 0 (Addition)' : 'D = 0', ROW_LABELS_D0, isExpanded, true)}
          </div>
          <div 
            style={{ 
              transformOrigin: 'top left',
              transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.15s',
            }}
            className={`transform ${
              isExpanded ? 'scale-100 translate-x-0' : 'scale-100 translate-x-0'
            }`}
          >
            {renderKMap(kmapD1, isExpanded ? 'D = 1 (Subtraction)' : 'D = 1', ROW_LABELS_D1, isExpanded, false)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KMapView;
