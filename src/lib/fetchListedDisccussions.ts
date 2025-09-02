import { contentfulClient, extractLocale } from './contentful';
import { DiscussionSkeleton, DiscussionFields } from '../types/contentful';
import type { Document as RichTextDocument } from '@contentful/rich-text-types';

export const fetchDiscussionsByIds = async (
  discussionIds: number[]
): Promise<DiscussionFields[]> => {
  if (discussionIds.length === 0) return [];

  const query: Record<string, unknown> = {
    content_type: 'discussion',
    order: ['-sys.createdAt'],
    limit: discussionIds.length,
    'fields.discussionId[in]': discussionIds.join(','),
  };

  const response = await contentfulClient.getEntries<DiscussionSkeleton>(query);

  return response.items.map(item => {
    const f = item.fields;

    return {
      discussionId: extractLocale<number>(f.discussionId)!,
      title: extractLocale<string>(f.title)!,
      post: extractLocale<RichTextDocument>(f.post)!,
      posterUsername: extractLocale<string>(f.posterUsername)!,
    };
  });
};

export default fetchDiscussionsByIds;