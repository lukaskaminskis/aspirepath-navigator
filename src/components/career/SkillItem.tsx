
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type SkillItemProps = {
  skill: string;
  description: string;
  index?: number;
  className?: string;
};

export const SkillItem = ({ 
  skill, 
  description, 
  index = 0, 
  className 
}: SkillItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
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
      <TrendingUp className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
      <div>
        <h4 className="font-medium">{skill}</h4>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>
    </motion.div>
  );
};

export default SkillItem;
