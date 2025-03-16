
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  BrainCircuit, 
  Lightbulb, 
  AlertTriangle, 
  ArrowRight,
  Zap,
  Award 
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

const CareerAnalysis = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pt-16 pb-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-block px-3 py-1 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full">
                Career Assessment Report
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Your Personalized Career Analysis
            </motion.h1>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Explore your career insights, skill recommendations, and personalized growth paths.
            </motion.p>
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
                  <ScoreIndicator score={7} size="lg" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Your current role has a <strong>moderate</strong> risk of automation within the next 3 years
                  </p>
                  
                  <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                      <h4 className="font-medium text-amber-800">Key Insight</h4>
                    </div>
                    <p className="text-sm text-amber-700">
                      While your core role is safe, 35% of your daily tasks could be automated in the next 18 months.
                    </p>
                  </div>
                </motion.div>
              </div>
              
              <div className="col-span-1 md:col-span-2 space-y-8">
                <div>
                  <h3 className="font-medium mb-4">Key Strengths</h3>
                  <div className="space-y-3">
                    <StrengthItem
                      strength="Analytical Thinking"
                      description="You excel at breaking down complex problems and drawing insightful conclusions, a skill increasingly valued as AI becomes mainstream."
                      index={0}
                    />
                    <StrengthItem
                      strength="Project Management"
                      description="Your ability to coordinate resources, timelines, and stakeholders remains a distinctly human skill resistant to automation."
                      index={1}
                    />
                    <StrengthItem
                      strength="Stakeholder Communication"
                      description="Your exceptional communication skills allow you to bridge technical and business domains effectively."
                      index={2}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Skills to Improve</h3>
                  <div className="space-y-3">
                    <SkillItem
                      skill="Data Visualization"
                      description="Enhancing your ability to present complex data in intuitive visual formats would give you a competitive edge in data-driven decisions."
                      index={0}
                    />
                    <SkillItem
                      skill="AI Implementation"
                      description="Understanding how to implement and integrate AI tools would position you as a leader in the evolving workplace."
                      index={1}
                    />
                    <SkillItem
                      skill="Strategic Planning"
                      description="Developing long-term planning skills would complement your existing project management expertise and position you for leadership roles."
                      index={2}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16">
              <h3 className="font-medium mb-6">Recommended Career Paths</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CareerPathCard
                  title="Data Analytics Manager"
                  description="Lead data-driven decision making processes and oversee analytics teams to extract valuable business insights."
                  growthRate="+24% in 3 years"
                  demandLevel="High"
                  skillsRequired={["Data Visualization", "Team Leadership", "Statistical Analysis"]}
                  index={0}
                />
                <CareerPathCard
                  title="AI Implementation Specialist"
                  description="Bridge the gap between technical AI capabilities and business needs, helping organizations adopt AI effectively."
                  growthRate="+35% in 3 years"
                  demandLevel="High"
                  skillsRequired={["AI Knowledge", "Change Management", "Technical Integration"]}
                  index={1}
                />
                <CareerPathCard
                  title="Strategic Program Director"
                  description="Oversee multiple projects aligned with organizational goals, ensuring successful execution of company vision."
                  growthRate="+18% in 3 years"
                  demandLevel="Medium"
                  skillsRequired={["Strategic Planning", "Resource Allocation", "Executive Communication"]}
                  index={2}
                />
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
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Upskilling & Learning Recommendations</h2>
              <p className="text-muted-foreground">
                Based on your career goals and industry trends, here are personalized learning recommendations to enhance your skill set.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SchoolCard
                name="DataCamp"
                logoUrl=""
                description="Specialized in data science and analytics courses with hands-on learning and interactive exercises."
                reviewSource="Trustpilot"
                reviewScore={4.7}
                reviewCount={2845}
                programs={[
                  {
                    name: "Data Visualization with Python",
                    duration: "2 months",
                    cost: "$39/month"
                  },
                  {
                    name: "Data Science Career Track",
                    duration: "6 months",
                    cost: "$399 total"
                  },
                  {
                    name: "Business Analytics",
                    duration: "3 months",
                    cost: "$25/month"
                  }
                ]}
                index={0}
              />
              
              <SchoolCard
                name="Coursera"
                logoUrl=""
                description="Partnership with top universities offering accredited certificates and specializations in various fields."
                reviewSource="Google Reviews"
                reviewScore={4.5}
                reviewCount={3256}
                programs={[
                  {
                    name: "AI For Business",
                    duration: "4 months",
                    cost: "$49/month"
                  },
                  {
                    name: "Strategic Management & Leadership",
                    duration: "8 months",
                    cost: "$399 total"
                  },
                  {
                    name: "Project Management Professional",
                    duration: "6 months",
                    cost: "$49/month"
                  }
                ]}
                index={1}
              />
              
              <SchoolCard
                name="LinkedIn Learning"
                logoUrl=""
                description="Professional development platform with courses covering business, creative, and technical skills."
                reviewSource="Trustpilot"
                reviewScore={4.3}
                reviewCount={1987}
                programs={[
                  {
                    name: "Leadership Communication",
                    duration: "1 month",
                    cost: "$29.99/month"
                  },
                  {
                    name: "Strategic Planning Foundations",
                    duration: "3 weeks",
                    cost: "$29.99/month"
                  },
                  {
                    name: "Advanced Project Management",
                    duration: "2 months",
                    cost: "$29.99/month"
                  }
                ]}
                index={2}
              />
              
              <SchoolCard
                name="Udacity"
                logoUrl=""
                description="Industry-focused nanodegree programs created in partnership with leading technology companies."
                reviewSource="CourseReport"
                reviewScore={4.6}
                reviewCount={1245}
                programs={[
                  {
                    name: "AI Product Manager",
                    duration: "3 months",
                    cost: "$399/month"
                  },
                  {
                    name: "Data Scientist",
                    duration: "4 months",
                    cost: "$399/month"
                  },
                  {
                    name: "Business Analytics",
                    duration: "3 months",
                    cost: "$399/month"
                  }
                ]}
                index={3}
              />
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
              <FaqCard
                question="How do I effectively navigate a mid-life career change?"
                answer="A successful mid-life career change requires a strategic approach. Start by identifying transferable skills from your current role, then research industries with lower barriers to entry for professionals with your experience level. Consider a gradual transition through upskilling while in your current position, and leverage your professional network to explore opportunities. Most successful mid-life career changers take 12-18 months to fully transition, using short-term consulting or project work to build credibility in their new field while maintaining financial stability."
                index={0}
              />
              
              <FaqCard
                question="What steps can I take to overcome workplace fears and uncertainties?"
                answer="Workplace fears often stem from uncertainty and perceived lack of control. Create a detailed development plan with specific, measurable goals to regain a sense of direction. Identify the specific triggers of your workplace anxiety and address them individually. Build a support network of mentors, peers, and if necessary, professional coaches. Regularly assess your market value by researching comparable positions and required skills. Finally, maintain work-life boundaries and practice regular reflection on accomplishments to build confidence over time."
                index={1}
              />
              
              <FaqCard
                question="What essential AI-driven skills should I develop to stay relevant?"
                answer="As AI transforms the workplace, focus on developing these key skills: AI literacy (understanding AI capabilities and limitations), data interpretation (making meaning from AI-processed information), critical thinking (evaluating AI recommendations), ethical judgment (making decisions where AI provides data but cannot make value judgments), collaboration with AI tools (knowing when and how to leverage them), and adaptive learning (continuously updating your skillset as AI evolves). Most professionals should aim to spend 3-5 hours weekly developing these skills through courses, projects, and deliberate practice."
                index={2}
              />
              
              <FaqCard
                question="How can I leverage my existing experience for new opportunities?"
                answer="Start by conducting a comprehensive skills inventory, categorizing your abilities into technical, transferable, and adaptive skills. Research how professionals with similar backgrounds have successfully pivoted to new roles or industries. Create compelling narratives that connect your past achievements to future aspirations, focusing on outcomes rather than responsibilities. Strategically seek 'bridge experiences' through volunteer work, side projects, or targeted roles that can serve as stepping stones. Finally, customize your resume and online presence to highlight relevant experience for specific opportunities rather than presenting a chronological work history."
                index={3}
              />
              
              <FaqCard
                question="How should I prepare for AI-driven changes in my industry?"
                answer="Start by researching current and upcoming AI implementations specific to your industry through industry publications and conferences. Identify which aspects of your role are most susceptible to automation and which require uniquely human skills. Engage with early AI tools in your field, even in limited ways, to develop familiarity. Build relationships with technical teams implementing AI in your organization to gain insights into strategic directions. Create a personal adaptation roadmap with quarterly learning goals focused on complementary skills that enhance rather than compete with AI capabilities."
                index={4}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Take Your Career to the Next Level</h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8">
            Dive deeper into personalized career development with our premium features, including one-on-one career coaching and detailed industry reports.
          </p>
          <Button variant="secondary" size="lg" className="px-6">
            Explore Premium Features <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default CareerAnalysis;
