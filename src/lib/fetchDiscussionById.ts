import { contentfulClient } from '../lib/contentful';
import { DiscussionSkeleton } from '../types/contentful';
import { Entry } from 'contentful';

export async function fetchDiscussionById(id: number): Promise<Entry<DiscussionSkeleton> | null> {
  const query: Record<string, string | number> = {
    content_type: 'discussion',
    limit: 1,
    'fields.discussionId': id,
  };

  const response = await contentfulClient.getEntries<DiscussionSkeleton>(query);
  return response.items[0] ?? null;
}
