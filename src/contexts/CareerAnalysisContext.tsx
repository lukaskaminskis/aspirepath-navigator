import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CareerAnalysisData } from '@/types/career';
import { careerAnalysisService, reviewsService } from '@/services/api';

// Define the shape of the context
interface CareerAnalysisContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  careerData: CareerAnalysisData | null;
  setCareerData: React.Dispatch<React.SetStateAction<CareerAnalysisData | null>>;
  analyzeCareer: (formData: FormData) => Promise<void>;
  analyzeTypeformResponse: (responseId: string) => Promise<void>;
  getRelevantReview: (analysisData: CareerAnalysisData) => Promise<void>;
  isReviewLoading: boolean;
  setIsReviewLoading: React.Dispatch<React.SetStateAction<boolean>>;
  review: string | undefined;
  setReview: React.Dispatch<React.SetStateAction<string | undefined>>;
}

// Create context with a default undefined value
const CareerAnalysisContext = createContext<CareerAnalysisContextType | undefined>(undefined);

export const CareerAnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [careerData, setCareerData] = useState<CareerAnalysisData | null>(null);
  const [isReviewLoading, setIsReviewLoading] = useState<boolean>(false);
  const [review, setReview] = useState<string | undefined>(undefined);

  const analyzeCareer = async (formData: FormData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await careerAnalysisService.analyzeCareer(formData);
      setCareerData(response);
    } catch (error: any) {
      console.error('Error analyzing career:', error);
      setError(error.message || 'Failed to analyze career data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const analyzeTypeformResponse = async (responseId: string) => {
    if (!responseId) {
      console.error('Invalid responseId provided:', responseId);
      setError('Missing or invalid response ID');
      return;
    }
    
    try {
      // Set loading state to prevent parallel requests
      if (isLoading) {
        console.log('Analysis already in progress, not starting a new request');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      console.log('Starting Typeform response analysis:', responseId);
      
      // Clear any previous data
      setCareerData(null);
      
      // Single API request with clear completion tracking
      const response = await careerAnalysisService.analyzeTypeformResponse(responseId);
      console.log('Analysis complete. Processing results...');
      
      // Process the response only after the API call is fully complete
      if (response && response.analysis) {
        console.log('Analysis data received successfully');
        setCareerData(response.analysis);
        
        // Only attempt to get a review after career analysis is complete
        // And do it within this try block so career analysis can succeed even if review fails
        try {
          console.log('Fetching relevant review based on analysis...');
          await getRelevantReview(response.analysis);
          console.log('Review fetching complete');
        } catch (reviewError) {
          console.error('Error fetching review, but continuing with analysis display:', reviewError);
          // Don't rethrow - we want career analysis to succeed even if review fails
        }
      } else if (response && response.success === false) {
        console.error('API returned success: false', response);
        throw new Error(response.error || 'Failed to analyze your response');
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response data structure. This may be a temporary issue. Please try again later.');
      }
      
      console.log('Analysis workflow complete');
    } catch (error: any) {
      console.error('Error analyzing Typeform response:', error);
      console.error('Error details:', error.response?.data, error.stack);
      
      // Clear any partial data
      setCareerData(null);
      
      // Special handling for timeout errors
      if (error.code === 'ECONNABORTED') {
        const timeoutMessage = 'The request timed out. Please try again in a few moments.';
        console.error(timeoutMessage);
        setError(timeoutMessage);
      } else {
        const errorMessage = error.response?.data?.detail || error.message || 'Failed to analyze Typeform response data';
        setError(errorMessage);
      }
    } finally {
      console.log('Analysis process complete, resetting loading state');
      setIsLoading(false);
    }
  };

  // Fetch relevant review based on analysis data
  const getRelevantReview = async (analysisData: CareerAnalysisData) => {
    try {
      setIsReviewLoading(true);
      const strengths = analysisData.strengths.map(s => s.strength);
      const skillsToImprove = analysisData.skillsToImprove.map(s => s.skill);
      const careerPaths = analysisData.recommendedCareerPaths.map(p => p.title);
      
      // Use the top career path as the course interest
      const program = careerPaths.length > 0 ? careerPaths[0] : '';
      
      const profileData = {
        skills: [...strengths, ...skillsToImprove],
        experience: [],
        education: [],
        interests: [],
        course_interest: program,
        program
      };
      
      const response = await reviewsService.getRelevantReview(profileData);
      setReview(response.review);
      setIsReviewLoading(false);
    } catch (error) {
      console.error('Error fetching relevant review:', error);
      setIsReviewLoading(false);
      // Continue without a review - don't block the analysis display
      // Just set review to undefined
      setReview(undefined);
    }
  };

  return (
    <CareerAnalysisContext.Provider
      value={{
        isLoading,
        setIsLoading,
        error,
        setError,
        careerData,
        setCareerData,
        analyzeCareer,
        analyzeTypeformResponse,
        getRelevantReview,
        isReviewLoading,
        setIsReviewLoading,
        review,
        setReview
      }}
    >
      {children}
    </CareerAnalysisContext.Provider>
  );
};

// Custom hook to use the career analysis context
export const useCareerAnalysis = () => {
  const context = useContext(CareerAnalysisContext);
  if (context === undefined) {
    throw new Error('useCareerAnalysis must be used within a CareerAnalysisProvider');
  }
  return context;
};