export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: string;
  readTime: string;
  keywords: string[];
  estimatedCpc: number;
  schemaMarkup: string; // JSON-LD string
  discussionPrompts: string[];
  faqs: { question: string; answer: string }[];
}

export interface CompetitorData {
  name: string;
  url: string;
  monthlyTraffic: string;
  seoStrength: "High" | "Medium" | "Low";
  nicheFocus: string;
  adMonetization: string;
  weakness: string;
  beatingStrategy: string;
}

export interface NicheKeyword {
  keyword: string;
  searchVolume: number;
  difficulty: number; // 0-100
  estimatedCpc: number; // USD
  searchIntent: "Informational" | "Transactional" | "Commercial";
  recommendedTitle: string;
  adSenseViability: "Excellent" | "High" | "Moderate";
  structuralOutline: string[];
}

export interface BookAnalysis {
  title: string;
  author: string;
  themes: { name: string; description: string; score: number }[];
  pacing: "Slow & Philosophical" | "Moderate & Narrative" | "Fast & Direct";
  characterComplexity: string;
  targetAudience: string;
  discussionStarters: string[];
}

export interface ReadingRouteStep {
  step: number;
  bookTitle: string;
  author: string;
  purpose: string;
  estimatedHours: number;
  criticalFocus: string;
}

export interface ReadingRoute {
  nicheTopic: string;
  targetAudience: string;
  estimatedTotalWeeks: number;
  steps: ReadingRouteStep[];
}
