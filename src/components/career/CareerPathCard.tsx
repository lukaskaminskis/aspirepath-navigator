
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CareerPathCardProps = {
  title: string;
  description: string;
  growthRate: string;
  demandLevel: 'High' | 'Medium' | 'Low';
  skillsRequired: string[];
  index?: number;
  className?: string;
};

export const CareerPathCard = ({
  title,
  description,
  growthRate,
  demandLevel,
  skillsRequired,
  index = 0,
  className
}: CareerPathCardProps) => {
  // Determine demand level color
  const getDemandColor = () => {
    if (demandLevel === 'High') return 'bg-emerald-100 text-emerald-700';
    if (demandLevel === 'Medium') return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.15 * index,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={cn(
        "p-6 rounded-lg border border-border bg-white shadow-subtle hover:shadow-card transition-all",
        className
      )}
    >
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-2 text-muted-foreground text-sm">{description}</p>
      
      <div className="flex items-center space-x-3 mt-4">
        <div className="text-xs bg-secondary px-2 py-1 rounded-full">
          Growth: {growthRate}
        </div>
        <div className={cn("text-xs px-2 py-1 rounded-full", getDemandColor())}>
          {demandLevel} Demand
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-xs text-muted-foreground font-medium uppercase">Required Skills</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {skillsRequired.map((skill, i) => (
            <span 
              key={i} 
              className="text-xs px-2 py-1 bg-secondary rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <Button className="mt-4 w-full">
        Explore Path <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default CareerPathCard;
