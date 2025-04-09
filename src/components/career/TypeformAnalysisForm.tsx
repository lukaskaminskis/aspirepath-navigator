import React, { useEffect, useState } from 'react';
import { PopupButton } from '@typeform/embed-react';
import { useNavigate } from 'react-router-dom';

interface TypeformAnalysisFormProps {
  onSubmissionComplete?: (responseId: string) => void;
}

const TypeformAnalysisForm: React.FC<TypeformAnalysisFormProps> = ({ 
  onSubmissionComplete 
}) => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Replace with your actual Typeform ID
  const TYPEFORM_ID = 'wV1mSwlr';
  
  // This function will be called when Typeform submission is complete
  const handleSubmit = ({ responseId }: { responseId: string }) => {
    console.log('Form submitted with response ID:', responseId);
    
    try {
      setIsSubmitted(true);
      
      // Call the callback function if provided
      if (onSubmissionComplete) {
        console.log('Calling onSubmissionComplete with responseId:', responseId);
        onSubmissionComplete(responseId);
      } else {
        console.warn('No onSubmissionComplete callback provided');
      }
    } catch (error) {
      console.error('Error in TypeformAnalysisForm handleSubmit:', error);
      
      // Show error state (optional)
      setIsSubmitted(false);
      alert('There was an error processing your submission. Please try again.');
    }
  };
  
  return (
    <div className="max-w-xl mx-auto bg-card p-8 rounded-lg shadow-sm border text-center">
      <h2 className="text-2xl font-bold mb-6">Before We Begin</h2>
      <p className="text-muted-foreground mb-8">
        To provide you with a personalized career analysis, we need a few details about you.
      </p>
      
      {!isSubmitted ? (
        <PopupButton
          id={TYPEFORM_ID}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          autoClose={true}
          onSubmit={handleSubmit}
          size={80}
          hidden={{
            email: "{{email}}"
          }}
        >
          Start Your Career Analysis
        </PopupButton>
      ) : (
        <div className="p-4 bg-green-100 rounded-md text-green-800">
          Thank you for your submission! Preparing your analysis...
        </div>
      )}
    </div>
  );
};

export default TypeformAnalysisForm; 