import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('News service error');
    }

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message || 'News API error');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news data' },
      { status: 500 }
    );
  }
}
