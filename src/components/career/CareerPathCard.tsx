import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

type CareerPathCardProps = {
  title: string;
  description: string;
  url?: string;
  growthRate: string;
  demandLevel: 'High' | 'Medium' | 'Low';
  skillsRequired: string[];
  index?: number;
  className?: string;
};

export const CareerPathCard = ({
  title,
  description,
  url,
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

  // Fallback URL function if no URL is provided
  const getTuringCourseUrl = () => {
    const pathTitle = title.toLowerCase();
    
    if (pathTitle.includes('data science')) return 'https://www.turingcollege.com/data-science?utm_source=aspirepath&utm_medium=app&utm_campaign=aspirepath-app';
    if (pathTitle.includes('data analytics') || pathTitle.includes('data analyst')) return 'https://www.turingcollege.com/data-analytics?utm_source=aspirepath&utm_medium=app&utm_campaign=aspirepath-app';
    if (pathTitle.includes('ai engineer')) return 'https://www.turingcollege.com/ai-engineering?utm_source=aspirepath&utm_medium=app&utm_campaign=aspirepath-app';
    if (pathTitle.includes('digital marketing')) return 'https://www.turingcollege.com/digital-marketing?utm_source=aspirepath&utm_medium=app&utm_campaign=aspirepath-app';
    if (pathTitle.includes('business analytics') || pathTitle.includes('business intelligence')) return 'https://www.turingcollege.com/ai-for-analytics?utm_source=aspirepath&utm_medium=app&utm_campaign=aspirepath-app';
    if (pathTitle.includes('ethics')) return 'https://www.turingcollege.com/ai-ethics?utm_source=aspirepath&utm_medium=app&utm_campaign=aspirepath-app';
    
    // Default to the homepage if no match
    return 'https://www.turingcollege.com/?utm_source=aspirepath&utm_medium=app&utm_campaign=aspirepath-app';
  };

  // Use provided URL or fallback to generated URL
  const courseUrl = url && url.length > 0 ? url : getTuringCourseUrl();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        'flex flex-col bg-white border rounded-lg p-5 shadow-sm',
        className
      )}
    >
      {/* Card content */}
      <div className="flex flex-col h-full">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        
        {/* Description */}
        <p className="mt-2 text-sm text-gray-600 flex-grow">{description}</p>
        
        {/* Growth and Demand */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            {growthRate} Growth
          </span>
          
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDemandColor()}`}>
            {demandLevel} Demand
          </span>
        </div>
        
        {/* Skills Required */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-1">Required Skills:</p>
          <div className="flex flex-wrap gap-1">
            {skillsRequired.map((skill, i) => (
              <span 
                key={i} 
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="mt-auto pt-4">
          <Button 
            variant="outline" 
            className="w-full mt-2 group" 
            onClick={() => window.open(courseUrl, '_blank')}
          >
            Learn at Turing College
            <ArrowUpRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CareerPathCard;
