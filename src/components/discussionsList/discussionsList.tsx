'use client'

import styles from "./discussionsList.module.css";
import React, { useEffect, useState } from 'react';
import { DiscussionFields } from '../../types/contentful';
import { richTextToPlainText } from '../../lib/contentful'
import { fetchAllDiscussions } from '../../lib/fetchAllDiscussions';
import Link from 'next/link';

const DiscussionsList: React.FC = () => {
  const [discussions, setDiscussions] = useState<DiscussionFields[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllDiscussions().then(data => {
      setDiscussions(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading discussions...</p>;

  return (
  <div className={styles['discussions-container']}>
    {discussions.map(({ title, post, posterUsername, discussionId }) => {
      const plainText = richTextToPlainText(post);
      const previewText = plainText.length > 200
        ? plainText.slice(0, 200) + '...'
        : plainText;

      return (
        <Link
          href={`/discussions/${discussionId}`}
          key={discussionId}
          className={styles['discussion-link']}
        >
          <article className={styles['discussion']}>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-gray-600">~{posterUsername}</p>
            <p>{previewText}</p>
          </article>
        </Link>
      );
    })}
  </div>
);
};

export default DiscussionsList;