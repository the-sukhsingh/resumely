'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface ResizablePanelsProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export const ResizablePanels: React.FC<ResizablePanelsProps> = ({ leftPanel, rightPanel }) => {
  const [leftWidth, setLeftWidth] = useState(40); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Constrain between 30% and 70%
      if (newLeftWidth >= 30 && newLeftWidth <= 70) {
        setLeftWidth(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  return (
    <div ref={containerRef} className="flex-1 flex overflow-hidden relative border border-t-0 dark:border-neutral-800 rounded-b-lg">
      {/* Left Panel */}
      <div style={{ width: `${leftWidth}%` }} className="overflow-hidden nobar rounded-bl-lg ">
        {leftPanel}
      </div>

      {/* Resizer */}
      <div
        onMouseDown={handleMouseDown}
        className={`
          w-[0.5px] cursor-col-resize relative group
          transition-colors duration-200
          bg-border
        
        `}
      >
        <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-muted rounded-sm py-1 px-px shadow-md">
            <GripVertical className="w-4 h-4 text-primary/90 cursor-grab active:cursor-grabbing" />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: `${100 - leftWidth}%` }} className="overflow-hidden rounded-br-lg">
        {rightPanel}
      </div>
    </div>
  );
};
