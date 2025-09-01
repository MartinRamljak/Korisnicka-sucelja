import { createClient } from 'contentful';
import { DiscussionSkeleton, DiscussionFields } from '../types/contentful';

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!,
});

export async function fetchDiscussionById(id: number): Promise<DiscussionFields | null> {
  const query: Record<string, unknown> = {
        content_type: 'discussion',
        limit: 1,
        'fields.discussionId': id,
    };

    const response = await client.getEntries<DiscussionSkeleton>(query);

  if (!response.items.length) return null;

  return response.items[0].fields;
}