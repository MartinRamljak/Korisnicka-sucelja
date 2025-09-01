'use client';

import styles from './discussionsList.module.css';
import { useEffect, useState } from 'react';
import { DiscussionFields } from '@/src/types/contentful';
import { richTextToPlainText } from '@/src/lib/contentful';
import { contentfulClient } from '@/src/lib/contentful';
import AddDiscussion from './addDiscussionButton';
import Link from 'next/link';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import React from 'react';

const renderOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { file, title } = node.data.target.fields;
      const url = file['en-US']?.url || file.url;
      const contentType = file['en-US']?.contentType || file.contentType;

      if (contentType?.startsWith('image/')) {
        return <img src={url} alt={title?.['en-US'] || 'Embedded asset'} style={{ maxWidth: '100%' }} />;
      }

      if (contentType?.startsWith('video/')) {
        return (
          <video controls style={{ maxWidth: '100%' }}>
            <source src={url} type={contentType} />
            Your browser does not support the video tag.
          </video>
        );
      }

      return <p>Unsupported asset type</p>;
    },

    [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => {
      const url = node.data.uri;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          {children}
        </a>
      );
    },
  },
};

const DiscussionsList: React.FC = () => {
  const [discussions, setDiscussions] = useState<DiscussionFields[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDiscussions = async () => {
    try {
      const response = await contentfulClient.getEntries({
        content_type: 'discussion',
        order: ['-sys.createdAt'],
        include: 2,
      });

      const items: DiscussionFields[] = response.items.map((item: any) => ({
        discussionId: item.fields.discussionId,
        title: item.fields.title,
        post: item.fields.post,
        posterUsername: item.fields.posterUsername,
      }));

      setDiscussions(items);
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
    setDiscussions((prev) => [newDiscussion, ...prev]);
  };

  if (loading) return <p>Loading discussions...</p>;
  if (discussions.length === 0) return <p>No discussions yet. Be the first to start one!</p>;

  return (
    <div className={styles['discussions-container']}>
      <AddDiscussion onDiscussionAdded={handleNewDiscussion} />
      {discussions.map((d) => {
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