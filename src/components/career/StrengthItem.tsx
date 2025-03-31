import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type StrengthItemProps = {
  strength: string;
  description: string;
  descriptionDetails?: string[];
  index?: number;
  className?: string;
};

export const StrengthItem = ({ 
  strength, 
  description, 
  descriptionDetails = [],
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
        <h4 className="font-medium text-black">{strength}</h4>
        <div className="space-y-1 mt-1">
          <p className="text-muted-foreground text-sm">{description}</p>
          {descriptionDetails.length > 0 ? (
            descriptionDetails.map((detail, i) => (
              <p key={i} className="text-muted-foreground text-sm">{detail}</p>
            ))
          ) : (
            <>
              <p className="text-muted-foreground text-sm">You consistently demonstrate this strength through effective communication and relationship building.</p>
              <p className="text-muted-foreground text-sm">This skill will remain valuable as AI transforms the workplace and creates new opportunities.</p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StrengthItem;
