import { motion } from 'framer-motion';
import { ExternalLink, Star, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type Program = {
  name: string;
  duration: string;
  cost: string;
};

type SchoolCardProps = {
  name: string;
  logoUrl: string;
  description: string;
  reviewSource: 'Trustpilot' | 'Google Reviews' | 'CourseReport';
  reviewScore: number;
  reviewCount: number;
  programs: Program[];
  index?: number;
  className?: string;
};

export const SchoolCard = ({
  name,
  logoUrl,
  description,
  reviewSource,
  reviewScore,
  reviewCount,
  programs,
  index = 0,
  className
}: SchoolCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.2 * index,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={cn(
        "p-6 rounded-lg border border-border shadow-subtle bg-white",
        className
      )}
    >
      <div className="flex items-center">
        <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center overflow-hidden mr-4">
          {logoUrl ? (
            <img src={logoUrl} alt={name} className="w-10 h-10 object-contain" />
          ) : (
            <div className="font-bold text-lg">{name.charAt(0)}</div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-black">{name}</h3>
          <div className="flex items-center mt-1 text-sm">
            <div className="flex items-center text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="ml-1 font-medium">{reviewScore.toFixed(1)}</span>
            </div>
            <span className="mx-1.5 text-muted-foreground">•</span>
            <span className="text-muted-foreground">{reviewSource}</span>
            <span className="ml-1 text-muted-foreground">({reviewCount})</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      
      <div className="mt-4 space-y-3">
        <p className="text-xs font-medium uppercase text-muted-foreground">Top Programs</p>
        {programs.map((program, i) => (
          <div key={i} className="p-3 rounded bg-secondary">
            <div className="font-medium text-sm">{program.name}</div>
            <div className="flex items-center mt-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{program.duration}</span>
              <span className="mx-1.5">•</span>
              <span>{program.cost}</span>
            </div>
          </div>
        ))}
      </div>
      
      <a 
        href="#" 
        className="mt-4 text-sm text-primary flex items-center hover:underline"
      >
        Visit website <ExternalLink className="ml-1 h-3.5 w-3.5" />
      </a>
    </motion.div>
  );
};

export default SchoolCard;
