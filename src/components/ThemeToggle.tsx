import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { cn } from '../lib/utils';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden group shadow-lg",
        "bg-brand-primary/10 border border-brand-primary/20 text-brand-primary"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'light' ? (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.3, ease: "backOut" }}
          >
            <Moon className="w-5 h-5 fill-current" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.3, ease: "backOut" }}
          >
            <Sun className="w-5 h-5 fill-current" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background glow effect */}
      <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 bg-brand-primary" />
    </button>
  );
};

export default ThemeToggle;
