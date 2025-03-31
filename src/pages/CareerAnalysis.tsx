import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
import ContactForm from '@/components/career/ContactForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCareerAnalysis } from '@/contexts/CareerAnalysisContext';

const CareerAnalysis = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { loading, error, careerData } = useCareerAnalysis();
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (careerData) {
      console.log('automationInsight value:', careerData.automationInsight);
    }
  }, [careerData]);

  const handleFormSubmit = () => {
    setShowAnalysis(true);
    window.scrollTo(0, 0);
  };

  return (
    <PageLayout>
      {!showAnalysis ? (
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
                Connect your LinkedIn profile to get insights, skill recommendations, and personalized growth paths.
              </motion.p>
            </div>
            
            <ContactForm onSubmit={handleFormSubmit} />
          </div>
        </section>
      ) : (
        <>
          {loading && (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-xl font-medium">Analyzing your career profile...</p>
              <p className="text-muted-foreground mt-2">This may take a moment</p>
            </div>
          )}

          {error && (
            <div className="container max-w-3xl mx-auto py-16">
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error || "An error occurred while analyzing your profile. Please try again."}
                </AlertDescription>
              </Alert>
              <div className="mt-6 text-center">
                <Button onClick={() => setShowAnalysis(false)}>
                  Go Back
                </Button>
              </div>
            </div>
          )}
        
          {!loading && !error && careerData && (
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
                          <div className="rounded-lg bg-white shadow-sm p-3 hover:shadow-md transition-shadow">
                            <img 
                              src="/logos/epoch-full-standard.svg" 
                              alt="Epoch AI" 
                              className="h-8 md:h-10 object-contain"
                            />
                          </div>
                          <div className="rounded-lg bg-white shadow-sm p-3 hover:shadow-md transition-shadow">
                            <img 
                              src="/logos/McKinsey-Logo.png" 
                              alt="McKinsey" 
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
                                {careerData.automationInsight || "While your core role is safe, 35% of your daily tasks could be automated in the next 18 months."}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                      
                      <div className="col-span-1 md:col-span-2 space-y-8">
                        <div>
                          <h3 className="font-medium mb-4">Key Strengths</h3>
                          <div className="space-y-3">
                            {careerData.strengths.map((strength, index) => (
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
                            {careerData.skillsToImprove.map((skill, index) => (
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {careerData.recommendedCareerPaths.map((path, index) => (
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
                    
                    <div className="bg-white rounded-xl shadow-md p-8">
                      <div className="flex flex-col md:flex-row md:items-start gap-6">
                        <div className="flex-shrink-0">
                          <img 
                            src="/logos/daniar-profile.jpg" 
                            alt="Daniar Abdraiymov" 
                            className="w-24 h-24 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://ui-avatars.com/api/?name=Daniar+Abdraiymov&background=0D8ABC&color=fff";
                            }}
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-black">Daniar Abdraiymov</h3>
                            <span className="text-muted-foreground">Mar 11, 2025</span>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-muted-foreground">Student • Web development • Online</p>
                            <div className="flex items-center mt-1">
                              <div className="rounded-full bg-emerald-100 p-1 mr-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                              </div>
                              <span className="text-emerald-600 text-sm font-medium">Verified by GitHub</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-6">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-black">Overall Experience</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-black">Instructors</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-black">Curriculum</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-black">Job Assistance</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <h4 className="text-lg font-medium mb-4 text-black">The best way to learn Programming</h4>
                          
                          <div className="space-y-4 text-gray-700">
                            <p>
                              Before attending Turing College, I began my journey in web development through various courses on YouTube and Udemy. Although I had the opportunity to learn programming independently, I struggled significantly without the guidance of mentors and team leads. As a beginner, I found my self-study approach to be somewhat chaotic, uncertain about what, how, and when to study.
                            </p>
                            <p>
                              Turing College provided a clear, structured learning path that immediately advanced my skills as a programmer. The availability of experienced mentors, supportive staff, and knowledgeable peers has been invaluable. These mentors, who are seasoned engineers in the industry, have helped me understand how real-world projects are developed and executed.
                            </p>
                            <p>
                              Regardless of your background, I highly recommend Turing College. You will benefit from a supportive community, access to an excellent learning platform, and opportunities to network with remarkable individuals.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
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
                      {careerData.faqs && careerData.faqs.map((faq, index) => (
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
        </>
      )}
    </PageLayout>
  );
};

export default CareerAnalysis;
