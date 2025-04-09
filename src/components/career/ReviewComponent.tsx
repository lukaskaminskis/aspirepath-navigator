import { useState, useEffect, useRef, useMemo } from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import api from '@/services/api';

// Types for review data
type Review = {
  reviewer_name: string;
  review_date: string;
  student_type: string;
  course: string;
  format: string;
  verified: string;
  review_title: string;
  review_content: string;
  overall_rating: string;
  instructor_rating: string;
  curriculum_rating: string;
  job_assistance_rating: string;
};

type ReviewResponse = {
  success: boolean;
  review: Review | null;
  is_fallback: boolean;
  error?: string;
};

type ProfileData = {
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    description?: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    field: string;
  }>;
  interests: string[];
  course_interest?: string;
  program?: string;
  is_mock_data?: boolean;
};

interface ReviewComponentProps {
  profileData: ProfileData;
}

// Create a global cache for reviews that persists between renders
// This is outside the component to avoid being recreated
const globalReviewCache = new Map<string, {review: Review | null, error: string | null}>();

// For debugging purposes
console.log("ReviewComponent module loaded, cache size:", globalReviewCache.size);

// Helper function to render stars
const renderStars = (count: number) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push(
      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    );
  }
  return stars;
};

// Add a mock review function that generates a review based on the program
const getMockReview = (program: string): Review => {
  // Default values
  let reviewerName = "Sarah Johnson";
  let course = "Data Science Program";
  let reviewTitle = "Transformed My Career Path";
  let reviewContent = "The program was exactly what I needed to transition into data science. The curriculum was comprehensive and the instructors were knowledgeable and supportive.";
  
  // Customize based on program
  if (program.toLowerCase().includes("data analytics")) {
    reviewerName = "Michael Chen";
    course = "Data Analytics Bootcamp";
    reviewTitle = "Excellent Analytics Training";
    reviewContent = "The Data Analytics program exceeded my expectations. I gained practical skills that I could immediately apply in my current role, and within six months I received a promotion to a senior analytics position.";
  } else if (program.toLowerCase().includes("ai")) {
    reviewerName = "Priya Sharma";
    course = "AI Engineering Certificate";
    reviewTitle = "Perfect Introduction to AI";
    reviewContent = "Coming from a software development background, this program was the perfect bridge to AI engineering. The hands-on projects were challenging but extremely valuable for building my portfolio.";
  } else if (program.toLowerCase().includes("marketing")) {
    reviewerName = "James Wilson";
    course = "Digital Marketing & Analytics";
    reviewTitle = "Game Changer for Marketing Career";
    reviewContent = "This program helped me transition from traditional marketing to a data-driven approach. I'm now managing campaigns with measurable ROI and getting much better results for my clients.";
  }
  
  return {
    reviewer_name: reviewerName,
    review_date: "March 2025",
    student_type: "Graduate",
    course: course,
    format: "Online",
    verified: "Yes",
    review_title: reviewTitle,
    review_content: reviewContent,
    overall_rating: "5",
    instructor_rating: "5",
    curriculum_rating: "4",
    job_assistance_rating: "5"
  };
};

const ReviewComponent = ({ profileData }: ReviewComponentProps) => {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Use refs to keep stable references across re-renders
  const controllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const hasAttemptedRef = useRef<boolean>(false);

  // Create a stable profile key for caching based on important profile properties
  const cacheKey = useMemo(() => {
    const program = profileData?.program || profileData?.course_interest || '';
    const skills = profileData?.skills?.slice(0, 3)?.join(',') || '';
    return `${program}-${skills}`;
  }, [profileData]);
  
  // UseEffect for debugging
  useEffect(() => {
    // If this is marked as mock data and has a program, we can generate a mock review
    if (profileData?.is_mock_data && profileData?.program) {
      console.log("Using mock review for program:", profileData.program);
      const mockReview = getMockReview(profileData.program);
      setReview(mockReview);
      setLoading(false);
      setDebugInfo('Using mock review');
      return;
    }
    
    console.log("ReviewComponent mounted with key:", cacheKey);
    
    return () => {
      console.log("ReviewComponent unmounted with key:", cacheKey);
    };
  }, [cacheKey, profileData]);
  
  // Main data fetching useEffect
  useEffect(() => {
    // Skip if this is mock data - we'll handle it in the other useEffect
    if (profileData?.is_mock_data) {
      return;
    }
    
    // Set mounted flag to true when component mounts
    isMountedRef.current = true;
    
    // Skip if no profile data
    if (!profileData) {
      setLoading(false);
      setError('No profile data available');
      setDebugInfo('No profile data available');
      return;
    }
    
    // Skip if already attempted in this component
    if (hasAttemptedRef.current) {
      setDebugInfo('Request already attempted in this instance');
      return;
    }
    
    // Mark as attempted so we don't try again
    hasAttemptedRef.current = true;
    
    // Check global cache first
    if (globalReviewCache.has(cacheKey)) {
      const cachedResult = globalReviewCache.get(cacheKey)!;
      setReview(cachedResult.review);
      setError(cachedResult.error);
      setLoading(false);
      setDebugInfo('Retrieved from cache');
      console.log("Review loaded from cache for key:", cacheKey);
      return;
    }
    
    setDebugInfo('Fetching from API...');
    console.log("Fetching review from API for key:", cacheKey);
    
    // Set up controller for this request
    controllerRef.current = new AbortController();
    const timeoutId = setTimeout(() => {
      if (controllerRef.current) {
        controllerRef.current.abort();
        console.log("Review request timed out for key:", cacheKey);
      }
    }, 15000); // Increased timeout to 15 seconds
    
    const fetchReview = async () => {
      try {
        // Only make the request if we're still mounted
        if (!isMountedRef.current) return;
        
        setLoading(true);
        
        // Clone the profile data to avoid any reference issues
        const profileDataClone = JSON.parse(JSON.stringify(profileData));
        
        const response = await api.post('/api/v1/reviews/get-relevant-review', 
          { profileData: profileDataClone },
          { 
            signal: controllerRef.current?.signal,
            timeout: 15000 
          }
        );
        
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          if (response.data && response.data.success && response.data.review) {
            console.log("Review fetched successfully for key:", cacheKey);
            const result = { review: response.data.review, error: null };
            setReview(result.review);
            setDebugInfo('Review loaded successfully');
            globalReviewCache.set(cacheKey, result);
          } else {
            console.log("No relevant review found for key:", cacheKey);
            const result = { review: null, error: 'No relevant review found' };
            setError(result.error);
            setDebugInfo('No relevant review found');
            globalReviewCache.set(cacheKey, result);
          }
        }
      } catch (err: any) {
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          let errorMessage = 'Failed to load a relevant review';
          
          if (err.name === 'AbortError') {
            errorMessage = 'Request timed out. Please try again later.';
          } else if (err.code === 'ECONNABORTED') {
            errorMessage = 'Connection timed out. Please check your internet connection.';
          } else if (err.response?.status === 500) {
            errorMessage = 'Server error. Our team has been notified.';
          }
          
          console.error("Error fetching review for key:", cacheKey, err);
          setError(errorMessage);
          setDebugInfo(`Error: ${errorMessage}`);
          
          // Cache the error result
          globalReviewCache.set(cacheKey, { 
            review: null, 
            error: errorMessage 
          });
        }
      } finally {
        // Clear timeout
        clearTimeout(timeoutId);
        
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    // Execute the fetch
    fetchReview();
    
    // Cleanup function to run when component unmounts or deps change
    return () => {
      // Mark component as unmounted
      isMountedRef.current = false;
      
      // Abort any in-flight requests
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      
      // Clear timeout
      clearTimeout(timeoutId);
    };
  }, [cacheKey, profileData]); // Added profileData back to dependencies to ensure updates

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-shrink-0 bg-gray-200 w-24 h-24 rounded-full"></div>
          <div className="flex-grow">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !review) {
    // Fallback message when no review is found or there's an error
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-center">
          <p className="text-gray-500">We couldn't find a relevant review for your profile at this time.</p>
          <p className="text-gray-700 mt-2">Please check back later or contact support.</p>
        </div>
      </div>
    );
  }

  // Generate initials for avatar if we don't have an image
  const names = review.reviewer_name.split(' ');
  const initials = names.map(name => name.charAt(0)).join('');
  const backgroundColors = ['0D8ABC', '4C1D95', '065F46', '991B1B', '1E40AF'];
  // Generate a consistent color based on name
  const colorIndex = review.reviewer_name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % backgroundColors.length;
  const avatarBgColor = backgroundColors[colorIndex];

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex-shrink-0">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer_name)}&background=${avatarBgColor}&color=fff`}
            alt={review.reviewer_name} 
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-black">{review.reviewer_name}</h3>
            <span className="text-muted-foreground">{review.review_date}</span>
          </div>
          
          <div className="mb-4">
            <p className="text-muted-foreground">
              {review.student_type} • {review.course} • {review.format}
            </p>
            
            {review.verified === "Yes" && (
              <div className="flex items-center mt-1">
                <div className="rounded-full bg-emerald-100 p-1 mr-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-emerald-600 text-sm font-medium">Verified by GitHub</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black">Overall Experience</span>
                <div className="flex">
                  {renderStars(parseInt(review.overall_rating))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black">Instructors</span>
                <div className="flex">
                  {renderStars(parseInt(review.instructor_rating))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black">Curriculum</span>
                <div className="flex">
                  {renderStars(parseInt(review.curriculum_rating))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black">Job Assistance</span>
                <div className="flex">
                  {renderStars(parseInt(review.job_assistance_rating))}
                </div>
              </div>
            </div>
          </div>
          
          <h4 className="text-lg font-medium mb-4 text-black">{review.review_title}</h4>
          
          <div className="space-y-4 text-gray-700">
            {review.review_content.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewComponent; 