"use client";

import styles from "./comment.module.css";
import { useState, useEffect } from "react";
import { supabase, UserProfile } from "@/src/lib/supabase";
import { createMovieComment, createDiscussionComment, generateUniqueCommentId } from "../../lib/contentful"
import { MovieCommentFields, DiscussionCommentFields } from '../../types/contentful';

const AddComment: React.FC<{movieId: number | null, discussionId: number | null, onCommentAdded: (newComment: MovieCommentFields | DiscussionCommentFields) => void }> = ({movieId, discussionId, onCommentAdded}) => {
  const [posterId, setUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [commentText, setComment] = useState<string>('');
  const [charCount, setCharCount] = useState<number>(0);
  const [posterUsername, setUsername] = useState<string | null>(null);
  const [currentIDs, setCurrentIDs] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    loadUser();
  }, []);

  const toggleForm = () => {
    if (!posterId)
    {
      alert("You must be logged in to post comments.");
    }
    else
    {
      setIsOpen((prev) => !prev);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (value.length <= 2048) {
      setComment(value);
      setCharCount(value.length);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/getUserProfile?userId=${userId}`);
      if (!response.ok) throw new Error(response.statusText);

      const data: UserProfile = await response.json();
      setUsername(data.username);
      setCurrentIDs(data.participatedDiscussionsIDs)
    } catch (err) {
      console.error('Error fetching profile', err);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if(posterId)
        fetchUserProfile(posterId)

    if(!posterUsername)
        return

    setIsSubmitting(true)

    try {
      if(movieId)
      {
        const commentId = await generateUniqueCommentId('movieComments', movieId);
        const newMovieComment = {
            movieId: movieId,
            commentId: commentId as number,
            commentText: commentText,
            posterUsername: posterUsername,
            posterId: posterId || '',
        };

        await createMovieComment(newMovieComment);
        alert("Comment added successfully!");
        onCommentAdded(newMovieComment);
      }
      else if(discussionId)
      {
        const commentId = await generateUniqueCommentId('discussionComments', discussionId);
        const newDiscussionComment = {
            discussionId: discussionId,
            commentId: commentId as number,
            commentText: commentText,
            posterUsername: posterUsername,
            posterId: posterId || '',
        };

        await createDiscussionComment(newDiscussionComment);
        alert("Comment added successfully!");
        onCommentAdded(newDiscussionComment);

        const updatedIDs = [...currentIDs, discussionId];

        const { error: updateError } = await supabase
        .from('profiles')
        .update({ participatedDiscussionsIDs: updatedIDs })
        .eq('id', posterId);

        if (updateError) {
          console.error('Failed to update participatedDiscussionsIDs:', updateError);
        } else {
          console.log('Discussion ID added successfully');
        }
      }
    } catch (err) {
      console.error('Error fetching profile', err);
    }

    setIsSubmitting(false);
    setComment('');
    setCharCount(0);
    setIsOpen(false);
  };

  return (
    <div className={styles['add-comment']}>
      <button className={styles['button-comment']} onClick={toggleForm}>
        {isOpen ? 'Cancel' : 'Add a Comment'}
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
          <textarea
            value={commentText}
            onChange={handleChange}
            placeholder="Enter your comment..."
            maxLength={2048}
            rows={5}
            cols={50}
            className={styles['comment-input']}
            disabled={isSubmitting}
          />
          <div>
            <small>{charCount}/2048 characters</small>
          </div>

          {isSubmitting && (
            <p className={styles['submitting-text']}>Submitting comment...</p>
          )}

          <button
            type="submit"
            className={styles['button-submit']}
            disabled={charCount === 0 || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Comment'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddComment;