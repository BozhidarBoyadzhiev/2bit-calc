import type { OutputType } from '../types';

// Helper to get the equation for each output based on the K-map patterns
export const getBooleanEquation = (output: OutputType, isAddition: boolean): string => {
  if (isAddition) {
    // D = 0 (Addition)
    switch (output) {
      case 'C2':
        return "A1·B1 + A1·A0·B0 + A0·B1·B0";
      case 'C1':
        return "A1·B̅1·B̅0 + A1·A̅0·B̅1 + A̅1·A̅0·B1 + A̅0·B1·B̅0 + A̅1·A0·B̅1·B0 + A1·A0·B1·B0"; 

      case 'C0':
        return "A0 ⊕ B0";
      default:
        return "";
    }
  } else {
    // D = 1 (Subtraction)
    switch (output) {
      case 'C2':
        return "A̅1·B1 + A̅0·B1·B0 + A̅1·A̅0·B0";
      case 'C1':
        return "A1·B̅1·B̅0 + A1·A0·B̅1 + A̅1·A0·B1 + A̅1·B1·B̅0 + A̅1·A̅0·B̅1·B0 + A1·A̅0·B1·B0";
      case 'C0':
        return "A0 ⊕ B0";
      default:
        return "";
    }
  }
};

// Get combined equation with D as a variable
export const getCombinedEquation = (output: OutputType): string => {
  const addEq = getBooleanEquation(output, true);
  const subEq = getBooleanEquation(output, false);
  
  return `${output} = D̅·(${addEq}) + D·(${subEq})`;
};

// Get simplified equation combining both D=0 and D=1
export const getFullEquation = (output: OutputType): string => {
  const addEq = getBooleanEquation(output, true);
  const subEq = getBooleanEquation(output, false);
  
  return `When D=0: ${addEq}\nWhen D=1: ${subEq}`;
};
