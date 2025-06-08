// Widget stack manager to handle z-index ordering of all floating widgets
// Base z-index for the stack (all widgets will be BASE_Z_INDEX + position)
const BASE_Z_INDEX = 100;

// Maximum number of widgets in stack
const MAX_STACK_SIZE = 50;

// Widget registry to track widget IDs and their positions in the stack
interface WidgetStackItem {
  id: string;
  zIndex: number;
}

// Central widget stack - ordered from bottom (0) to top (length-1)
let widgetStack: WidgetStackItem[] = [];

// Keep track of widget instance references for z-index updates
interface WidgetRef {
  id: string;
  setZIndex: (value: number) => void;
}
const widgetRefs: WidgetRef[] = [];

/**
 * Register a widget's setZIndex function for real-time updates
 * @param id Unique identifier for the widget
 * @param setZIndex State setter function for z-index
 */
export function registerWidgetRef(id: string, setZIndex: (value: number) => void): void {
  // Remove existing reference if any
  const existingIndex = widgetRefs.findIndex(ref => ref.id === id);
  if (existingIndex !== -1) {
    widgetRefs.splice(existingIndex, 1);
  }
  
  // Add new reference
  widgetRefs.push({ id, setZIndex });
}

/**
 * Unregister a widget's setZIndex function
 * @param id Unique identifier for the widget
 */
export function unregisterWidgetRef(id: string): void {
  const index = widgetRefs.findIndex(ref => ref.id === id);
  if (index !== -1) {
    widgetRefs.splice(index, 1);
  }
}

/**
 * Recalculate and update z-indices for all widgets in the stack
 */
function updateAllZIndices(): void {
  // Update z-index values in the stack
  widgetStack.forEach((item, index) => {
    item.zIndex = BASE_Z_INDEX + index;
  });
  
  // Update all registered widget components
  widgetRefs.forEach(ref => {
    const widget = widgetStack.find(item => item.id === ref.id);
    if (widget) {
      ref.setZIndex(widget.zIndex);
    }
  });
}

/**
 * Move a widget to the top of the stack or add it if not present
 * @param id Unique identifier for the widget
 * @returns The new z-index value for the widget
 */
export function bringWidgetToFront(id: string): number {
  // Remove widget from current position if it exists
  widgetStack = widgetStack.filter(item => item.id !== id);
  
  // Add widget to top of stack
  const newZIndex = BASE_Z_INDEX + widgetStack.length;
  widgetStack.push({ id, zIndex: newZIndex });
  
  // Trim stack if it exceeds maximum size
  if (widgetStack.length > MAX_STACK_SIZE) {
    widgetStack = widgetStack.slice(-MAX_STACK_SIZE);
  }
  
  // Update z-indices for all widgets
  updateAllZIndices();
  
  return newZIndex;
}

/**
 * Get the current z-index of a widget
 * @param id Unique identifier for the widget
 * @returns The z-index value or BASE_Z_INDEX if not found
 */
export function getWidgetZIndex(id: string): number {
  const widget = widgetStack.find(item => item.id === id);
  return widget ? widget.zIndex : BASE_Z_INDEX;
}

/**
 * Remove a widget from the stack (when it's unmounted)
 * @param id Unique identifier for the widget
 */
export function removeWidgetFromStack(id: string): void {
  widgetStack = widgetStack.filter(item => item.id !== id);
  unregisterWidgetRef(id);
  
  // Recalculate z-indices after removal
  updateAllZIndices();
}

/**
 * Get the current stack of widgets
 * @returns Copy of the current widget stack
 */
export function getWidgetStack(): WidgetStackItem[] {
  return [...widgetStack];
}

/**
 * Reset the widget stack (useful for testing)
 */
export function resetWidgetStack(): void {
  widgetStack = [];
  updateAllZIndices();
} 