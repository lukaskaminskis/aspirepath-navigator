import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { CareerAnalysisData } from '@/types/career';

interface CareerAnalysisContextProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  careerData: CareerAnalysisData | null;
  setCareerData: (data: CareerAnalysisData | null) => void;
}

const CareerAnalysisContext = createContext<CareerAnalysisContextProps | undefined>(undefined);

export const CareerAnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [careerData, setCareerData] = useState<CareerAnalysisData | null>(null);

  return (
    <CareerAnalysisContext.Provider
      value={{
        loading,
        setLoading,
        error,
        setError,
        careerData,
        setCareerData,
      }}
    >
      {children}
    </CareerAnalysisContext.Provider>
  );
};

export const useCareerAnalysis = (): CareerAnalysisContextProps => {
  const context = useContext(CareerAnalysisContext);
  if (context === undefined) {
    throw new Error('useCareerAnalysis must be used within a CareerAnalysisProvider');
  }
  return context;
};