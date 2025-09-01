import { createClient as createDeliveryClient } from 'contentful'; // Delivery API for reading data
import { createClient as createManagementClient } from 'contentful-management'; // Management API for writing data
import { MovieCommentFields, DiscussionCommentFields } from '../types/contentful'

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
    const environment = await space.getEnvironment('master'); // Default environment is usually 'master'

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
    const environment = await space.getEnvironment('master'); // Default environment is usually 'master'

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