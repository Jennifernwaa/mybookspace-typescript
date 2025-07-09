import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // In a real application, if you are using HTTP-only cookies for JWTs,
    // you would clear that cookie here.
    // Example:
    const response = NextResponse.json({ message: 'Logout successful' });
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0, // Expire the cookie immediately
      path: '/',
    });

    // If you are storing userId in localStorage on the client,
    // the client-side `handleLogout` function already clears it.
    // This API route primarily handles clearing server-set cookies.

    return response;
  } catch (error: any) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error during logout', details: error.message },
      { status: 500 }
    );
  }
}

// You might also consider a DELETE method for logout, depending on REST conventions
// export async function DELETE(request: NextRequest) {
//   // ... same logic as POST ...
// }
