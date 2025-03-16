
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type InsightCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  index?: number;
  className?: string;
};

export const InsightCard = ({ 
  icon, 
  title, 
  description, 
  index = 0,
  className 
}: InsightCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: 0.1 * index,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={cn(
        "p-6 rounded-lg glass-card hover:shadow-card transition-all",
        className
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4 p-3 bg-primary bg-opacity-10 rounded-full">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-lg mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default InsightCard;
