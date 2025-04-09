import React, { createContext, useState, ReactNode, useContext } from 'react';
import { CareerAnalysisData } from '@/types/career';
import { careerAnalysisService, CareerAnalysisServiceType } from '@/services/api';

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
}

// Create context with a default undefined value
const CareerAnalysisContext = createContext<CareerAnalysisContextType | undefined>(undefined);

export const CareerAnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [careerData, setCareerData] = useState<CareerAnalysisData | null>(null);

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
      setIsLoading(true);
      setError(null);
      console.log('Analyzing Typeform response:', responseId);
      
      // Add additional logging to trace the API call
      console.log('Making API request to:', `/api/v1/typeform/analyze/${responseId}`);
      
      const response = await careerAnalysisService.analyzeTypeformResponse(responseId);
      console.log('Response structure:', JSON.stringify(response, null, 2));
      
      // The response should have structure { success: boolean, response_id: string, analysis: CareerAnalysisData }
      if (response && response.analysis) {
        console.log('Analysis data received successfully');
        setCareerData(response.analysis);
      } else if (response && response.success === false) {
        console.error('API returned success: false', response);
        throw new Error(response.error || 'Failed to analyze your response');
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response data structure. This may be a temporary issue. Please try again later.');
      }
    } catch (error: any) {
      console.error('Error analyzing Typeform response:', error);
      console.error('Error details:', error.response?.data, error.stack);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to analyze Typeform response data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
        analyzeTypeformResponse
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