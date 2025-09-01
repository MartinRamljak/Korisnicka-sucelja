import { contentfulClient } from './contentful';
import { DiscussionSkeleton, DiscussionFields } from '../types/contentful';

export const fetchAllDiscussions = async (): Promise<DiscussionFields[]> => {
  const response = await contentfulClient.getEntries<DiscussionSkeleton>({
    content_type: 'discussion',
    order: ['-sys.createdAt'],
  });

  return response.items.map(item => item.fields);
};