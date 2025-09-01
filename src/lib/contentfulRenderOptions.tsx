import React from 'react';
import { BLOCKS } from '@contentful/rich-text-types';

// Helper component to render embedded assets (image/video)
const renderAsset = (node: any) => {
  console.log('Rendering asset node:', node);

  const file = node.data.target?.fields?.file;
  if (!file || !file.url || !file.contentType) {
    console.warn('No valid file found in node:', node);
    return null;
  }

  const url = file.url.startsWith('//') ? `https:${file.url}` : file.url;
  const contentType = file.contentType;

  if (contentType.startsWith('image/')) {
    const title = node.data.target.fields.title || 'Image';
    return (
      <img
        src={url}
        alt={title}
        className="max-w-full rounded"
      />
    );
  }

  if (contentType.startsWith('video/')) {
    return (
      <video controls className="max-w-full rounded">
        <source src={url} type={contentType} />
        Your browser does not support the video tag.
      </video>
    );
  }

  return null;
};

export const renderOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => renderAsset(node),
  },
};