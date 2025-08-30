import { createClient } from 'contentful';

const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN as string

if (!space || !accessToken) {
  throw new Error("Missing Contentful environment variables");
}

export const contentfulClient = createClient({
  space,
  accessToken,
});