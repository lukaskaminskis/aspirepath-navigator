import type { CareerAnalysisData, DemandLevel } from '@/types/career';

export const mockCareerData: CareerAnalysisData = {
  automationRiskScore: 6,
  automationRiskInsight: "While your core role is safe, 35% of your daily tasks could be automated in the next 18 months.",
  automationRiskDescription: "Moderate automation risk",
  strengths: [
    {
      strength: "Analytical Thinking",
      description: "You excel at breaking down complex problems and drawing insightful conclusions, a skill increasingly valued as AI becomes mainstream.",
      descriptionDetails: [
        "Your data-driven approach helps identify patterns that others miss, making you an asset for strategic decision-making.",
        "This cognitive flexibility will become even more valuable as organizations navigate increasingly complex technological landscapes."
      ]
    },
    {
      strength: "Project Management",
      description: "Your ability to coordinate resources, timelines, and stakeholders remains a distinctly human skill resistant to automation.",
      descriptionDetails: [
        "You demonstrate exceptional organizational skills when balancing competing priorities and maintaining project momentum.",
        "Your adaptive leadership style enables teams to overcome obstacles and deliver results even in uncertain conditions."
      ]
    },
    {
      strength: "Stakeholder Communication",
      description: "Your exceptional communication skills allow you to bridge technical and business domains effectively.",
      descriptionDetails: [
        "You excel at translating complex concepts into accessible language that builds trust and alignment across departments.",
        "This human-centered skill will remain irreplaceable as technology continues to transform business operations."
      ]
    }
  ],
  skillsToImprove: [
    {
      skill: "Data Visualization",
      description: "Enhancing your ability to present complex data in intuitive visual formats would give you a competitive edge in data-driven decisions.",
      detailDescription: "Organizations increasingly value professionals who can translate analytics into compelling visuals that drive strategic insights and effective decision-making."
    },
    {
      skill: "AI Implementation",
      description: "Understanding how to implement and integrate AI tools would position you as a leader in the evolving workplace.",
      detailDescription: "As AI becomes ubiquitous across industries, professionals who can bridge the gap between business needs and AI capabilities will be in high demand."
    },
    {
      skill: "Strategic Planning",
      description: "Developing long-term planning skills would complement your existing project management expertise and position you for leadership roles.",
      detailDescription: "The ability to create and execute strategic plans that align with organizational goals will distinguish you as a valuable contributor with executive potential."
    }
  ],
  recommendedCareerPaths: [
    {
      title: "Data Analytics Manager",
      description: "Lead data-driven decision making processes and oversee analytics teams to extract valuable business insights.",
      growthRate: "+24% in 3 years",
      demandLevel: "High",
      skillsRequired: ["Data Visualization", "Team Leadership", "Statistical Analysis"]
    },
    {
      title: "AI Implementation Specialist",
      description: "Bridge the gap between technical AI capabilities and business needs, helping organizations adopt AI effectively.",
      growthRate: "+35% in 3 years",
      demandLevel: "High",
      skillsRequired: ["AI Knowledge", "Change Management", "Technical Integration"]
    },
    {
      title: "Strategic Program Director",
      description: "Oversee multiple projects aligned with organizational goals, ensuring successful execution of company vision.",
      growthRate: "+18% in 3 years",
      demandLevel: "Medium",
      skillsRequired: ["Strategic Planning", "Resource Allocation", "Executive Communication"]
    }
  ],
  recommendedSchools: [
    {
      name: "DataCamp",
      logoUrl: "",
      description: "Specialized in data science and analytics courses with hands-on learning and interactive exercises.",
      reviewSource: "Trustpilot",
      reviewScore: 4.7,
      reviewCount: 2845,
      programs: [
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
      ]
    },
    {
      name: "Coursera",
      logoUrl: "",
      description: "Partnership with top universities offering accredited certificates and specializations in various fields.",
      reviewSource: "Google Reviews",
      reviewScore: 4.5,
      reviewCount: 3256,
      programs: [
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
      ]
    }
  ],
  faqs: [
    {
      question: "How do I effectively navigate a mid-life career change?",
      answer: "A successful mid-life career change requires a strategic approach. Start by identifying transferable skills from your current role, then research industries with lower barriers to entry for professionals with your experience level. Consider a gradual transition through upskilling while in your current position, and leverage your professional network to explore opportunities."
    },
    {
      question: "What steps can I take to overcome workplace fears and uncertainties?",
      answer: "Workplace fears often stem from uncertainty and perceived lack of control. Create a detailed development plan with specific, measurable goals to regain a sense of direction. Identify the specific triggers of your workplace anxiety and address them individually."
    }
  ]
}; 