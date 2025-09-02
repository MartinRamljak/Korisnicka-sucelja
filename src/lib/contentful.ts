import { createClient as createDeliveryClient } from 'contentful'; // Delivery API for reading data
import { createClient as createManagementClient } from 'contentful-management'; // Management API for writing data
import {
  MovieCommentFields,
  MovieCommentSkeleton,
  DiscussionCommentFields,
  DiscussionCommentSkeleton,
  DiscussionFields,
  DiscussionSkeleton,
  MovieRatingFields,
} from '../types/contentful';
import { Node, Document as RichTextDocument } from '@contentful/rich-text-types';

// Fetch the space and access token from environment variables
const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN as string;
const managementAccessToken = process.env.NEXT_PUBLIC_CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string; // Management API token (server-side)

// Check if required environment variables are set
if (!spaceId || !accessToken || !managementAccessToken) {
  throw new Error('Missing Contentful environment variables');
}

// Create Contentful Delivery API client (for fetching data)
export const contentfulClient = createDeliveryClient({
  space: spaceId,
  accessToken: accessToken,
});

// Create Contentful Management API client (for creating/updating entries)
export const managementClient = createManagementClient({
  accessToken: managementAccessToken, // Use the Management API token here
});

export const createMovieComment = async (comment: MovieCommentFields) => {
  try {
    const space = await managementClient.getSpace(spaceId);
    const environment = await space.getEnvironment('master');
    const entry = await environment.createEntry('movieComments', {
      fields: {
        movieId: { 'en-US': comment.movieId },
        commentId: { 'en-US': comment.commentId },
        commentText: { 'en-US': comment.commentText },
        posterUsername: { 'en-US': comment.posterUsername },
        posterId: { 'en-US': comment.posterId },
      },
    });
    await entry.publish();
    return entry;
  } catch (error) {
    console.error('Error creating movie comment entry:', error);
    throw error;
  }
};

export const createDiscussionComment = async (comment: DiscussionCommentFields) => {
  try {
    const space = await managementClient.getSpace(spaceId);
    const environment = await space.getEnvironment('master');
    const entry = await environment.createEntry('discussionComments', {
      fields: {
        discussionId: { 'en-US': comment.discussionId },
        commentId: { 'en-US': comment.commentId },
        commentText: { 'en-US': comment.commentText },
        posterUsername: { 'en-US': comment.posterUsername },
        posterId: { 'en-US': comment.posterId },
      },
    });
    await entry.publish();
    return entry;
  } catch (error) {
    console.error('Error creating discussion comment entry:', error);
    throw error;
  }
};

export const generateUniqueCommentId = async (
  contentType: string,
  parentId: number
): Promise<number | null> => {
  const newestId = await returnNewestCommentId(contentType, parentId);
  if (newestId !== null) return newestId + 1;
  return null;
};

const returnNewestCommentId = async (
  contentType: string,
  parentId: number
): Promise<number | null> => {
  try {
    let query: Record<string, unknown>;
    let response;

    if (contentType === 'movieComments') {
      query = {
        content_type: 'movieComments',
        'fields.movieId': parentId,
        order: ['-fields.commentId'],
        limit: 1,
      };
      response = await contentfulClient.getEntries<MovieCommentSkeleton>(query);
    } else if (contentType === 'discussionComments') {
      query = {
        content_type: 'discussionComments',
        'fields.discussionId': parentId,
        order: ['-fields.commentId'],
        limit: 1,
      };
      response = await contentfulClient.getEntries<DiscussionCommentSkeleton>(query);
    } else {
      return null;
    }

    const entry = response.items?.[0];
    const commentId = entry?.fields?.commentId;

    return typeof commentId === 'number' ? commentId : null;
  } catch (error) {
    console.error('Error checking comment ID:', error);
    return null;
  }
};

export const getMovieRating = async (
  movieId: number,
  userId: string | null
): Promise<number | null> => {
  if (!userId) return null; // <-- handle case when user is not logged in
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'movieRatings',
      'fields.movieId': movieId,
      'fields.userId': userId,
      limit: 1,
    });
    if (response.items.length > 0) {
      const rating = response.items[0].fields.rating;
      return rating as number;
    }
    return null;
  } catch (error) {
    console.error('Error fetching movie rating:', error);
    return null;
  }
};

export const upsertMovieRating = async (rating: MovieRatingFields) => {
  try {
    const { movieId, userId, rating: value } = rating;
    // Use Delivery API to check if rating exists
    const existing = await contentfulClient.getEntries({
      content_type: 'movieRatings',
      'fields.movieId': movieId,
      'fields.userId': userId,
      limit: 1,
    });
    // Get environment with Management API
    const space = await managementClient.getSpace(spaceId);
    const environment = await space.getEnvironment('master');

    if (existing.items.length > 0) {
      const entryId = existing.items[0].sys.id;
      const entry = await environment.getEntry(entryId);
      entry.fields.rating = { 'en-US': value };
      const updated = await entry.update();
      await updated.publish();
    } else {
      // Create new entry
      const entry = await environment.createEntry('movieRatings', {
        fields: {
          movieId: { 'en-US': movieId },
          userId: { 'en-US': userId },
          rating: { 'en-US': value },
        },
      });
      await entry.publish();
    }
  } catch (error) {
    console.error('Error upserting movie rating:', error);
    throw error;
  }
};

export function richTextToPlainText(node: Node | RichTextDocument | null | undefined): string {
  if (!node || typeof node !== 'object') {
    return '';
  }

  // If the node has a 'value', return it first
  if ('value' in node && typeof node.value === 'string') {
    return node.value;
  }

  // If it has 'content', recursively handle children
  if ('content' in node && Array.isArray(node.content)) {
    return node.content.map(richTextToPlainText).join('');
  }

  return '';
}

export const createDiscussion = async (fields: DiscussionFields) => {
  const space = await managementClient.getSpace(spaceId);
  const environment = await space.getEnvironment('master');

  const entry = await environment.createEntry('discussion', {
    fields: {
      discussionId: { 'en-US': fields.discussionId },
      title: { 'en-US': fields.title },
      post: { 'en-US': fields.post },
      posterUsername: { 'en-US': fields.posterUsername },
    },
  });
  await entry.publish();
  return entry;
};

export const generateUniqueDiscussionId = async (): Promise<number> => {
  try {
    const response = await contentfulClient.getEntries<DiscussionSkeleton>({
      content_type: 'discussion',
      order: ['-sys.createdAt'], // Most recent discussion
      limit: 1,
    });
    const latestId = response.items[0]?.fields?.discussionId;
    return typeof latestId === 'number' ? latestId + 1 : 1;
  } catch (err) {
    console.error('Error generating unique discussion ID:', err);
    return 1;
  }
};

export const uploadImageAsset = async (file: File): Promise<string> => {
  try {
    const space = await managementClient.getSpace(spaceId);
    const environment = await space.getEnvironment('master');

    const upload = await environment.createUpload({
      file: await file.arrayBuffer(),
    });

    const asset = await environment.createAsset({
      fields: {
        title: { 'en-US': file.name },
        description: { 'en-US': 'Uploaded by user' },
        file: {
          'en-US': {
            contentType: file.type,
            fileName: file.name,
            uploadFrom: {
              sys: {
                type: 'Link',
                linkType: 'Upload',
                id: upload.sys.id,
              },
            },
          },
        },
      },
    });

    await asset.processForAllLocales();

    let processedAsset = await environment.getAsset(asset.sys.id);
    while (!processedAsset.fields.file?.['en-US']?.url) {
      await new Promise((res) => setTimeout(res, 1000));
      processedAsset = await environment.getAsset(asset.sys.id);
    }

    const publishedAsset = await processedAsset.publish();

    return publishedAsset.sys.id;
  } catch (error) {
    console.error('Error uploading asset:', error);
    throw error;
  }
};
