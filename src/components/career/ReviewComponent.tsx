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
};

interface ReviewComponentProps {
  profileData: ProfileData;
}

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

// Use a WeakMap to track which profile data has already been processed
// This persists between component mounts but garbage collects when objects are no longer referenced
const processedProfiles = new WeakMap();

const ReviewComponent = ({ profileData }: ReviewComponentProps) => {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use refs to keep stable references across re-renders
  const controllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const profileDataRef = useRef<ProfileData | null>(null);

  // Create a stable key for this profile data to identify it across renders
  const profileKey = useMemo(() => {
    const program = profileData?.program || profileData?.course_interest || '';
    const skills = profileData?.skills?.join(',') || '';
    return `${program}-${skills}`;
  }, [profileData]);
  
  useEffect(() => {
    // Store the current profile data
    profileDataRef.current = profileData;
    
    // Ensure we have profile data
    if (!profileData) {
      setLoading(false);
      setError('No profile data available');
      return;
    }
    
    // Set mounted flag to true when component mounts
    isMountedRef.current = true;
    
    // Check if we've already processed this exact profile data before
    if (processedProfiles.has(profileData)) {
      // We've already tried to fetch a review for this exact profile
      const cachedResult = processedProfiles.get(profileData);
      setReview(cachedResult.review);
      setError(cachedResult.error);
      setLoading(false);
      return;
    }
    
    // Set up controller for this request
    controllerRef.current = new AbortController();
    const timeoutId = setTimeout(() => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    }, 10000);
    
    const fetchReview = async () => {
      try {
        // Only make the request if we're still mounted
        if (!isMountedRef.current) return;
        
        setLoading(true);
        
        const response = await api.post('/api/v1/reviews/get-relevant-review', 
          { profileData },
          { 
            signal: controllerRef.current?.signal,
            timeout: 10000 
          }
        );
        
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          if (response.data && response.data.success && response.data.review) {
            setReview(response.data.review);
            // Cache successful results
            processedProfiles.set(profileData, { 
              review: response.data.review, 
              error: null 
            });
          } else {
            setError('No relevant review found');
            // Cache failed results too
            processedProfiles.set(profileData, { 
              review: null, 
              error: 'No relevant review found' 
            });
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
          
          setError(errorMessage);
          
          // Cache the error result
          processedProfiles.set(profileData, { 
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
  }, [profileKey]); // Only re-run if the profileKey changes

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