import axios from 'axios';
import { CareerAnalysisData } from '@/types/career';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Set a longer timeout for the API calls
  timeout: 30000,
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
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
      
      const response = await api({
        method: 'POST',
        url: '/api/v1/career/analyze',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
   * Set up the vector store with career documents
   * @param formData - FormData containing documents
   */
  setupVectorStore: async (formData: FormData): Promise<any> => {
    try {
      const response = await api({
        method: 'POST',
        url: '/api/v1/vectorstore/setup-vectorstore',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error setting up vector store:', error);
      throw error;
    }
  },
};

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
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },
};

export { careerAnalysisService, contactService };

export default api; 