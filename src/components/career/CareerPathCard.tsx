import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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

  // Map career path titles to Turing College course URLs
  const getTuringCourseUrl = () => {
    const pathTitle = title.toLowerCase();
    
    if (pathTitle.includes('data science')) return 'https://www.turingcollege.com/data-science';
    if (pathTitle.includes('data analytics') || pathTitle.includes('data analyst')) return 'https://www.turingcollege.com/data-analytics';
    if (pathTitle.includes('ai engineer')) return 'https://www.turingcollege.com/ai-engineering';
    if (pathTitle.includes('digital marketing')) return 'https://www.turingcollege.com/digital-marketing';
    if (pathTitle.includes('business analytics') || pathTitle.includes('business intelligence')) return 'https://www.turingcollege.com/ai-for-business-analytics';
    if (pathTitle.includes('software & ai')) return 'https://www.turingcollege.com/web-development';
    if (pathTitle.includes('software') || pathTitle.includes('web')) return 'https://www.turingcollege.com/web-development';
    
    // Default to the homepage if no match
    return 'https://www.turingcollege.com/';
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
        "p-6 rounded-lg border border-border bg-white shadow-subtle hover:shadow-card transition-all flex flex-col",
        className
      )}
    >
      <h3 className="text-lg font-medium text-black">{title}</h3>
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
      
      <div className="mt-auto pt-6">
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full mt-2 group" 
          onClick={() => window.open(getTuringCourseUrl(), '_blank')}
        >
          Learn at Turing College
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};

export default CareerPathCard;
