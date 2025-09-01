import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { fetchDiscussionById } from '../../../lib/fetchDiscussionById';
import Comments from '../../../components/comment/comment';
import Header from '../../../components/header/header';
import Navigation from '../../../components/navigation/navigation';

type Props = {
  params: {
    id: string; // discussionId from the route
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const discussion = await fetchDiscussionById(Number(params.id));

  if (!discussion) {
    return {
      title: 'Discussion Not Found',
    };
  }

  return {
    title: discussion.title,
    description: discussion.posterUsername,
  };
}

export default async function DiscussionPage({ params }: Props) {
  const id = Number(params.id);
  const discussion = await fetchDiscussionById(id);

  if (!discussion) return notFound();

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <Header />
      <Navigation />

      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{discussion.title}</h1>
        <p className="text-sm text-gray-500 mb-4">Posted by: {discussion.posterUsername}</p>

        <div className="prose dark:prose-invert max-w-none">
          {documentToReactComponents(discussion.post)}
        </div>

        <Comments discussionId={discussion.discussionId} movieId={null} />
      </div>
    </div>
  );
}