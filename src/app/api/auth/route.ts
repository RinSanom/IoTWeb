import { NextRequest, NextResponse } from 'next/server';

// POST - Login/Register
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, action = 'login' } = body;

    console.log(`Attempting ${action} for user:`, email);

    // Forward authentication request to your auth server
    const authResponse = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API}/auth/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      return NextResponse.json({
        success: false,
        error: authData.message || `${action} failed`,
        details: authData.details || 'Authentication error'
      }, { status: authResponse.status });
    }

    return NextResponse.json({
      success: true,
      data: authData,
      message: `${action} successful`,
    });

  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({
      success: false,
      error: 'Authentication server error',
      details: error instanceof Error ? error.message : 'Connection failed'
    }, { status: 500 });
  }
}

// GET - Verify token or get user info
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization');
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No token provided'
      }, { status: 401 });
    }

    // Forward token verification to your auth server
    const authResponse = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Accept': 'application/json',
      },
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      return NextResponse.json({
        success: false,
        error: 'Token verification failed',
        details: authData.message || 'Invalid token'
      }, { status: authResponse.status });
    }

    return NextResponse.json({
      success: true,
      data: authData,
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Token verification error',
      details: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
}
