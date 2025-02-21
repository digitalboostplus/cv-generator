import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateProposal, generateMermaidDiagram, ProposalGenerationParams } from '@/lib/ai/openai';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/lib/firebase/admin';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { AIModel } from '@/lib/ai/config';

export const runtime = 'nodejs'; // Force Node.js runtime

const generateRequestSchema = z.object({
  jobDescription: z.string().min(1).max(5000),
  tone: z.enum(['professional', 'friendly', 'formal']).optional(),
  keyPoints: z.array(z.string()).optional(),
  maxLength: z.number().min(100).max(5000).optional(),
  generateDiagram: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    console.log('Received generate request');

    // Initialize Firebase Admin if not already initialized
    initAdmin();

    // Verify Firebase ID token
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Authentication required - no auth header');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.slice(7); // Remove 'Bearer '
    
    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(token);
      console.log('Token verified for user:', decodedToken.uid);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
      console.log('Received request body:', body);
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    let validatedData;
    try {
      validatedData = generateRequestSchema.parse(body);
      console.log('Validated request data:', validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
        return NextResponse.json(
          { error: 'Invalid request data', details: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }

    // Get user's preferred model from profile
    let preferredModel: AIModel = 'openai'; // Default to OpenAI
    let userProfile: ProposalGenerationParams['userProfile'] = undefined;
    try {
      console.log('Fetching user profile...');
      const profileDoc = await getDoc(doc(db, 'profiles', decodedToken.uid));
      if (profileDoc.exists()) {
        const profile = profileDoc.data();
        console.log('Found user profile:', profile);
        preferredModel = profile.preferredModel || 'openai';
        
        // Process and validate profile data
        const processedProfile = {
          fullName: profile.fullName?.trim(),
          title: profile.title?.trim(),
          skills: profile.skills?.trim(),
          experience: profile.experience?.trim(),
          certifications: profile.certifications?.trim(),
          portfolio: profile.portfolio?.trim(),
          linkedIn: profile.linkedIn?.trim(),
          github: profile.github?.trim(),
        };

        // Validate URLs
        const isValidUrl = (url?: string) => {
          if (!url || url.trim() === '') return false;
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        };

        // Only include valid URLs and non-empty strings
        const validatedProfile = {
          ...processedProfile,
          portfolio: isValidUrl(processedProfile.portfolio) ? processedProfile.portfolio : undefined,
          linkedIn: isValidUrl(processedProfile.linkedIn) ? processedProfile.linkedIn : undefined,
          github: isValidUrl(processedProfile.github) ? processedProfile.github : undefined,
        };

        // Only set userProfile if we have meaningful data
        const hasContent = (str?: string) => str && str.trim().length > 0;
        if (
          hasContent(validatedProfile.skills) || 
          hasContent(validatedProfile.experience) || 
          hasContent(validatedProfile.title) ||
          hasContent(validatedProfile.certifications) ||
          validatedProfile.portfolio ||
          validatedProfile.linkedIn ||
          validatedProfile.github
        ) {
          userProfile = validatedProfile;
          console.log('Using validated profile:', userProfile);
        } else {
          console.log('No meaningful profile data found');
        }
      } else {
        console.log('No profile found for user');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Continue with default model if profile fetch fails
    }

    try {
      console.log('Generating proposal...');
      // Validate job description before proceeding
      if (!validatedData.jobDescription.trim()) {
        return NextResponse.json(
          { error: 'Job description cannot be empty' },
          { status: 400 }
        );
      }

      // Log the final parameters being sent to the generator
      const generationParams = {
        jobDescription: validatedData.jobDescription,
        tone: validatedData.tone,
        keyPoints: validatedData.keyPoints,
        maxLength: validatedData.maxLength,
        model: preferredModel,
        userProfile: userProfile ? {
          ...userProfile,
          hasSkills: Boolean(userProfile.skills),
          hasExperience: Boolean(userProfile.experience),
          hasTitle: Boolean(userProfile.title),
          hasCertifications: Boolean(userProfile.certifications),
        } : undefined,
      };
      console.log('Generation parameters:', generationParams);

      // Generate proposal with preferred model and user profile
      const proposal = await generateProposal(generationParams).catch(error => {
        console.error('Proposal generation error:', error);
        throw new Error(`Failed to generate proposal: ${error.message}`);
      });

      if (!proposal || typeof proposal !== 'string') {
        console.error('Invalid proposal generated:', proposal);
        throw new Error('Generated proposal is invalid');
      }

      // Generate diagram if requested
      let diagram = null;
      if (validatedData.generateDiagram) {
        console.log('Generating diagram...');
        try {
          diagram = await generateMermaidDiagram(validatedData.jobDescription, preferredModel);
        } catch (error) {
          console.error('Diagram generation error:', error);
          // Don't fail the whole request if diagram fails
        }
      }

      console.log('Generation completed successfully');
      return NextResponse.json({
        proposal,
        diagram,
        modelUsed: preferredModel,
        profileUsed: Boolean(userProfile),
      });
    } catch (error) {
      console.error('Error generating content:', error);
      return NextResponse.json(
        { 
          error: error instanceof Error ? error.message : 'Failed to generate content. Please try again.',
          details: error instanceof Error ? error.stack : undefined
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unhandled error in generate route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 