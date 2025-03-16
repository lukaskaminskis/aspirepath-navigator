
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ScoreIndicatorProps = {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const ScoreIndicator = ({ score, size = 'md', className }: ScoreIndicatorProps) => {
  const normalizedScore = Math.max(1, Math.min(10, score));
  
  // Determine color based on score
  const getScoreColor = () => {
    if (normalizedScore >= 8) return 'bg-emerald-500';
    if (normalizedScore >= 5) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Size mappings
  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-3xl',
    lg: 'w-32 h-32 text-4xl'
  };
  
  return (
    <div className={cn('relative', className)}>
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
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 font-display"
        >
          {normalizedScore}
        </motion.span>
      </div>
    </div>
  );
};

export default ScoreIndicator;
