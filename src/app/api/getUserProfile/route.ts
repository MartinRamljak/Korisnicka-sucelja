import { NextRequest} from 'next/server';
import { db } from '../../../lib/drizzle';
import { eq } from 'drizzle-orm';
import { profiles } from '../../../db/schema';

export async function GET(req: NextRequest) {
  
  const urlString = req.url ?? '';
  const url = new URL(urlString, `http://${req.headers.host}`);
  
  const userId = url.searchParams.get('userId');

  if (!userId) {
    console.error('User ID is missing');
    return new Response(
      JSON.stringify({ error: 'User ID is required' }),
      { status: 400 }
    );
  }

  if (typeof userId !== 'string') {
    console.error('User ID is not a string');
    return new Response(
      JSON.stringify({ error: 'User ID must be a string' }),
      { status: 400 }
    );
  }

  try {
    const userProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId));

    if (userProfile.length === 0) {
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(userProfile[0]), { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Server error' }),
      { status: 500 }
    );
  }
}