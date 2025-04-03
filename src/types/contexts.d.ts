declare module '@/contexts/CareerAnalysisContext' {
  export interface CareerPath {
    title: string;
    description: string;
    growthRate: string;
    demandLevel: string;
    skillsRequired: string[];
  }

  export interface SkillToImprove {
    skill: string;
    description: string;
    detailDescription?: string;
  }

  export interface Strength {
    strength: string;
    description: string;
    descriptionDetails?: string[];
  }

  export interface CareerAnalysisData {
    automationRiskScore: number;
    automationRiskInsight: string;
    strengths: Strength[];
    skillsToImprove: SkillToImprove[];
    recommendedCareerPaths: CareerPath[];
    faqs?: {
      question: string;
      answer: string;
    }[];
  }

  export interface CareerAnalysisContextProps {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    careerData: CareerAnalysisData | null;
    setCareerData: (data: CareerAnalysisData | null) => void;
  }

  export function useCareerAnalysis(): CareerAnalysisContextProps;
  
  export const CareerAnalysisProvider: React.FC<{ children: React.ReactNode }>;
} 