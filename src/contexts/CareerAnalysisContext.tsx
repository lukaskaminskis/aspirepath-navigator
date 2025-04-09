import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { careerAnalysisService } from '@/services/api';

type CareerPathType = {
  title: string;
  description: string;
  growthRate: string;
  demandLevel: string;
  skillsRequired: string[];
};

type StrengthType = {
  strength: string;
  description: string;
  descriptionDetails?: string;
};

type SkillType = {
  skill: string;
  description: string;
  detailDescription?: string;
};

type FaqType = {
  question: string;
  answer: string;
};

type CareerDataType = {
  automationRiskScore: number;
  automationRiskDescription: string;
  automationRiskInsight: string;
  strengths: StrengthType[];
  skillsToImprove: SkillType[];
  recommendedCareerPaths: CareerPathType[];
  faqs: FaqType[];
};

export interface CareerAnalysisContextProps {
  careerData: CareerDataType | null;
  isLoading: boolean;
  error: string | null;
  analyzeProfile: (profileData: any) => Promise<void>;
  analyzeTypeformResponse: (responseId: string) => Promise<void>;
}

interface CareerAnalysisContextType {
  isLoading: boolean;
  error: string | null;
  careerData: CareerDataType | null;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCareerData: (data: CareerDataType | null) => void;
  analyzeProfile: (profileData: any) => Promise<void>;
  analyzeTypeformResponse: (responseId: string) => Promise<void>;
}

const CareerAnalysisContext = createContext<CareerAnalysisContextType | undefined>(undefined);

export const CareerAnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [careerData, setCareerData] = useState<CareerDataType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeProfile = async (profileData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await careerAnalysisService.analyzeCareer(profileData);
      setCareerData(response.data);
    } catch (error: any) {
      console.error('Error analyzing career:', error);
      setError(error.message || 'Failed to analyze career data');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeTypeformResponse = async (responseId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await careerAnalysisService.analyzeTypeformResponse(responseId);
      setCareerData(response.data);
    } catch (error: any) {
      console.error('Error analyzing Typeform response:', error);
      setError(error.message || 'Failed to analyze Typeform response data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CareerAnalysisContext.Provider
      value={{
        careerData,
        isLoading,
        error,
        setIsLoading,
        setError,
        setCareerData,
        analyzeProfile,
        analyzeTypeformResponse
      }}
    >
      {children}
    </CareerAnalysisContext.Provider>
  );
};

export const useCareerAnalysis = (): CareerAnalysisContextType => {
  const context = useContext(CareerAnalysisContext);
  if (context === undefined) {
    throw new Error('useCareerAnalysis must be used within a CareerAnalysisProvider');
  }
  return context;
};