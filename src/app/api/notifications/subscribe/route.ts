import { NextRequest, NextResponse } from 'next/server';

// This would typically store subscriptions in a database
// For demo purposes, we'll use in-memory storage
const subscriptions = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription, timestamp } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    // Store subscription (in production, save to database)
    subscriptions.add(JSON.stringify(subscription));
    
    console.log('New push subscription:', {
      endpoint: subscription.endpoint,
      timestamp,
      total: subscriptions.size
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription saved successfully',
      subscriptionCount: subscriptions.size
    });

  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    subscriptionCount: subscriptions.size,
    message: 'Subscription service is running'
  });
}
