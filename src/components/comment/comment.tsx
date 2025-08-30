'use client'

import styles from "./comment.module.css";
import { contentfulClient } from '../../lib/contentful';
import React, { useState, useEffect } from 'react';
import { MovieCommentSkeleton, MovieCommentFields, DiscussionCommentSkeleton, DiscussionCommentFields } from '../../types/contentful';
import AddComment from './addCommentButton';

const Comments: React.FC<{ movieId: number | null, discussionId: number | null }> = ({ movieId, discussionId }) => {
    const [movieComments, setMovieComments] = useState<MovieCommentFields[]>([]);
    const [discussionComments, setDiscussionComments] = useState<DiscussionCommentFields[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    if (movieId === null && discussionId === null)
        return (<p>Couldn't load comments</p>)

    useEffect(() => {
        if(movieId !== null)
        {
            const fetchMovieComments = async () => {
                const query: Record<string, unknown> = {
                    content_type: 'movieComments',
                    'fields.movieId': movieId,
                    limit: 100,
                };

                try {
                    const response = await contentfulClient.getEntries<MovieCommentSkeleton>(query);

                    const fetchedComments = response.items.map(item => item.fields);
                    setMovieComments(fetchedComments);
                } catch (error) {
                    console.error('Error fetching comments:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchMovieComments();
        }
        else if (discussionId !== null)
        {
            const fetchDiscussionComments = async () => {
                const query: Record<string, unknown> = {
                    content_type: 'discussionComments',
                    'fields.discussionId': discussionId,
                    limit: 100,
                };

                try {
                    const response = await contentfulClient.getEntries<DiscussionCommentSkeleton>(query);

                    const fetchedComments = response.items.map(item => item.fields);
                    setDiscussionComments(fetchedComments);
                } catch (error) {
                    console.error('Error fetching comments:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchDiscussionComments();
        }
    }, [movieId, discussionId]);

    const handleNewComment = (newComment: MovieCommentFields | DiscussionCommentFields) => {
        if (movieId) {
        setMovieComments(prevComments => [newComment as MovieCommentFields, ...prevComments]);
        } else if (discussionId) {
        setDiscussionComments(prevComments => [newComment as DiscussionCommentFields, ...prevComments]);
        }
    };

    if (loading) {
        return <div>Loading comments...</div>;
    }

    return (
        <div className={styles['comments-container']}>
            <AddComment movieId={movieId} discussionId={discussionId} onCommentAdded={handleNewComment}/>
            {movieId ? (
                    movieComments.map((comment) => (
                        <div key={comment.commentId} className={styles['comment']}>
                            <p>{comment.commentText}</p>
                            <p className={styles['username']}>~ {comment.posterUsername}</p>
                        </div>
                    ))
                ) : (
                    discussionComments.map((comment) => (
                        <div key={comment.commentId} className={styles['comment']}>
                            <p>{comment.commentText}</p>
                            <p className={styles['username']}>~ {comment.posterUsername}</p>
                        </div>
                    ))
                )
            }
        </div>
    );
};

export default Comments