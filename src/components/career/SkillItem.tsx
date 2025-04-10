import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type SkillItemProps = {
  skill: string;
  description: string;
  detailDescription?: string;
  index?: number;
  className?: string;
};

export const SkillItem = ({ 
  skill, 
  description, 
  detailDescription,
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
        <h4 className="font-medium text-black">{skill}</h4>
        <div className="space-y-1 mt-1">
          <p className="text-muted-foreground text-sm">{description}</p>
          {detailDescription && (
            <p className="text-muted-foreground text-sm">{detailDescription}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SkillItem;
