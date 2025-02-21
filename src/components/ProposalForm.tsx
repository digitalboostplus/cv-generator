import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoadingWindow } from './LoadingWindow';
import { Mermaid } from './Mermaid';
import { useAuth } from '@/lib/context/AuthContext';

const proposalFormSchema = z.object({
  jobDescription: z.string().min(1, 'Job description is required').max(5000, 'Job description is too long'),
  tone: z.enum(['professional', 'friendly', 'formal']).default('professional'),
  keyPoints: z.array(z.string()).optional(),
  maxLength: z.number().min(100).max(5000).default(2000),
  generateDiagram: z.boolean().default(true),
});

type ProposalFormData = z.infer<typeof proposalFormSchema>;

export function ProposalForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [proposal, setProposal] = useState<string | null>(null);
  const [diagram, setDiagram] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if dark mode is preferred
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkTheme(true);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      tone: 'professional',
      maxLength: 2000,
      generateDiagram: true,
    },
  });

  const onSubmit = async (data: ProposalFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setProposal(null);
      setDiagram(null);

      if (!user) {
        throw new Error('You must be logged in to generate proposals.');
      }

      // Get a fresh token
      const token = await user.getIdToken(true); // Force refresh
      localStorage.setItem('token', token);
      
      console.log('Submitting proposal request...', {
        ...data,
        jobDescriptionLength: data.jobDescription.length
      });

      // If token is valid, proceed with the proposal generation
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }).catch(error => {
        console.error('Fetch error:', error);
        throw new Error('Network error while sending request');
      });

      if (!response) {
        throw new Error('No response received from server');
      }

      console.log('Response status:', response.status);
      let responseData;
      try {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } catch (error) {
        console.error('Error parsing response:', error);
        throw new Error('Failed to parse server response');
      }

      if (!response.ok) {
        throw new Error(responseData.error || `Request failed with status ${response.status}`);
      }

      if (!responseData.proposal) {
        throw new Error('No proposal was generated in the response');
      }

      setProposal(responseData.proposal);
      if (responseData.diagram) {
        setDiagram(responseData.diagram);
      }
    } catch (err) {
      console.error('Proposal generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while generating the proposal';
      setError(errorMessage);
      
      // Keep error visible
      setError(errorMessage);
      
      // If token is invalid, clear it and reload the page
      if (err instanceof Error && 
         (err.message.includes('token') || err.message.includes('Unauthorized'))) {
        localStorage.removeItem('token');
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            id="jobDescription"
            {...register('jobDescription')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={10}
            placeholder="Paste the Upwork job description here..."
          />
          {errors.jobDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.jobDescription.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
            Tone
          </label>
          <select
            id="tone"
            {...register('tone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
          </select>
        </div>

        <div>
          <label htmlFor="maxLength" className="block text-sm font-medium text-gray-700">
            Maximum Length
          </label>
          <input
            type="number"
            id="maxLength"
            {...register('maxLength', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="generateDiagram"
            {...register('generateDiagram')}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="generateDiagram" className="ml-2 block text-sm text-gray-900">
            Generate Process Diagram
          </label>
        </div>

        <div className="relative">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate Proposal'}
          </button>

          {/* Loading Animation */}
          {isLoading && (
            <div className="absolute left-0 right-0 top-full">
              <LoadingWindow isDarkTheme={isDarkTheme} />
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </form>

      {/* Results Section */}
      {(proposal || diagram) && (
        <div className="mt-8 space-y-8">
          {/* Proposal Section */}
          {proposal && (
            <div className={`rounded-lg overflow-hidden border ${
              isDarkTheme ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
              <div className={`px-4 py-3 border-b ${
                isDarkTheme ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
              }`}>
                <h2 className={`text-lg font-medium ${
                  isDarkTheme ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  Generated Proposal
                </h2>
              </div>
              <div className="p-4">
                <pre className={`whitespace-pre-wrap font-mono text-sm ${
                  isDarkTheme ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  {proposal}
                </pre>
                <button
                  onClick={() => navigator.clipboard.writeText(proposal)}
                  className={`mt-4 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                    isDarkTheme 
                      ? 'text-indigo-300 bg-indigo-900/30 hover:bg-indigo-900/50' 
                      : 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          )}

          {/* Diagram Section */}
          {diagram && (
            <div className={`rounded-lg overflow-hidden border ${
              isDarkTheme ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className={`px-4 py-3 border-b ${
                isDarkTheme ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
              }`}>
                <h2 className={`text-lg font-medium ${
                  isDarkTheme ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  Process Diagram
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                {/* Diagram Code */}
                <div className={`font-mono text-sm rounded-lg p-4 overflow-x-auto ${
                  isDarkTheme 
                    ? 'bg-gray-900 text-gray-300 border border-gray-700' 
                    : 'bg-gray-50 text-gray-800 border border-gray-200'
                }`}>
                  <pre className="whitespace-pre">{diagram}</pre>
                </div>
                
                {/* Diagram Visualization */}
                <div className={`rounded-lg overflow-hidden ${
                  isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                  <Mermaid chart={diagram} isDarkTheme={isDarkTheme} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 