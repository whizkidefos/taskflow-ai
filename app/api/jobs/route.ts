import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please add RAPIDAPI_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    // Using the JSearch API from RapidAPI
    const url = 'https://jsearch.p.rapidapi.com/search';
    const params = new URLSearchParams({
      query: 'high paying jobs',
      page: '1',
      num_pages: '1',
      date_posted: 'today'
    });

    const response = await fetch(`${url}?${params}`, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(errorData.message || 'Failed to fetch jobs');
    }

    const data = await response.json();
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format from jobs API');
    }

    return NextResponse.json(data.data);
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
