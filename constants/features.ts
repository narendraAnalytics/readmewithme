export interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
  gradientColors: [string, string];
}

export const FEATURES: Feature[] = [
  {
    id: 1,
    icon: '🌍',
    title: 'Multi-Language Support',
    description: 'Read in 5 languages - English, Telugu, Hindi, Tamil, Marathi',
    gradientColors: ['#667eea', '#764ba2'], // Blue to Purple
  },
  {
    id: 2,
    icon: '🤖',
    title: 'AI-Powered Reading Guides',
    description: 'Get comprehensive synopses, themes, and insights instantly',
    gradientColors: ['#8B5CF6', '#EC4899'], // Purple to Pink
  },
  {
    id: 3,
    icon: '📝',
    title: 'Interactive Quizzes',
    description: 'Test your understanding with AI-generated questions',
    gradientColors: ['#F97316', '#EF4444'], // Orange to Red
  },
  {
    id: 4,
    icon: '🔍',
    title: 'Smart Book Discovery',
    description: 'Find any book with AI-powered search and recommendations',
    gradientColors: ['#10B981', '#14B8A6'], // Green to Teal
  },
  {
    id: 5,
    icon: '💡',
    title: 'Instant Explanations',
    description: 'No waiting - get answers to your questions immediately',
    gradientColors: ['#6366F1', '#3B82F6'], // Indigo to Blue
  },
  {
    id: 6,
    icon: '📚',
    title: 'Topic-Based Exploration',
    description: 'Discover books across Tech, Science, Philosophy, and more',
    gradientColors: ['#EC4899', '#F43F5E'], // Pink to Rose
  },
  {
    id: 7,
    icon: '🔐',
    title: 'Clerk Auth',
    description: 'Secure, modern authentication with social login and profile management',
    gradientColors: ['#6366F1', '#A855F7'], // Indigo to Purple
  },
  {
    id: 8,
    icon: '⚡',
    title: 'Neon Database',
    description: 'Serverless Postgres for ultra-fast, scalable data storage and reliability',
    gradientColors: ['#00E599', '#0070F3'], // Neon Green to Blue
  },
];
