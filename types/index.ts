export interface SearchParams {
  city: string;
  state: string;
  country: string;
  category: string;
  leadCount?: number;
}

export interface BusinessData {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  googleMapsUrl?: string;
  category: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  websiteStatus: 'none' | 'found';
  websiteQuality?: WebsiteQuality;
  score: number;
  opportunity: 'high' | 'medium' | 'low';
}

export interface WebsiteQuality {
  score: number;
  mobileResponsive: boolean;
  loadSpeed: 'fast' | 'medium' | 'slow';
  hasSSL: boolean;
  modernDesign: boolean;
  hasContactForm: boolean;
  hasSocialLinks: boolean;
  lastUpdated?: string;
  issues: string[];
}

export interface LeadReport {
  searchParams: SearchParams;
  timestamp: string;
  totalLeads: number;
  leads: BusinessData[];
  summary: {
    noWebsite: number;
    poorWebsite: number;
    highOpportunity: number;
    mediumOpportunity: number;
    lowOpportunity: number;
  };
}
