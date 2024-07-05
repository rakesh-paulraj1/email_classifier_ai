import { NextResponse } from 'next/server';
import getServerSession from 'next-auth/middleware';
import { NEXT_AUTH } from '../../../lib/auth';


export async function GET(request: Request) {
  const auth = await getServerSession(NEXT_AUTH);
  if (!auth) {
    return new NextResponse(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }
  
  // Rest of the code...
}

// Store the access token in your session
auth.user.accessToken = token.access_token;