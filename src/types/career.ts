// Demand level for career paths
export type DemandLevel = 'High' | 'Medium' | 'Low';

// Career path definition
export interface CareerPath {
  title: string;
  description: string;
  growthRate: string;
  demandLevel: DemandLevel;
  skillsRequired: string[];
}

// Skills to improve definition
export interface SkillToImprove {
  skill: string;
  description: string;
  detailDescription?: string;
}

// Strengths definition
export interface Strength {
  strength: string;
  description: string;
  descriptionDetails?: string[];
}

// Program definition for schools
export interface Program {
  name: string;
  duration: string;
  cost: string;
}

// School definition
export interface School {
  name: string;
  logoUrl: string;
  description: string;
  reviewSource: string;
  reviewScore: number;
  reviewCount: number;
  programs: Program[];
}

// FAQ item definition
export interface FaqItem {
  question: string;
  answer: string;
}

// Career analysis data definition
export interface CareerAnalysisData {
  automationRiskScore: number;
  automationRiskInsight: string;
  automationRiskDescription?: string;
  strengths: Strength[];
  skillsToImprove: SkillToImprove[];
  recommendedCareerPaths: CareerPath[];
  recommendedSchools?: School[];
  faqs?: FaqItem[];
}