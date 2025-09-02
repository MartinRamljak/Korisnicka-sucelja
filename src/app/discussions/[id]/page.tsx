import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { renderOptions } from '../../../lib/contentfulRenderOptions';
import { fetchDiscussionById } from '../../../lib/fetchDiscussionById';
import Comments from '../../../components/comment/comment';
import Header from '../../../components/header/header';
import Navigation from '../../../components/navigation/navigation';
import { Entry } from 'contentful';
import { DiscussionSkeleton } from '../../../types/contentful';
import { Document as RichTextDocument } from '@contentful/rich-text-types';

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const discussion = await fetchDiscussionById(Number(params.id));

  if (!discussion) {
    return {
      title: 'Discussion Not Found',
    };
  }

  const rawTitle = discussion.fields.title;
  const title = (rawTitle as unknown as string) || 'Untitled Discussion';

  const rawDesc = discussion.fields.posterUsername;
  const description = (rawDesc as unknown as string) || 'Unknown user';

  return {
    title,
    description,
  };
}

export default async function DiscussionPage({ params }: Props) {
  const id = Number(params.id);
  const discussion: Entry<DiscussionSkeleton> | null = await fetchDiscussionById(id);

  if (!discussion) return notFound();

  const {
    title: rawTitle,
    posterUsername: rawUsername,
    post: rawPost,
    discussionId: rawDiscussionId,
  } = discussion.fields;

  const title: string = typeof rawTitle === 'string' ? rawTitle : 'Untitled Discussion';
  const posterUsername: string = typeof rawUsername === 'string' ? rawUsername : 'Unknown user';

  // Handle localized post (if it's an object with locale keys)
  let post: RichTextDocument | null = null;

  if (rawPost) {
    const postCandidate = rawPost as unknown;

    if (
      typeof postCandidate === 'object' &&
      postCandidate !== null &&
      'nodeType' in postCandidate
    ) {
      post = postCandidate as RichTextDocument;
    } else if (
      typeof postCandidate === 'object' &&
      postCandidate !== null
    ) {
      // Try treating it as localized object: { "en-US": { nodeType: ..., ... } }
      const maybeLocalized = postCandidate as Record<string, unknown>;
      const localizedEntry = maybeLocalized['en-US'] ?? Object.values(maybeLocalized)[0];

      if (
        typeof localizedEntry === 'object' &&
        localizedEntry !== null &&
        'nodeType' in localizedEntry
      ) {
        post = localizedEntry as RichTextDocument;
      }
    }
  }

  const discussionId: number | null = typeof rawDiscussionId === 'number' ? rawDiscussionId : null;

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <Header />
      <Navigation />

      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h1>
        <p className="text-sm text-gray-500 mb-4">~{posterUsername}</p>

        <div className="prose dark:prose-invert max-w-none">
          {post && documentToReactComponents(post, renderOptions)}
        </div>

        {discussionId !== null && <Comments discussionId={discussionId} movieId={null} />}
      </div>
    </div>
  );
}