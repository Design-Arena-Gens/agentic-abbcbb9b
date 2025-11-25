import { NextRequest, NextResponse } from 'next/server';
import { BusinessSearchEngine } from '@/lib/businessSearch';
import { SearchParams, LeadReport } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const searchParams: SearchParams = {
      city: body.city,
      state: body.state,
      country: body.country,
      category: body.category,
      leadCount: body.leadCount || 10,
    };

    // Validate input
    if (!searchParams.city || !searchParams.state || !searchParams.country || !searchParams.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize search engine
    const searchEngine = new BusinessSearchEngine();

    // Perform search
    const leads = await searchEngine.searchBusinesses(searchParams);

    // Generate report
    const report: LeadReport = {
      searchParams,
      timestamp: new Date().toISOString(),
      totalLeads: leads.length,
      leads,
      summary: {
        noWebsite: leads.filter(l => l.websiteStatus === 'none').length,
        poorWebsite: leads.filter(l => l.websiteQuality && l.websiteQuality.score < 50).length,
        highOpportunity: leads.filter(l => l.opportunity === 'high').length,
        mediumOpportunity: leads.filter(l => l.opportunity === 'medium').length,
        lowOpportunity: leads.filter(l => l.opportunity === 'low').length,
      },
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
