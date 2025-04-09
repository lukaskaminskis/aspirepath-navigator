import axios from 'axios';
import { CareerAnalysisData } from '@/types/career';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  // Remove default Content-Type as it will be set per request
  // Set a longer timeout for the API calls (increased from 30s to 2 minutes)
  timeout: 120000,
  // Enable credentials for CORS
  withCredentials: true
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

// Career analysis service
const careerAnalysisService = {
  /**
   * Check if the vector store exists
   */
  checkVectorStore: async (): Promise<boolean> => {
    try {
      const response = await api({
        method: 'GET',
        url: '/api/v1/vectorstore/check-vectorstore',
      });
      
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
      const response = await api({
        method: 'POST',
        url: '/api/v1/career/analyze',
        data: formData,
        withCredentials: true,
        headers: {
          Accept: 'application/json',
        }
      });
      
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
    try {
      console.log('Analyzing Typeform response with ID:', responseId);
      
      // Add additional logging to debug the URL
      const url = `/api/v1/typeform/analyze/${responseId}`;
      console.log('Making request to URL:', url);
      
      const response = await api({
        method: 'POST',
        url: url,
        withCredentials: true,
        // Set an even longer timeout for this specific operation (3 minutes)
        timeout: 180000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      });
      
      console.log('Received Typeform analysis response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error analyzing Typeform response:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      // Implement automatic retry logic for timeout errors
      if (error.code === 'ECONNABORTED' && retryCount < 2) {
        console.log(`Request timed out. Retrying (${retryCount + 1}/2)...`);
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
      const response = await api({
        method: 'POST',
        url: '/api/v1/vectorstore/setup-vectorstore',
        data: formData,
        withCredentials: true,
        headers: {
          Accept: 'application/json',
        }
      });
      
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
      const response = await api({
        method: 'POST',
        url: '/api/v1/contact/submit',
        data: formData,
        withCredentials: true,
        headers: {
          Accept: 'application/json',
        }
      });
      
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
      const response = await api({
        method: 'POST',
        url: '/api/v1/reviews/get-relevant-review',
        data: { profileData },
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting relevant review:', error);
      throw error;
    }
  },
};

export { careerAnalysisService, contactService, reviewsService };

export default api; 