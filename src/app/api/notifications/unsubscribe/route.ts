import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { timestamp } = body;

    // In production, you would remove the subscription from your database
    console.log('User unsubscribed from notifications:', { timestamp });

    return NextResponse.json({
      success: true,
      message: 'Unsubscribed successfully'
    });

  } catch (error) {
    console.error('Error processing unsubscription:', error);
    return NextResponse.json(
      { error: 'Failed to process unsubscription' },
      { status: 500 }
    );
  }
}
