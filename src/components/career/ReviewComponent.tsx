import { useState, useEffect } from 'react';
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

// Generate fewer stars to reduce DOM elements
const renderStars = (count: number) => {
  // Limit to maximum 5 stars
  const stars = [];
  const validCount = Math.min(Math.max(0, count), 5);
  
  for (let i = 0; i < validCount; i++) {
    stars.push(
      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    );
  }
  return stars;
};

// Simplified loading skeleton with fewer elements
const LoadingSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md p-8">
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 bg-gray-200 w-16 h-16 rounded-full"></div>
      <div className="w-full">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

// Simple error/empty state component
const ErrorState = () => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <div className="text-center">
      <p className="text-gray-500">We couldn't find a relevant review for your profile.</p>
    </div>
  </div>
);

const ReviewComponent = ({ profileData }: ReviewComponentProps) => {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [requestAttempted, setRequestAttempted] = useState<boolean>(false);

  useEffect(() => {
    // Skip review fetching if no profile data or already attempted
    if (!profileData || requestAttempted) {
      return;
    }

    // Track if component is mounted
    let isMounted = true;
    let controller: AbortController | null = null;
    
    const fetchReview = async () => {
      try {
        setLoading(true);
        setRequestAttempted(true);
        
        // Create abort controller for this request
        controller = new AbortController();
        const timeoutId = setTimeout(() => controller?.abort(), 8000);
        
        const response = await api.post('/api/v1/reviews/get-relevant-review', 
          { profileData },
          { signal: controller.signal, timeout: 8000 }
        );
        
        clearTimeout(timeoutId);
        
        if (isMounted && response.data?.success && response.data?.review) {
          setReview(response.data.review);
        } else {
          setError('No review available');
        }
      } catch (err) {
        if (isMounted) {
          console.error('Review fetch error - will not retry');
          setError('Failed to load review');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    // Start fetch process
    fetchReview();
    
    // Cleanup function
    return () => {
      isMounted = false;
      controller?.abort();
    };
  }, [profileData, requestAttempted]);

  // Render loading state
  if (loading) return <LoadingSkeleton />;
  
  // Render error state
  if (error || !review) return <ErrorState />;

  // Simplified review renderer - less DOM elements
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          {/* Use colored div instead of avatar image API call */}
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl bg-blue-600"
            aria-label={`${review.reviewer_name}'s avatar`}
          >
            {review.reviewer_name.charAt(0)}
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex flex-col mb-2">
            <h3 className="text-lg font-semibold text-black">{review.reviewer_name}</h3>
            <span className="text-sm text-muted-foreground">{review.student_type}</span>
          </div>
          
          {/* Just show overall rating */}
          <div className="flex items-center mb-4">
            <span className="text-sm mr-2">Rating:</span>
            <div className="flex">
              {renderStars(parseInt(review.overall_rating.toString()))}
            </div>
          </div>
          
          <h4 className="text-base font-medium mb-2">{review.review_title || 'Student Review'}</h4>
          
          {/* Only show the first paragraph of content */}
          <p className="text-gray-700 line-clamp-4">
            {review.review_content.split('\n')[0]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewComponent; 