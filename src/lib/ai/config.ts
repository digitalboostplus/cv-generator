export type AIModel = 'openai' | 'gemini' | 'claude' | 'grok';

export interface AIModelConfig {
  name: string;
  description: string;
  maxTokens: number;
  temperatureRange: {
    min: number;
    max: number;
    default: number;
  };
  requiresApiKey: boolean;
  apiKeyEnvVar?: string;
}

export const AI_MODELS: Record<AIModel, AIModelConfig> = {
  openai: {
    name: 'OpenAI GPT-4',
    description: 'Advanced language model with strong reasoning capabilities',
    maxTokens: 8192,
    temperatureRange: {
      min: 0,
      max: 2,
      default: 0.7,
    },
    requiresApiKey: true,
    apiKeyEnvVar: 'OPENAI_API_KEY',
  },
  gemini: {
    name: 'Google Gemini',
    description: 'Google\'s latest multimodal AI model',
    maxTokens: 32768,
    temperatureRange: {
      min: 0,
      max: 1,
      default: 0.7,
    },
    requiresApiKey: true,
    apiKeyEnvVar: 'GEMINI_API_KEY',
  },
  claude: {
    name: 'Anthropic Claude',
    description: 'Advanced AI with strong analysis capabilities',
    maxTokens: 100000,
    temperatureRange: {
      min: 0,
      max: 1,
      default: 0.7,
    },
    requiresApiKey: true,
    apiKeyEnvVar: 'CLAUDE_API_KEY',
  },
  grok: {
    name: 'xAI Grok',
    description: 'Real-time knowledge and witty responses',
    maxTokens: 8192,
    temperatureRange: {
      min: 0,
      max: 1,
      default: 0.7,
    },
    requiresApiKey: true,
    apiKeyEnvVar: 'GROK_API_KEY',
  },
}; 