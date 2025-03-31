import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Search, Shield, Award, TrendingUp, ArrowRight, Zap, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';
import ScoreIndicator from '@/components/career/ScoreIndicator';
import InsightCard from '@/components/career/InsightCard';
import { cn } from '@/lib/utils';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 mask-linear-gradient"></div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-block px-3 py-1 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full">
                AI-Powered Career Insights
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-black"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Navigate Your Career with Confidence
            </motion.h1>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Get personalized AI-driven career insights, upskilling recommendations, and expert guidance tailored to your professional journey.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button asChild size="lg" className="px-6">
                <Link to="/career-analysis" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Start Your Career Analysis
                </Link>
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            className="mt-16 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="relative w-full max-w-4xl">
              <div className="bg-white shadow-card rounded-lg overflow-hidden border border-border">
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    <div className="md:col-span-1 flex flex-col items-center justify-center">
                      <p className="text-sm text-center font-medium text-muted-foreground mb-4">Job Automation Risk</p>
                      <ScoreIndicator score={7} />
                      <p className="mt-4 text-xs text-center text-muted-foreground">
                        Based on 500+ data points and industry trends
                      </p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-medium mb-4 text-black">Career Insights Preview</h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded-md bg-secondary">
                          <div className="flex items-start">
                            <Shield className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-sm">Your analytical skills are highly valued and future-proof</p>
                          </div>
                        </div>
                        <div className="p-3 rounded-md bg-secondary">
                          <div className="flex items-start">
                            <Award className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-sm">Consider upskilling in data visualization to enhance career prospects</p>
                          </div>
                        </div>
                        <div className="p-3 rounded-md bg-secondary">
                          <div className="flex items-start">
                            <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-sm">AI implementation specialists are in high demand in your industry</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Link
                          to="/career-analysis"
                          className="text-black text-sm font-medium flex items-center hover:underline"
                        >
                          Unlock your full career analysis <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4 mt-8 text-center">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl py-6 px-4 shadow-sm border border-indigo-100/40">
                  <h4 className="text-base md:text-lg font-semibold text-black mb-2 tracking-wide uppercase">
                    Insights powered by
                  </h4>
                  <div className="w-20 h-1 bg-primary/20 mx-auto mb-6 rounded-full"></div>
                  
                  <div className="flex flex-wrap items-center justify-center gap-5 md:gap-10">
                    <div className="group rounded-lg bg-white shadow-sm p-3 md:p-4 hover:shadow-md transition-all duration-300 min-w-[130px] flex items-center justify-center h-16 transform hover:-translate-y-1">
                      <img 
                        src="/logos/World_Economic_Forum_logo.svg.png" 
                        alt="World Economic Forum" 
                        className="h-7 md:h-9 max-w-[110px] object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="group rounded-lg bg-white shadow-sm p-3 md:p-4 hover:shadow-md transition-all duration-300 min-w-[130px] flex items-center justify-center h-16 transform hover:-translate-y-1">
                      <img 
                        src="/logos/hd-linkedin-blue-official-logo-png-701751694779201bpivk39ebc.png" 
                        alt="LinkedIn" 
                        className="h-7 md:h-9 max-w-[110px] object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="group rounded-lg bg-white shadow-sm p-3 md:p-4 hover:shadow-md transition-all duration-300 min-w-[130px] flex items-center justify-center h-16 transform hover:-translate-y-1">
                      <img 
                        src="/logos/epoch-full-standard.svg" 
                        alt="Epoch AI" 
                        className="h-7 md:h-9 max-w-[110px] object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="group rounded-lg bg-white shadow-sm p-3 md:p-4 hover:shadow-md transition-all duration-300 min-w-[130px] flex items-center justify-center h-16 transform hover:-translate-y-1">
                      <img 
                        src="/logos/McKinsey-Logo.png" 
                        alt="McKinsey & Company" 
                        className="h-7 md:h-9 max-w-[110px] object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Career Guidance</h2>
            <p className="text-lg text-muted-foreground">
              Our AI-powered platform provides personalized insights to help you navigate your career with confidence.
            </p>
          </div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants}>
              <InsightCard 
                icon={<BarChart className="h-5 w-5 text-primary" />}
                title="Career Evaluation"
                description="Get a comprehensive assessment of your current career path, including automation risk and future prospects."
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <InsightCard 
                icon={<TrendingUp className="h-5 w-5 text-primary" />}
                title="Upskilling Recommendations"
                description="Discover personalized learning paths and programs to enhance your skills and stay relevant."
                index={1}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <InsightCard 
                icon={<Zap className="h-5 w-5 text-primary" />}
                title="Data-Driven Insights"
                description="Access insights powered by World Economic Forum, LinkedIn, and McKinsey research on workforce transformation in the AI era."
                index={2}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
