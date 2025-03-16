
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { MapPin, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  linkedinProfile: z.string().url('Please enter a valid LinkedIn URL'),
  country: z.string().min(1, 'Please select your country'),
  promotionalEmails: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface ContactFormProps {
  onSubmit: () => void;
}

const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linkedinProfile: '',
      country: '',
      promotionalEmails: false,
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the data to your backend
      console.log('Form submitted with data:', data);
      
      toast({
        title: "Profile submitted successfully",
        description: "Your career analysis is ready to view.",
      });
      
      // Call the onSubmit callback to show the analysis
      onSubmit();
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", 
    "Germany", "France", "Japan", "China", "India", "Brazil",
    "Mexico", "South Africa", "Nigeria", "Russia", "Sweden",
    "Italy", "Spain", "Netherlands", "Singapore", "New Zealand"
  ];

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6">Before We Begin</h2>
      <p className="text-muted-foreground mb-8">
        To provide you with a personalized career analysis, we need a few details about you.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="linkedinProfile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Profile URL</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="https://linkedin.com/in/yourprofile" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
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
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    Receive promotional emails
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    I agree to receive career tips, industry updates, and promotional materials.
                  </p>
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
