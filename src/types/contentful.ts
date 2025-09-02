import { Document as RichTextDocument } from '@contentful/rich-text-types';
import type { EntrySkeletonType } from 'contentful';

export interface DiscussionFields {
  discussionId: number;
  post: RichTextDocument;
  posterUsername: string;
  title: string;
}

export interface DiscussionSkeleton extends EntrySkeletonType {
  fields: DiscussionFields;
  contentTypeId: 'discussion';
}

export interface DiscussionCommentFields {
  discussionId: number;
  commentId: number;
  commentText: string;
  posterUsername: string;
  posterId: string;
}

export interface DiscussionCommentSkeleton extends EntrySkeletonType {
  fields: DiscussionCommentFields;
  contentTypeId: 'discussionComments';
}

export interface MovieCommentFields {
  movieId: number;
  commentId: number;
  commentText: string;
  posterUsername: string;
  posterId: string;
}

export interface MovieCommentSkeleton extends EntrySkeletonType {
  fields: MovieCommentFields;
  contentTypeId: 'movieComments';
}

export interface MovieRatingFields {
  movieId: number;
  rating: number;
  userId: string;
}

export interface MovieRatingSkeleton extends EntrySkeletonType {
  fields: MovieRatingFields;
  contentTypeId: 'movieRatings';
}