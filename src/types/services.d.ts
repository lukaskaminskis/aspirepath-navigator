declare module '@/services/mockData' {
  import { CareerAnalysisData } from '@/contexts/CareerAnalysisContext';
  export const mockCareerData: CareerAnalysisData;
}

declare module '@/services/api' {
  export const careerAnalysisService: {
    analyzeCareer: (formData: FormData) => Promise<any>;
  };
  
  const api: any;
  export default api;
} 