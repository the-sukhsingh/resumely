"use client"
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import {  motion, AnimatePresence } from 'motion/react';


export interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  sectionKey?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, isOpen, onToggle, children, sectionKey = 'default' }) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggle();
  };


  return (
    <div className="overflow-hidden">
      <div
        onClick={handleToggle}
        className={cn(`w-full cursor-pointer flex items-center justify-between px-3 py-2 transition-colors border-b`,
            isOpen ? "bg-muted text-cyan-700 dark:text-cyan-500": "hover:bg-muted"
        )}
      >
        <h2 className="font-sans font-medium text-sm select-none flex-1 pointer-events-none">{title}</h2>
        <button
          onClick={handleToggle}
          className="p-1 hover:bg-muted rounded transition-colors relative z-10 pointer-events-auto"
          type="button"
        >
          <motion.div
            animate={{ rotateX: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-primary/90" />
          </motion.div>
        </button>
      </div>
      <AnimatePresence initial={false} mode="wait">
        {isOpen && (
          <motion.div
          className='border-b'
            key={`content-${sectionKey}`}
            initial={{ height: 0, opacity: 0, filter: "blur(2px)" }}
            animate={{ 
              height: "auto", 
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                height: { duration: 0.15, ease: "linear" },
                opacity: { duration: 0.1, ease: "linear", delay: 0.05 },
                filter: { duration: 0.1, ease: "linear", delay: 0.05}
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              filter: "blur(2px)",
              transition: {
                height: { duration: 0.15, ease: "linear" },
                opacity: { duration: 0.1, ease: "linear" },
                filter: {duration: 0.1, ease: "linear"}
              }
            }}
          >
            <div className="px-4 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleSection