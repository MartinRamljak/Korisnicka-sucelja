import { createClient as createDeliveryClient } from 'contentful'; // Delivery API for reading data
import { createClient as createManagementClient } from 'contentful-management'; // Management API for writing data
import { MovieCommentFields, DiscussionCommentFields, MovieRatingFields } from '../types/contentful'
import { BLOCKS, INLINES, MARKS, Node, Document as RichTextDocument } from '@contentful/rich-text-types';

// Fetch the space and access token from environment variables
const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN as string; // Delivery API token
const managementAccessToken = process.env.NEXT_PUBLIC_CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string; // Management API token (server-side)

// Check if required environment variables are set
if (!spaceId || !accessToken || !managementAccessToken) {
  throw new Error("Missing Contentful environment variables");
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

// Function to create a movie comment entry
export const createMovieComment = async (comment: MovieCommentFields) => {
  try {
    // Get the space and environment
    const space = await managementClient.getSpace(spaceId);
    const environment = await space.getEnvironment('master');

    // Create a new entry for the "movieComments" content type
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
    console.log('Movie comment entry created:', entry);
    return entry;
  } catch (error) {
    console.error('Error creating movie comment entry:', error);
    throw error;
  }
};

// Function to create a discussion comment entry
export const createDiscussionComment = async (comment: DiscussionCommentFields) => {
  try {
    // Get the space and environment
    const space = await managementClient.getSpace(spaceId);
    const environment = await space.getEnvironment('master'); 

    // Create a new entry for the "discussionComments" content type
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
    console.log('Discussion comment entry created:', entry);
    return entry;
  } catch (error) {
    console.error('Error creating discussion comment entry:', error);
    throw error;
  }
};

export const generateUniqueCommentId = async (contentType: string, parentId: number): Promise<number | null> => {

  const newestId = await returnNewestCommentId(contentType, parentId)

  if(newestId)
    return newestId + 1

  return null
};

const returnNewestCommentId = async (contentType: string, parentId: number): Promise<number | null> => {
  try {
    if(contentType == 'movieComments')
    {
      const query = {
        content_type: 'movieComments',
        movieId: parentId,
        order: '-fields.commentId',
        limit: 1,
      }
      const response = await contentfulClient.getEntries(query);
      const entry = response.items[0];
      return entry?.fields.commentId as number ?? null;
    }
    else if(contentType == 'discussionComments')
    {
      const query = {
        content_type: 'discussionComments',
        discussionId: parentId,
        order: '-fields.commentId',
        limit: 1,
      }
      const response = await contentfulClient.getEntries(query);
      const entry = response.items[0];
      return entry?.fields.commentId as number ?? null;
    }
    return null;
  } catch (error) {
    console.error('Error checking comment ID:', error);
    return null;
  }
};

// Fetch existing rating for a movie by a user
export const getMovieRating = async (movieId: number, userId: string | null): Promise<number | null> => {
  if (!userId) return null; // <-- handle case when user is not logged in
  console.log(userId);

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

    // User has not rated this movie yet
    return null;
  } catch (error) {
    console.error('Error fetching movie rating:', error);
    return null;
  }
};


// Create or update a movie rating
export const upsertMovieRating = async (rating: MovieRatingFields) => {
  try {
    const { movieId, userId, rating: value } = rating;

    // Use Delivery API to check if rating exists
    const existing = await contentfulClient.getEntries({
      content_type: "movieRatings",
      "fields.movieId": movieId,
      "fields.userId": userId,
      limit: 1,
    });

    // Get environment with Management API
    const space = await managementClient.getSpace(spaceId);
    const environment = await space.getEnvironment("master");

    if (existing.items.length > 0) {
      // Update existing entry
      const entryId = existing.items[0].sys.id;
      const entry = await environment.getEntry(entryId);

      entry.fields.rating = { "en-US": value };

      const updated = await entry.update();
      await updated.publish();

      
    } else {
      // Create new entry
      const entry = await environment.createEntry("movieRatings", {
        fields: {
          movieId: { "en-US": movieId },
          userId: { "en-US": userId },
          rating: { "en-US": value },
        },
      });

      await entry.publish();
    }
  } catch (error) {
    console.error("Error upserting movie rating:", error);
    throw error;
  }
};

export function richTextToPlainText(node: Node | RichTextDocument): string {
  if ('content' in node && Array.isArray(node.content)) {
    return node.content.map(richTextToPlainText).join('');
  }

  if ('value' in node && typeof node.value === 'string') {
    return node.value;
  }

  return '';
}