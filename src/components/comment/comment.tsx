'use client'

import styles from "./comment.module.css";
import { contentfulClient } from '../../lib/contentful';
import React, { useState, useEffect } from 'react';
import { MovieCommentSkeleton, MovieCommentFields, DiscussionCommentSkeleton, DiscussionCommentFields } from '../../types/contentful';
import AddComment from './addCommentButton';
import { supabase } from "@/src/lib/supabase";

const Comments: React.FC<{ movieId: number | null, discussionId: number | null }> = ({ movieId, discussionId }) => {
    const [movieComments, setMovieComments] = useState<MovieCommentFields[]>([]);
    const [discussionComments, setDiscussionComments] = useState<DiscussionCommentFields[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [posterId, setUserId] = useState<string | null>(null);

    // Fetch user data (this is always executed once)
    useEffect(() => {
        const loadUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUserId(user?.id ?? null);
        };
        loadUser();
    }, []); // This should only run once, so empty dependency array is correct

    // Fetch movie or discussion comments based on IDs (always runs)
    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true); // Start loading before fetching

            try {
                if (movieId !== null) {
                    // Fetch movie comments
                    const query: Record<string, unknown> = {
                        content_type: 'movieComments',
                        'fields.movieId': movieId,
                        limit: 100,
                    };

                    const response = await contentfulClient.getEntries<MovieCommentSkeleton>(query);
                    const fetchedComments = response.items.map(item => item.fields);

                    const sortedComments = fetchedComments.sort((a, b) => {
                        if (a.posterId === posterId && b.posterId !== posterId) {
                            return -1; // Move a to the top
                        } else if (b.posterId === posterId && a.posterId !== posterId) {
                            return 1; // Move b to the top
                        }
                        return 0; // Keep the rest in the same order
                    });
                    setMovieComments(sortedComments);
                } else if (discussionId !== null) {
                    // Fetch discussion comments
                    const query: Record<string, unknown> = {
                        content_type: 'discussionComments',
                        'fields.discussionId': discussionId,
                        limit: 100,
                    };

                    const response = await contentfulClient.getEntries<DiscussionCommentSkeleton>(query);
                    const fetchedComments = response.items.map(item => item.fields);

                    const sortedComments = fetchedComments.sort((a, b) => {
                        if (a.posterId === posterId && b.posterId !== posterId) {
                            return -1; // Move a to the top
                        } else if (b.posterId === posterId && a.posterId !== posterId) {
                            return 1; // Move b to the top
                        }
                        return 0; // Keep the rest in the same order
                    });
                    setDiscussionComments(sortedComments);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setLoading(false); // Stop loading after fetching
            }
        };

        fetchComments();
    }, [movieId, discussionId, posterId]); // Run whenever these dependencies change

    const handleNewComment = (newComment: MovieCommentFields | DiscussionCommentFields) => {
        if (movieId) {
            setMovieComments(prevComments => [newComment as MovieCommentFields, ...prevComments]);
        } else if (discussionId) {
            setDiscussionComments(prevComments => [newComment as DiscussionCommentFields, ...prevComments]);
        }
    };
    
    if (movieId === null && discussionId === null)
        return (<p>Couldn't load comments</p>)

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
            )}
        </div>
    );
};

export default Comments;