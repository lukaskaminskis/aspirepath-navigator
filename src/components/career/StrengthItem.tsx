
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type StrengthItemProps = {
  strength: string;
  description: string;
  index?: number;
  className?: string;
};

export const StrengthItem = ({ 
  strength, 
  description, 
  index = 0, 
  className 
}: StrengthItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.4,
        delay: 0.1 * index,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={cn(
        "flex items-start p-4 rounded-md border border-border bg-white",
        className
      )}
    >
      <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
      <div>
        <h4 className="font-medium">{strength}</h4>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>
    </motion.div>
  );
};

export default StrengthItem;
