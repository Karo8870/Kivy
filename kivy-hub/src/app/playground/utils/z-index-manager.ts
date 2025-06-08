// Global z-index manager for maintaining proper stacking order of widgets
let globalZIndexCounter = 100;

// Get the next highest z-index (brings element to top)
export function getTopZIndex(): number {
  globalZIndexCounter += 1;
  return globalZIndexCounter;
}

// Reset the counter (useful for testing/debugging)
export function resetZIndexCounter(value = 100): void {
  globalZIndexCounter = value;
}

// Get current highest z-index without incrementing
export function getCurrentTopZIndex(): number {
  return globalZIndexCounter;
} 