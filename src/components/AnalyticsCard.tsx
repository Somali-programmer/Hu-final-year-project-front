import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, subtitle, children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("hu-card-alt p-4 md:p-6 space-y-4", className)}
    >
      <div className="space-y-0.5">
        <h3 className="text-base md:text-lg font-serif font-bold text-brand-text transition-colors">{title}</h3>
        {subtitle && <p className="text-[10px] font-bold text-brand-muted/40 uppercase tracking-widest transition-colors">{subtitle}</p>}
      </div>
      <div className="w-full h-[400px] md:h-[500px]">
        {children}
      </div>
    </motion.div>
  );
};

export default AnalyticsCard;
