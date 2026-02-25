// Template exports for easy importing
export { default as ClassicTemplate } from './ClassicTemplate';
export { default as ModernTemplate } from './ModernTemplate';
export { default as MinimalTemplate } from './MinimalTemplate';
export { default as DarkTemplate } from './DarkTemplate';

export const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Professional and traditional business card layout',
    colorScheme: 'blue',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with vibrant gradient background',
    colorScheme: 'purple-gradient',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and minimalist design with plenty of whitespace',
    colorScheme: 'neutral',
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Elegant dark mode design with gold accents',
    colorScheme: 'dark-gold',
  },
];
