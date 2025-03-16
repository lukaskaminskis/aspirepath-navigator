
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type FaqCardProps = {
  question: string;
  answer: string;
  index?: number;
  className?: string;
};

export const FaqCard = ({
  question,
  answer,
  index = 0,
  className
}: FaqCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.1 * index,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={cn(
        "rounded-lg border border-border overflow-hidden bg-white",
        className
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-5 text-left"
      >
        <h3 className="font-medium">{question}</h3>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform",
            isOpen ? "transform rotate-180" : ""
          )}
        />
      </button>
      
      <div
        className={cn(
          "overflow-hidden transition-all",
          isOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="p-5 pt-0 text-muted-foreground">
          {answer}
        </div>
      </div>
    </motion.div>
  );
};

export default FaqCard;
