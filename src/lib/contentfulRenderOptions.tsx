import React from 'react';
import { BLOCKS, Block } from '@contentful/rich-text-types';

type AssetFields = {
  file?: {
    url?: string;
    contentType?: string;
  };
  title?: string;
};

type EmbeddedAssetNode = Block & {
  data: {
    target: {
      fields?: AssetFields;
    };
  };
};

const renderAsset = (node: EmbeddedAssetNode): React.ReactNode => {
  const file = node.data.target?.fields?.file;
  const title = node.data.target?.fields?.title || 'Image';

  if (!file || !file.url || !file.contentType) {
    console.warn('Invalid asset:', node);
    return null;
  }

  const url = file.url.startsWith('//') ? `https:${file.url}` : file.url;
  const contentType = file.contentType;

  if (contentType.startsWith('image/')) {
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
    [BLOCKS.EMBEDDED_ASSET]: (node: unknown) => renderAsset(node as EmbeddedAssetNode),
  },
};