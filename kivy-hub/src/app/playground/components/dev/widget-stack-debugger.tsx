import React, { useState, useEffect } from 'react';
import { getWidgetStack } from '../../utils/widget-stack-manager';

/**
 * Widget Stack Debugger - A development tool to visualize the current widget stack
 * Shows a small panel with the current z-index hierarchy
 */
export default function WidgetStackDebugger() {
  const [stackItems, setStackItems] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  
  // Update stack information every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      if (isVisible) {
        setStackItems(getWidgetStack());
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [isVisible]);
  
  if (!isVisible) {
    return (
      <button 
        className="fixed bottom-2 left-2 bg-gray-800 text-white px-3 py-1 rounded text-xs opacity-50 hover:opacity-100 z-[9999]"
        onClick={() => setIsVisible(true)}
      >
        Show Widget Stack
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-2 left-2 bg-gray-800 text-white p-3 rounded shadow-lg text-xs z-[9999] max-w-[300px] opacity-80 hover:opacity-100">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Widget Stack</h3>
        <button 
          className="text-gray-400 hover:text-white"
          onClick={() => setIsVisible(false)}
        >
          ✕
        </button>
      </div>
      
      {stackItems.length === 0 ? (
        <div className="text-gray-400">No widgets in stack</div>
      ) : (
        <ul className="space-y-1">
          {[...stackItems].reverse().map((item, idx) => (
            <li key={item.id} className="flex justify-between">
              <span className="truncate" title={item.id}>
                {idx === 0 ? '👆 ' : ''}{item.id.split('-')[0]}
              </span>
              <span className="text-yellow-400 ml-2">z-index: {item.zIndex}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 