import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ScoreIndicatorProps = {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showDescription?: boolean;
};

export const ScoreIndicator = ({ 
  score, 
  size = 'md', 
  className,
  showDescription = true
}: ScoreIndicatorProps) => {
  const normalizedScore = Math.max(1, Math.min(10, score));
  
  // Determine color based on score
  const getScoreColor = () => {
    if (normalizedScore >= 8) return 'bg-emerald-500';
    if (normalizedScore >= 5) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Get interpretation description
  const getScoreDescription = () => {
    if (normalizedScore >= 8) return 'High automation risk - Your current career path faces significant disruption from automation technologies';
    if (normalizedScore >= 6) return 'Moderate automation risk - Your field is experiencing notable automation but some aspects remain difficult to automate';
    if (normalizedScore >= 4) return 'Low-moderate automation risk - Some routine tasks may be automated but core responsibilities likely remain secure';
    return 'Low automation risk - Your current career has minimal exposure to automation technologies';
  };
  
  // Size mappings
  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-3xl',
    lg: 'w-32 h-32 text-4xl'
  };
  
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative">
        <div 
          className={cn(
            'rounded-full flex items-center justify-center font-bold text-white',
            sizeClasses[size]
          )}
        >
          <div className="absolute inset-0 rounded-full bg-gray-100"></div>
          
          {/* Progress circle */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <motion.circle
              initial={{ pathLength: 0 }}
              animate={{ pathLength: normalizedScore / 10 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="50"
              cy="50"
              r="46"
              fill="none"
              strokeWidth="8"
              stroke={getScoreColor().replace('bg-', 'text-')}
              strokeLinecap="round"
              className={cn(getScoreColor().replace('bg-', 'stroke-'))}
              transform="rotate(-90 50 50)"
            />
          </svg>
          
          {/* Score number */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 flex items-center justify-center h-full w-full">
            <span className="font-display text-black">{normalizedScore}</span>
          </motion.div>
        </div>
      </div>
      
      {showDescription && (
        <div className="mt-2 flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-sm text-muted-foreground cursor-help">
                  Automation risk <InfoIcon className="ml-1 h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="text-xs mb-2 text-muted-foreground">Scale: 1 (lowest risk) to 10 (highest risk)</p>
                <p className="font-medium">{getScoreDescription()}</p>
                <div className="mt-2 text-xs">
                  <p><span className="font-semibold text-red-500">8-10:</span> High automation risk</p>
                  <p><span className="font-semibold text-amber-500">5-7:</span> Moderate automation risk</p>
                  <p><span className="font-semibold text-emerald-500">1-4:</span> Low automation risk</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default ScoreIndicator;
