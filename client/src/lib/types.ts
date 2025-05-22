export type FeedStatusType = "initial" | "loading" | "success" | "error" | "empty";

export interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  contentSnippet?: string;
  author?: string;
  id?: string;
  isoDate?: string;
}
