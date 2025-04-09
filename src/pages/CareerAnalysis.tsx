import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  BrainCircuit, 
  Lightbulb, 
  AlertTriangle, 
  ArrowRight,
  Zap,
  Award,
  Mail,
  Upload,
  Loader
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageLayout from '@/components/layout/PageLayout';
import ScoreIndicator from '@/components/career/ScoreIndicator';
import StrengthItem from '@/components/career/StrengthItem';
import SkillItem from '@/components/career/SkillItem';
import CareerPathCard from '@/components/career/CareerPathCard';
import SchoolCard from '@/components/career/SchoolCard';
import FaqCard from '@/components/career/FaqCard';
import TypeformAnalysisForm from '@/components/career/TypeformAnalysisForm';
import ReviewComponent from '@/components/career/ReviewComponent';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCareerAnalysis } from '@/contexts/CareerAnalysisContext';

const CareerAnalysis = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [typeformResponseId, setTypeformResponseId] = useState<string | null>(null);
  const { isLoading, error, careerData, analyzeTypeformResponse } = useCareerAnalysis();
  
  // Use refs to track analysis state
  const analysisStartedRef = useRef<boolean>(false);
  const responseIdRef = useRef<string | null>(null);
  
  // Get responseId from URL params if available
  const { responseId } = useParams<{ responseId?: string }>();
  const navigate = useNavigate();
  
  // Set initial state from URL parameters
  useEffect(() => {
    setIsLoaded(true);
    
    // If responseId is in the URL, use it
    if (responseId) {
      setTypeformResponseId(responseId);
      setShowAnalysis(true);
    }
  }, [responseId]);

  // Log automation risk insight when it's available
  useEffect(() => {
    if (careerData) {
      console.log('automationRiskInsight value:', careerData.automationRiskInsight);
    }
  }, [careerData]);

  // Handle analysis lifecycle
  useEffect(() => {
    // Only proceed if we have a responseId and should show analysis
    if (!typeformResponseId || !showAnalysis) {
      return;
    }
    
    // Skip if we've already started analysis for this responseId
    if (analysisStartedRef.current && responseIdRef.current === typeformResponseId) {
      return;
    }
    
    // Mark that we've started analysis and store the responseId
    analysisStartedRef.current = true;
    responseIdRef.current = typeformResponseId;
    
    console.log('Starting analysis for response ID:', typeformResponseId);
    
    // Start analysis and handle errors
    const startAnalysis = async () => {
      try {
        await analyzeTypeformResponse(typeformResponseId);
      } catch (err) {
        console.error('Error in typeform analysis:', err);
      }
    };
    
    startAnalysis();
    
    // Cleanup function
    return () => {
      console.log('Component unmounting during analysis');
      // No need to reset the analysisStartedRef here to avoid repeated api calls
    };
  }, [typeformResponseId, showAnalysis]); // Don't include analyzeTypeformResponse in deps

  const handleTypeformSubmit = (responseId: string) => {
    setTypeformResponseId(responseId);
    setShowAnalysis(true);
    
    // Update URL with responseId for bookmarking/sharing
    navigate(`/career-analysis/${responseId}`, { replace: true });
    
    window.scrollTo(0, 0);
  };

  // Add a reset handler to allow users to try again after errors
  const handleReset = () => {
    setTypeformResponseId(null);
    setShowAnalysis(false);
    setIsLoaded(false);
    window.location.href = '/career-analysis';
  };

  return (
    <PageLayout>
      {/* Initial form view */}
      {!showAnalysis && (
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Your Personalized Career Analysis
              </motion.h1>
              
              <motion.p 
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Complete our brief questionnaire to get insights, skill recommendations, and personalized growth paths.
              </motion.p>
            </div>
            
            <TypeformAnalysisForm onSubmissionComplete={handleTypeformSubmit} />
          </div>
        </section>
      )}

      {/* Loading state */}
      {showAnalysis && isLoading && (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-xl font-medium">Analyzing your career profile...</p>
          <p className="text-muted-foreground mt-2">This may take a moment</p>
          <div className="mt-6">
            <Button variant="ghost" onClick={handleReset}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Error state */}
      {showAnalysis && error && !isLoading && (
        <div className="container max-w-3xl mx-auto py-16">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error || "An error occurred while analyzing your profile. Please try again."}
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Button onClick={handleReset}>
              Try Again
            </Button>
          </div>
        </div>
      )}
    
      {/* Results view - only render when we have data and aren't loading */}
      {showAnalysis && !isLoading && !error && careerData && (
        <>
          {/* Data Sources Section */}
          <section className="py-8 bg-slate-50 border-b border-slate-200">
            <div className="container">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-primary/10 p-2 mt-1">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-black">Analysis Sources & Methodology</h3>
                    <p className="text-sm text-muted-foreground mb-5">
                      Your profile was analyzed using our proprietary AI system powered by data from 
                      the <strong>World Economic Forum's Future of Jobs Report 2025</strong>, <strong>LinkedIn Workplace Learning Report</strong>, 
                      and <strong>Epoch AI</strong> research on automation trends and career development. 
                      Analysis includes insights from McKinsey & Company, Vox technology specialists, and other leading 
                      institutions studying workforce transformation in the AI era.
                    </p>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 mt-4">
                      {/* Only render 2 logos to reduce hidden elements */}
                      <div className="rounded-lg bg-white shadow-sm p-3 hover:shadow-md transition-shadow">
                        <img 
                          src="/logos/World_Economic_Forum_logo.svg.png" 
                          alt="World Economic Forum" 
                          className="h-8 md:h-10 object-contain"
                        />
                      </div>
                      <div className="rounded-lg bg-white shadow-sm p-3 hover:shadow-md transition-shadow">
                        <img 
                          src="/logos/hd-linkedin-blue-official-logo-png-701751694779201bpivk39ebc.png" 
                          alt="LinkedIn" 
                          className="h-8 md:h-10 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Career Evaluation Section */}
          <section className="py-16">
            <div className="container">
              <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">Career Evaluation</h2>
                  <p className="text-muted-foreground">
                    Based on your profile and current industry trends, here's a comprehensive analysis of your career outlook.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="col-span-1 flex flex-col items-center text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="font-medium mb-6">Job Automation Risk Score</h3>
                      <ScoreIndicator score={careerData.automationRiskScore} size="lg" />
                      <p className="mt-4 text-sm text-muted-foreground">
                        Your current role has a <strong>{careerData.automationRiskScore < 4 ? 'low' : careerData.automationRiskScore < 7 ? 'moderate' : 'high'}</strong> risk of automation within the next 3 years
                      </p>
                      
                      <div className="border-l-4 border-amber-400 pl-4 bg-amber-50 p-3 rounded-r-lg mb-6">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-amber-400 mr-2 mt-0.5" />
                          <p className="text-sm text-amber-700">
                            {careerData.automationRiskInsight || "While your core role is safe, 35% of your daily tasks could be automated in the next 18 months."}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 space-y-8">
                    <div>
                      <h3 className="font-medium mb-4">Key Strengths</h3>
                      <div className="space-y-3">
                        {/* Limit to first 3 strengths to reduce DOM elements */}
                        {careerData.strengths.slice(0, 3).map((strength, index) => (
                          <StrengthItem
                            key={index}
                            strength={strength.strength}
                            description={strength.description}
                            descriptionDetails={strength.descriptionDetails}
                            index={index}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-4">Skills to Improve</h3>
                      <div className="space-y-3">
                        {/* Limit to first 3 skills to reduce DOM elements */}
                        {careerData.skillsToImprove.slice(0, 3).map((skill, index) => (
                          <SkillItem
                            key={index}
                            skill={skill.skill}
                            description={skill.description}
                            detailDescription={skill.detailDescription}
                            index={index}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-16">
                  <h3 className="font-medium mb-6">Recommended Career Paths</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Limit to first 2 career paths (as already done) */}
                    {careerData.recommendedCareerPaths.slice(0, 2).map((path, index) => (
                      <CareerPathCard
                        key={index}
                        title={path.title}
                        description={path.description}
                        growthRate={path.growthRate}
                        demandLevel={path.demandLevel as "High" | "Medium" | "Low"}
                        skillsRequired={path.skillsRequired}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Upskilling & Learning Recommendations */}
          <section className="py-16 bg-secondary">
            <div className="container">
              <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">Hear out what our learners say...</h2>
                  <p className="text-muted-foreground">
                    Discover how our program transforms careers and helps professionals reach their full potential.
                  </p>
                </div>
                
                {/* Only render ReviewComponent if we have careerData to prevent unnecessary API calls */}
                {careerData && (
                  <ReviewComponent 
                    profileData={{
                      skills: careerData.strengths.slice(0, 3).map(skill => skill.strength),
                      experience: [],
                      education: [],
                      interests: [],
                      course_interest: careerData.recommendedCareerPaths[0]?.title || "",
                      program: careerData.recommendedCareerPaths[0]?.title || ""
                    }} 
                  />
                )}
              </div>
            </div>
          </section>
          
          {/* Career Fears & Uncertainties */}
          <section className="py-16">
            <div className="container">
              <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">Addressing Career Fears & Uncertainties</h2>
                  <p className="text-muted-foreground">
                    Expert-backed answers to common career concerns to help you navigate uncertainties with confidence.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {/* Limit to first 2 FAQs to reduce DOM elements */}
                  {careerData.faqs && careerData.faqs.slice(0, 2).map((faq, index) => (
                    <FaqCard
                      key={index}
                      question={faq.question}
                      answer={faq.answer}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </PageLayout>
  );
};

export default CareerAnalysis;
