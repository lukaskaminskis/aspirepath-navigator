import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CareerAnalysisData } from '@/types/career';
import api from '@/services/api';
import { careerAnalysisService } from '@/services/api';

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
  review: any;
  setReview: React.Dispatch<React.SetStateAction<any>>;
}

// Create context with a default undefined value
const CareerAnalysisContext = createContext<CareerAnalysisContextType | undefined>(undefined);

export const CareerAnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [careerData, setCareerData] = useState<CareerAnalysisData | null>(null);
  const [isReviewLoading, setIsReviewLoading] = useState<boolean>(false);
  const [review, setReview] = useState<any>(undefined);

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
  
  const analyzeTypeformResponse = async (responseId: string): Promise<void> => {
    if (!responseId) {
      setError('Missing or invalid response ID');
      return;
    }
    
    // Prevent processing if already loading
    if (isLoading) {
      return;
    }
    
    // Create an abort controller for this request
    const controller = new AbortController();
    let isCancelled = false;
    
    try {
      setIsLoading(true);
      setError(null);
      setCareerData(null);
      
      // Add timeout protection
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 60000); // 60 second timeout
      
      // Make API request with simple error handling
      const response = await careerAnalysisService.analyzeTypeformResponse(responseId);
      
      // Clean up timeout
      clearTimeout(timeoutId);
      
      // Don't process if cancelled
      if (isCancelled) return;
      
      // Process successful response
      if (response && response.analysis) {
        setCareerData(response.analysis);
      } else if (response && response.success === false) {
        throw new Error(response.error || 'Failed to analyze your response');
      } else {
        throw new Error('Invalid response data structure. This may be a temporary issue. Please try again later.');
      }
    } catch (error: any) {
      if (isCancelled) return;
      
      // Clean up any partial data
      setCareerData(null);
      
      // Set appropriate error message based on error type
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        setError('The request timed out. Please try again in a few moments.');
      } else if (error.response?.status === 404) {
        setError('Response ID not found. Please check the ID and try again.');
      } else if (error.response?.status === 500) {
        setError('Server error occurred. Our team has been notified.');
      } else {
        setError(error.response?.data?.detail || error.message || 'Failed to analyze Typeform response data');
      }
    } finally {
      if (!isCancelled) {
        setIsLoading(false);
      }
    }
    
    // Handle cleanup on page navigation/reload
    window.addEventListener('beforeunload', () => {
      isCancelled = true;
      controller.abort();
    });
  };

  // Fetch relevant review based on analysis data
  const getRelevantReview = async (analysisData: CareerAnalysisData) => {
    if (!analysisData || !analysisData.recommendedCareerPaths || analysisData.recommendedCareerPaths.length === 0) {
      console.error('No valid analysis data for review');
      return;
    }
    
    // Prevent multiple calls at once
    if (isReviewLoading) {
      console.log('Already loading review, skipping');
      return;
    }
    
    console.log('Starting review retrieval for analysis data');
    
    try {
      setIsReviewLoading(true);
      const strengths = analysisData.strengths.map(s => s.strength).slice(0, 3);
      const skillsToImprove = analysisData.skillsToImprove.map(s => s.skill).slice(0, 3);
      const careerPaths = analysisData.recommendedCareerPaths.map(p => p.title).slice(0, 1);
      
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
      
      console.log('Calling review service with profile data:', JSON.stringify(profileData));
      
      // Call the review service directly
      try {
        // Use direct API call instead of reviewsService for better control
        const response = await api.post('/api/v1/reviews/get-relevant-review', 
          { profileData },
          { timeout: 15000 }
        );
        
        console.log('Review service response:', response.data);
        
        // Check if response has a review property before setting it
        if (response.data && response.data.review) {
          console.log('Setting review from API response');
          setReview(response.data.review);
        } else {
          console.log('No valid review in response');
          setReview(undefined);
        }
      } catch (error) {
        console.error('Error calling review service:', error);
        setReview(undefined);
      }
    } catch (error) {
      console.error('Error in getRelevantReview:', error);
      setReview(undefined);
    } finally {
      console.log('Review loading complete');
      setIsReviewLoading(false);
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