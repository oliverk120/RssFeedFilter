import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FeedInputFormProps {
  rssUrl: string;
  filterKeywords: string;
  limit: number;
  onRssUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLimitChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFetchFeed: () => void;
  isLoading: boolean;
}

export default function FeedInputForm({
  rssUrl,
  filterKeywords,
  limit,
  onRssUrlChange,
  onFilterChange,
  onLimitChange,
  onFetchFeed,
  isLoading
}: FeedInputFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="mb-6">
        <label htmlFor="rss-url" className="block text-sm font-medium text-gray-700 mb-1">
          RSS Feed URL
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <Input
            type="url"
            id="rss-url"
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="https://example.com/feed.rss"
            value={rssUrl}
            onChange={onRssUrlChange}
          />
          <Button
            type="button"
            onClick={onFetchFeed}
            disabled={isLoading}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isLoading ? "Loading..." : "Fetch Feed"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-gray-500">Enter a valid RSS feed URL to fetch content</p>
      </div>

      <div className="mb-6">
        <label htmlFor="filter-keywords" className="block text-sm font-medium text-gray-700 mb-1">
          Filter Keywords
        </label>
        <div className="mt-1">
          <Input
            type="text"
            id="filter-keywords"
            className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="react, javascript, node"
            value={filterKeywords}
            onChange={onFilterChange}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">Enter comma-separated keywords to filter the feed</p>
      </div>

      <div className="mb-6">
        <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
          Items Limit
        </label>
        <div className="mt-1">
          <Input
            type="number"
            id="limit"
            className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={limit}
            onChange={onLimitChange}
            min={1}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">Number of items to fetch from the feed</p>
      </div>
    </div>
  );
}
