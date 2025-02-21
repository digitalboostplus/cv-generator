import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIModel, AI_MODELS } from './config';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Google Gemini client
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Initialize Anthropic client (you'll need to add the Anthropic package)
// const anthropic = new Anthropic({
//   apiKey: process.env.CLAUDE_API_KEY,
// });

// Initialize Grok client (once API is available)
// const grok = new GrokAI({
//   apiKey: process.env.GROK_API_KEY,
// });

export interface ProposalGenerationParams {
  jobDescription: string;
  tone?: 'professional' | 'friendly' | 'formal';
  keyPoints?: string[];
  maxLength?: number;
  model?: AIModel;
  userProfile?: {
    fullName?: string;
    title?: string;
    skills?: string;
    experience?: string;
    certifications?: string;
    portfolio?: string;
    linkedIn?: string;
    github?: string;
  };
}

export async function generateProposal(params: ProposalGenerationParams): Promise<string> {
  try {
    const {
      jobDescription,
      tone = 'professional',
      keyPoints = [],
      maxLength = 2000,
      model = 'openai',
      userProfile
    } = params;

    if (!jobDescription?.trim()) {
      throw new Error('Job description is required');
    }

    // Create a profile section for the prompt if user profile data exists
    const profileSection = userProfile ? `
Use the following freelancer profile information to personalize the proposal:
${userProfile.fullName ? `- Full Name: ${userProfile.fullName}` : ''}
${userProfile.title ? `- Professional Title: ${userProfile.title}` : ''}
${userProfile.skills ? `- Skills: ${userProfile.skills}` : ''}
${userProfile.experience ? `- Experience: ${userProfile.experience}` : ''}
${userProfile.certifications ? `- Certifications: ${userProfile.certifications}` : ''}
${userProfile.portfolio ? `- Portfolio: ${userProfile.portfolio}` : ''}
${userProfile.linkedIn ? `- LinkedIn: ${userProfile.linkedIn}` : ''}
${userProfile.github ? `- GitHub: ${userProfile.github}` : ''}

Instructions for using the profile data:
1. Skills Matching:
   - First analyze the job description to identify required skills and technologies
   - Compare these with the freelancer's skills
   - Prioritize mentioning skills that directly match job requirements
   - For each matched skill, provide a specific example from the experience section

2. Experience Relevance:
   - Focus on experience entries most relevant to this specific job
   - Highlight projects or work that used similar technologies or solved similar problems
   - Quantify achievements where possible (e.g., improved performance by X%, completed Y projects)

3. Credibility Building:
   - If certifications match the job's domain, mention them early in the proposal
   - Reference relevant portfolio projects that demonstrate required skills
   - If GitHub profile shows relevant repositories/contributions, mention specific examples
   - Use LinkedIn presence to reinforce professional experience

4. Customization Guidelines:
   - Adapt the professional title to align with the job requirements
   - Only mention portfolio/GitHub/LinkedIn if they contain relevant work
   - Focus on recent experience that matches the job's needs
   - If certain skills are missing, focus on transferable skills and learning ability

Remember to maintain a natural flow and avoid simply listing qualifications. Weave the profile information into a compelling narrative that shows why this freelancer is the ideal candidate for this specific job.
` : '';

    const systemPrompt = `You are a professional Upwork Cover Letter writer. Your task is to create a compelling, personalized proposal based on the provided job description.
${profileSection}
Structure the cover letter as follows:
1. Greeting: A short, polite hello addressing the client (if a name is given, use it; otherwise, use a generic greeting).
2. Introduction & Context: Briefly mention the job title or the main problem the client is looking to solve.
3. Relevant Skills & Experience: Connect your background directly to the job's requirements, mentioning tools, certifications, or relevant past projects. Use measurable results and metrics where possible.
4. Approach & Value: Explain how you plan to tackle their project or solve their problem. Demonstrate your process and why you're the best fit.
5. Soft Skills & Communication: Reassure the client you communicate clearly, meet deadlines, and are easy to work with.
6. Call to Action: Politely invite them to contact you to discuss next steps or set up a meeting.
7. Signature: End with "Best regards," followed by ${userProfile?.fullName ? `"${userProfile.fullName}"` : '"[Your Name]"'}

Guidelines:
- Write in a ${tone} tone that's engaging and results-focused
- Highlight why the freelancer is the perfect fit for the job
- Include relevant achievements or past results that match requirements
- Emphasize specific skills, tools, or certifications that address pain points
- Keep the length between 200-350 words for maximum impact
- Use bullet points sparingly and maintain primarily paragraph form
- End with a clear call to action and the specified signature format
- Format key points professionally
- Ensure all content is personalized to the job description

The proposal should demonstrate:
- Clear understanding of the client's needs
- Relevant expertise and experience
- Problem-solving approach
- Professional communication skills
- Enthusiasm for the project
- Value proposition`;

    const keyPointsStr = keyPoints.length > 0 
      ? `\nKey points to address:\n${keyPoints.map(point => `- ${point}`).join('\n')}`
      : '';

    console.log('Sending request to AI model:', model);
    
    try {
      switch (model) {
        case 'openai': {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: `Job Description:\n${jobDescription}${keyPointsStr}` }
            ],
            temperature: AI_MODELS.openai.temperatureRange.default,
            max_tokens: Math.floor(maxLength / 4),
          });

          const generatedContent = completion.choices[0].message.content;
          if (!generatedContent) {
            throw new Error('No content generated by AI model');
          }
          return generatedContent;
        }

        case 'gemini': {
          const model = gemini.getGenerativeModel({ model: 'gemini-pro' });
          const result = await model.generateContent([
            { text: systemPrompt },
            { text: `Job Description:\n${jobDescription}${keyPointsStr}` }
          ]);
          const response = result.response;
          const generatedContent = response.text();
          if (!generatedContent) {
            throw new Error('No content generated by Gemini model');
          }
          return generatedContent;
        }

        case 'claude':
        case 'grok':
          throw new Error(`${model} integration coming soon`);

        default:
          throw new Error(`Unsupported AI model: ${model}`);
      }
    } catch (error) {
      console.error(`Error with ${model} API:`, error);
      throw new Error(`Failed to generate content with ${model}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error in generateProposal:', error);
    throw error instanceof Error ? error : new Error('Unknown error in proposal generation');
  }
}

export async function generateMermaidDiagram(jobDescription: string, model: AIModel = 'openai'): Promise<string> {
  const systemPrompt = `Create a Mermaid.js flowchart diagram showing the application process or project workflow for this job. 
  Include key steps, decision points, and outcomes. Use proper Mermaid.js syntax.
  Start with "graph TB" for top-to-bottom flow.
  Use clear, concise labels.
  Include conditional paths where relevant.
  End with clear outcome states.`;

  try {
    switch (model) {
      case 'openai': {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: jobDescription }
          ],
          temperature: AI_MODELS.openai.temperatureRange.default,
        });
        const diagramContent = completion.choices[0].message.content || '';
        return `\`\`\`mermaid\n${diagramContent}\n\`\`\``;
      }

      case 'gemini': {
        const model = gemini.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent([
          { text: systemPrompt },
          { text: jobDescription }
        ]);
        const response = result.response;
        const diagramContent = response.text();
        return `\`\`\`mermaid\n${diagramContent}\n\`\`\``;
      }

      case 'claude':
      case 'grok':
        throw new Error(`${model} integration coming soon`);

      default:
        throw new Error(`Unsupported AI model: ${model}`);
    }
  } catch (error) {
    console.error(`Error generating diagram with ${model}:`, error);
    throw new Error('Failed to generate diagram');
  }
} 