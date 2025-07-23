import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Auto-collection started at:', new Date().toISOString());
    
    // Call the database endpoint to save data
    const baseUrl = request.nextUrl.origin;
    const response = await fetch(`${baseUrl}/api/air-quality/database`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Database save failed: ${result.error}`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Auto-collection completed successfully',
      timestamp: new Date().toISOString(),
      result: result
    });
    
  } catch (error) {
    console.error('Auto-collection error:', error);
    return NextResponse.json({
      success: false,
      error: 'Auto-collection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
