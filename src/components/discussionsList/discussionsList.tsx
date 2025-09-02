'use client';

import styles from './discussionsList.module.css';
import { useEffect, useState } from 'react';
import type { DiscussionFields, DiscussionSkeleton } from '@/src/types/contentful';
import { richTextToPlainText } from '@/src/lib/contentful';
import { contentfulClient } from '@/src/lib/contentful';
import AddDiscussion from './addDiscussionButton';
import Link from 'next/link';
import React from 'react';
import type { Document as RichTextDocument } from '@contentful/rich-text-types';

function isRichTextDocument(obj: unknown): obj is RichTextDocument {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'nodeType' in obj &&
    (obj as { nodeType?: unknown }).nodeType === 'document'
  );
}

function extractLocale<T>(value: Record<string, T> | T | undefined): T | undefined {
  if (value == null) return undefined;

  if (
    typeof value !== 'object' ||
    Array.isArray(value) ||
    isRichTextDocument(value)
  ) {
    return value as T;
  }

  return (value as Record<string, T>)['en-US'] ?? Object.values(value as Record<string, T>)[0];
}

const DiscussionsList: React.FC = () => {
  const [discussions, setDiscussions] = useState<DiscussionFields[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDiscussions = async () => {
    try {
      const response = await contentfulClient.getEntries<DiscussionSkeleton>({
        content_type: 'discussion',
        order: ['-sys.createdAt'],
        include: 2,
        limit: 50,
      });

      const mapped = response.items.map(item => {
        const f = item.fields;
        const discussionId = extractLocale<number>(f.discussionId);
        const title = extractLocale<string>(f.title);
        const post = extractLocale<RichTextDocument>(f.post);
        const posterUsername = extractLocale<string>(f.posterUsername);

        if (discussionId == null ||
            !title ||
            !post ||
            !posterUsername) {
          console.warn('Skipping incomplete entry:', {
            id: item.sys.id,
            discussionId,
            title,
            post,
            posterUsername,
          });
          return null;
        }

        return { discussionId, title, post, posterUsername };
      });

      setDiscussions(mapped.filter((d): d is DiscussionFields => d !== null));
    } catch (err) {
      console.error('Failed to fetch discussions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const handleNewDiscussion = (newDiscussion: DiscussionFields) => {
    setDiscussions(prev => [newDiscussion, ...prev]);
  };

  if (loading) return <p>Loading discussions...</p>;
  if (discussions.length === 0) return <p>No discussions yet. Be the first to start one!</p>;

  return (
    <div className={styles['discussions-container']}>
      <AddDiscussion onDiscussionAdded={handleNewDiscussion} />
      {discussions.map(d => {
        const plain = richTextToPlainText(d.post);
        const preview = plain.length > 200 ? plain.slice(0, 200) + '...' : plain;
        return (
          <Link key={d.discussionId} href={`/discussions/${d.discussionId}`} className={styles['discussion-link']}>
            <article className={styles['discussion']}>
              <h2 className="text-xl font-bold">{d.title}</h2>
              <p className="text-sm text-gray-600">~{d.posterUsername}</p>
              <p>{preview}</p>
            </article>
          </Link>
        );
      })}
    </div>
  );
};

export default DiscussionsList;
