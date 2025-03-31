import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { MapPin, Linkedin, Mail, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useCareerAnalysis } from '@/contexts/CareerAnalysisContext';
import { careerAnalysisService } from '@/services/api';
import api from '@/services/api';
import { getName, getNames } from 'country-list';

const formSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  linkedInUrl: z.string().optional(),
  resumeFile: z
    .instanceof(File)
    .refine((file) => file.size <= 1024 * 1024, {
      message: "File size must be less than 1MB",
    })
    .optional(),
  country: z.string().min(1, 'Please select your country'),
  promotionalEmails: z.literal(true, {
    errorMap: () => ({ message: "You must agree to receive promotional emails" })
  }),
});

type FormData = z.infer<typeof formSchema>;

interface ContactFormProps {
  onSubmit: () => void;
}

const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setLoading, setError, setCareerData } = useCareerAnalysis();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      linkedInUrl: "",
      country: "",
      promotionalEmails: true,
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      // Validate: Check if either LinkedIn URL or resume is provided
      if (!data.linkedInUrl && !data.resumeFile) {
        throw new Error("Please provide either a LinkedIn profile URL or a resume file.");
      }
      
      // Create FormData object for contact form submission
      const contactFormData = new FormData();
      contactFormData.append('email', data.email);
      contactFormData.append('country', data.country);
      contactFormData.append('promotional_emails', data.promotionalEmails.toString());
      if (data.linkedInUrl) contactFormData.append('linkedin_url', data.linkedInUrl);
      if (data.resumeFile) contactFormData.append('resume_file', data.resumeFile);
      
      // Submit contact form data
      await api.post('/api/v1/contact/submit', contactFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Create FormData object for career analysis
      const analysisFormData = new FormData();
      if (data.linkedInUrl) analysisFormData.append('linkedin_profile', data.linkedInUrl);
      if (data.resumeFile) analysisFormData.append('resume_file', data.resumeFile);
      
      console.log('Sending form data to backend:', Object.fromEntries(analysisFormData.entries()));
      
      try {
        // First try with real data processing
        const result = await careerAnalysisService.analyzeCareer(analysisFormData);
        
        // Update context with response data
        setCareerData(result);
        
        toast({
          title: "Profile submitted successfully",
          description: "Your career analysis is ready to view.",
        });
        
        // Call the onSubmit callback to show the analysis
        onSubmit();
      } catch (apiError) {
        console.error('Error with real data processing:', apiError);
        
        // Create a new FormData object for mock data
        const mockFormData = new FormData();
        if (data.linkedInUrl) mockFormData.append('linkedin_profile', data.linkedInUrl);
        if (data.resumeFile) mockFormData.append('resume_file', data.resumeFile);
        mockFormData.append('use_mock', 'true');
        
        // Try again with mock data
        const mockResult = await careerAnalysisService.analyzeCareer(mockFormData);
        
        // Update context with mock data
        setCareerData(mockResult);
        
        toast({
          title: "Using simulated data",
          description: "We're showing example data because we couldn't process your profile. Try again later for personalized results.",
          variant: "destructive"
        });
        
        // Call the onSubmit callback to show the analysis with mock data
        onSubmit();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Set a more specific error message
      let errorMessage = 'An unexpected error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Special handling for backend connection issues
        if (errorMessage.includes('Network Error')) {
          errorMessage = 'Could not connect to the backend server. Please ensure it is running.';
        } else if (errorMessage.includes('Vector store not found')) {
          errorMessage = 'The vector store is not set up on the backend. Please contact support.';
        }
      }
      
      setError(errorMessage);
      
      toast({
        title: "Submission failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const countries = getNames().sort();

  return (
    <div className="max-w-xl mx-auto bg-card p-8 rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6">Before We Begin</h2>
      <p className="text-muted-foreground mb-8">
        To provide you with a personalized career analysis, we need a few details about you.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="youremail@example.com" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  We'll never share your email with anyone else.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="linkedInUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL (Optional)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="https://www.linkedin.com/in/username" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Include your LinkedIn profile for more accurate career insights.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="resumeFile"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Upload Resume (Optional)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Upload className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="file"
                      className="pl-10 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.size <= 1024 * 1024) {
                          onChange(file);
                        }
                      }}
                      {...fieldProps}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Upload your resume (PDF, DOC, DOCX - Max 1MB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country of Residence</FormLabel>
                <Select
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        {field.value ? (
                          <>
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Select your country" />
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Select your country</span>
                          </>
                        )}
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="promotionalEmails"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    required
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    Receive promotional emails <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    I agree to receive career tips, industry updates, and promotional materials.
                  </p>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Get Your Career Analysis"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
