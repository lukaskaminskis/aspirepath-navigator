import axios from 'axios';
import { CareerAnalysisData } from '@/types/career';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Request tracking to prevent duplicate calls
const pendingRequests: Record<string, Promise<any>> = {};

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  // Remove default Content-Type as it will be set per request
  // Set a longer timeout for the API calls (increased from 30s to 2 minutes)
  timeout: 120000,
  // Enable credentials for CORS
  withCredentials: false
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Error Response:', error.response);
      console.error('Error Status:', error.response.status);
      console.error('Error Headers:', error.response.headers);
    }
    return Promise.reject(error);
  }
);

/**
 * Make an API request, ensuring that only one request to the same endpoint is in progress at a time
 * @param config Axios request config
 * @param requestId Unique identifier for the request (defaults to URL)
 * @returns Promise with the API response
 */
const makeRequest = async (config: any, requestId?: string) => {
  // Use URL as the default request ID if none provided
  const id = requestId || config.url;
  
  // If there's already a pending request to this endpoint, return that promise instead
  if (pendingRequests[id]) {
    console.log(`Request to ${id} already in progress, reusing existing request`);
    return pendingRequests[id];
  }
  
  // Create a new request and store the promise
  console.log(`Starting new request to ${id}`);
  const requestPromise = api(config)
    .finally(() => {
      // Remove from pending requests when done
      console.log(`Request to ${id} completed, removing from pending requests`);
      delete pendingRequests[id];
    });
    
  pendingRequests[id] = requestPromise;
  return requestPromise;
};

// Career analysis service
const careerAnalysisService = {
  /**
   * Check if the vector store exists
   */
  checkVectorStore: async (): Promise<boolean> => {
    try {
      const response = await makeRequest({
        method: 'GET',
        url: '/api/v1/vectorstore/check-vectorstore',
      }, 'check-vectorstore');
      
      return response.data.exists;
    } catch (error) {
      console.error('Error checking vector store:', error);
      throw new Error('Could not verify vector store status. Please ensure the backend is running.');
    }
  },

  /**
   * Analyze career using LinkedIn profile and/or resume
   * @param formData - FormData containing LinkedIn profile and/or resume file
   */
  analyzeCareer: async (formData: FormData): Promise<CareerAnalysisData> => {
    try {
      console.log('Sending data to /api/v1/career/analyze with fields:', 
                  Object.fromEntries(formData.entries()));
      
      // Create headers without Content-Type for FormData
      // Let the browser set the Content-Type and boundary
      const response = await makeRequest({
        method: 'POST',
        url: '/api/v1/career/analyze',
        data: formData,
        headers: {
          Accept: 'application/json',
        }
      }, 'analyze-career');
      
      console.log('Received response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error analyzing career:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  },
  
  /**
   * Analyze career using Typeform response data
   * @param responseId - Typeform response ID to analyze
   */
  analyzeTypeformResponse: async (responseId: string, retryCount = 0): Promise<{success: boolean, response_id: string, analysis: CareerAnalysisData}> => {
    if (retryCount > 5) {
      console.error('Max retry attempts reached for typeform analysis');
      throw new Error('Maximum retry attempts reached for analyzing Typeform response');
    }
    
    try {
      // Add exponential backoff to avoid overwhelming the server
      if (retryCount > 0) {
        const backoffTime = Math.min(Math.pow(2, retryCount) * 1000, 8000); // 2s, 4s, 8s max
        console.log(`Retry attempt ${retryCount}, waiting ${backoffTime}ms before retrying...`);
        await delay(backoffTime);
      }
      
      // Use the responseId as part of the request ID to deduplicate requests for the same form
      const requestId = `typeform-analyze-${responseId}`;
      
      const response = await makeRequest({
        method: 'POST',
        url: `/api/v1/typeform/analyze/${responseId}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      }, requestId);
      
      console.log('Received Typeform analysis response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error analyzing Typeform response:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      // Only retry on network errors or 500 errors
      if (axios.isAxiosError(error) && 
          (error.code === 'ERR_NETWORK' || (error.response && error.response.status >= 500))) {
        console.log(`Error analyzing Typeform response, retrying (${retryCount + 1}/5)...`);
        return careerAnalysisService.analyzeTypeformResponse(responseId, retryCount + 1);
      }
      
      throw error;
    }
  },
  
  /**
   * Set up the vector store with career documents
   * @param formData - FormData containing documents
   */
  setupVectorStore: async (formData: FormData): Promise<any> => {
    try {
      const response = await makeRequest({
        method: 'POST',
        url: '/api/v1/vectorstore/setup-vectorstore',
        data: formData,
        headers: {
          Accept: 'application/json',
        }
      }, 'setup-vectorstore');
      
      return response.data;
    } catch (error) {
      console.error('Error setting up vector store:', error);
      throw error;
    }
  },
};

// Define service type for TypeScript
export type CareerAnalysisServiceType = typeof careerAnalysisService;

// Contact form service
const contactService = {
  /**
   * Submit contact form data
   * @param formData - FormData containing contact form fields
   */
  submitContact: async (formData: FormData): Promise<{ message: string; submission_id: number }> => {
    try {
      const response = await makeRequest({
        method: 'POST',
        url: '/api/v1/contact/submit',
        data: formData,
        headers: {
          Accept: 'application/json',
        }
      }, 'submit-contact');
      
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },
};

// Reviews service
const reviewsService = {
  /**
   * Get a relevant review based on profile data
   * @param profileData - User profile data extracted from CV
   */
  getRelevantReview: async (profileData: any): Promise<any> => {
    try {
      // Create a unique ID based on a hash of the profileData
      const requestId = `get-review-${JSON.stringify(profileData).length}`;
      
      const response = await makeRequest({
        method: 'POST',
        url: '/api/v1/reviews/get-relevant-review',
        data: { profileData },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      }, requestId);
      
      return response.data;
    } catch (error) {
      console.error('Error getting relevant review:', error);
      throw error;
    }
  },
};

// Helper function for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export { careerAnalysisService, contactService, reviewsService };

export default api; 