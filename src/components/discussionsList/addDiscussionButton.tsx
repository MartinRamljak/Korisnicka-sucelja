'use client';

import { useState, useEffect } from 'react';
import styles from './discussionsList.module.css';
import { supabase, UserProfile } from '@/src/lib/supabase';
import { createDiscussion, generateUniqueDiscussionId, uploadImageAsset } from '@/src/lib/contentful';
import { DiscussionFields } from '@/src/types/contentful';
import {
  BLOCKS,
  TopLevelBlock,
  Document as RichTextDocument,
} from '@contentful/rich-text-types';

interface Props {
  onDiscussionAdded: (newDiscussion: DiscussionFields) => void;
}

const AddDiscussion: React.FC<Props> = ({ onDiscussionAdded }) => {
  const [posterId, setPosterId] = useState<string | null>(null);
  const [posterUsername, setPosterUsername] = useState<string | null>(null);
  const [currentIDs, setCurrentIDs] = useState<number[]>([])
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current user ID once on mount
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setPosterId(user?.id ?? null);
    })();
  }, []);

  // Fetch username and participated discussions when posterId changes
  useEffect(() => {
    if (posterId) {
      (async () => {
        const res = await fetch(`/api/getUserProfile?userId=${posterId}`);
        if (res.ok) {
          const data: UserProfile = await res.json();
          setPosterUsername(data.username);
          setCurrentIDs(data.participatedDiscussionsIDs);
        }
      })();
    }
  }, [posterId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!posterId || !posterUsername || !title || (!postText && !file)) {
      alert('Please fill all required fields.');
      return;
    }

    setIsSubmitting(true)

    let assetId: string | null = null;
    if (file) {
      assetId = await uploadImageAsset(file);
    }

    const discussionId = await generateUniqueDiscussionId();

    const contentNodes: TopLevelBlock[] = [];

    if (postText) {
      contentNodes.push({
        nodeType: BLOCKS.PARAGRAPH,
        content: [
          {
            nodeType: 'text',
            value: postText,
            marks: [],
            data: {},
          },
        ],
        data: {},
      });
    }

    if (assetId) {
      contentNodes.push({
        nodeType: BLOCKS.EMBEDDED_ASSET,
        content: [],
        data: {
          target: {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: assetId,
            },
          },
        },
      });
    }

    const newDiscussion: DiscussionFields = {
      discussionId,
      title,
      post: {
        nodeType: 'document',
        data: {},
        content: contentNodes,
      } as RichTextDocument,
      posterUsername,
    };

    await createDiscussion(newDiscussion);
    onDiscussionAdded(newDiscussion);

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

    setIsSubmitting(false);
    setIsOpen(false);
    setTitle('');
    setPostText('');
    setCharCount(0);
    setFile(null);
  };

  return (
    <div className={styles['add-discussion']}>
      <button
        className={styles['button-discussion']}
        onClick={() =>
          posterId ? setIsOpen(!isOpen) : alert('Login to post.')
        }
      >
        {isOpen ? 'Cancel' : 'Start a Discussion'}
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles['discussion-input']}
            disabled={isSubmitting}
          />
          <textarea
            placeholder="Content..."
            value={postText}
            onChange={(e) => {
              setPostText(e.target.value);
              setCharCount(e.target.value.length);
            }}
            maxLength={2048}
            rows={5}
            className={styles['discussion-input']}
            disabled={isSubmitting}
          />
          <small>{charCount}/2048</small>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) =>
              e.target.files && setFile(e.target.files[0])
            }
            className={styles['discussion-input']}
            disabled={isSubmitting}
          />

          {isSubmitting && (
            <p className={styles['submitting-text']}>Submitting discussion...</p>
          )}

          <button
            type="submit"
            className={styles['button-submit']}
            disabled={(!postText && (!file || charCount === 0)) || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Discussion'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddDiscussion;
