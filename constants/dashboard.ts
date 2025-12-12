import { Topic } from '@/services/types';

/**
 * Topics for book discovery
 * Each topic has an icon (Ionicons name), color, and description
 */
export const TOPICS: Topic[] = [
  {
    id: 'tech',
    name: 'Technology & AI',
    icon: 'hardware-chip-outline',
    color: '#3B82F6',
    description: 'Explore cutting-edge tech and artificial intelligence',
  },
  {
    id: 'science',
    name: 'Science & Nature',
    icon: 'flask-outline',
    color: '#10B981',
    description: 'Discover the wonders of science and natural world',
  },
  {
    id: 'history',
    name: 'History & Culture',
    icon: 'business-outline',
    color: '#F59E0B',
    description: 'Journey through time and diverse cultures',
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    icon: 'bulb-outline',
    color: '#8B5CF6',
    description: 'Dive into profound ideas and existential questions',
  },
  {
    id: 'business',
    name: 'Business & Finance',
    icon: 'briefcase-outline',
    color: '#64748B',
    description: 'Master the world of business and economics',
  },
  {
    id: 'fiction',
    name: 'Modern Fiction',
    icon: 'book-outline',
    color: '#EC4899',
    description: 'Immerse yourself in contemporary stories',
  },
];
