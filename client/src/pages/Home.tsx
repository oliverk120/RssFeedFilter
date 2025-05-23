import { useState, useEffect } from "react";
import FeedInputForm from "@/components/FeedInputForm";
import FeedStatus from "@/components/FeedStatus";
import FeedItemsList from "@/components/FeedItemsList";
import FeedJsonDisplay from "@/components/FeedJsonDisplay";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FeedItem, FeedStatusType } from "@/lib/types";

export default function Home() {
  const { toast } = useToast();
  const [rssUrl, setRssUrl] = useState<string>("https://news.ycombinator.com/rss");
  const [filterKeywords, setFilterKeywords] = useState<string>("");
  const [status, setStatus] = useState<FeedStatusType>("initial");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [limit, setLimit] = useState<number>(1);

  // Mutation to fetch the feed
  const fetchFeedMutation = useMutation({
    mutationFn: async () => {
      setStatus("loading");
      const params = new URLSearchParams({
        url: rssUrl,
        keywords: filterKeywords,
        limit: limit.toString(),
      });
      const res = await apiRequest("GET", `/api/feed?${params.toString()}`);
      return res.json();
    },
    onSuccess: (data) => {
      setFeedItems(data);
      setStatus("success");
    },
    onError: (err: Error) => {
      setStatus("error");
      setErrorMessage(err.message);
      toast({
        variant: "destructive",
        title: "Error fetching feed",
        description: err.message,
      });
    },
  });

  // Handle fetch feed action
  const handleFetchFeed = async () => {
    if (!rssUrl) {
      toast({
        variant: "destructive",
        title: "Missing URL",
        description: "Please enter an RSS feed URL",
      });
      return;
    }
    
    await fetchFeedMutation.mutateAsync();
  };

  // Handle RSS URL change
  const handleRssUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRssUrl(e.target.value);
  };

  // Handle filter keywords change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterKeywords(e.target.value);
    if (status === "success") {
      // Need to re-fetch with the new filter keywords
      handleFetchFeed();
    }
  };

  // Handle limit change
  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setLimit(isNaN(value) ? 1 : Math.max(value, 1));
  };

  // Determine the current status to display
  let currentStatus = status;
  if (fetchFeedMutation.isPending) {
    currentStatus = "loading";
  } else if (fetchFeedMutation.isError) {
    currentStatus = "error";
  } else if (status === "success" && feedItems.length === 0) {
    currentStatus = "empty";
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">RSS Feed Filter</h1>
          <p className="text-gray-600">Enter filter keywords and get relevant RSS feed items</p>
        </header>

        <FeedInputForm
          rssUrl={rssUrl}
          filterKeywords={filterKeywords}
          limit={limit}
          onRssUrlChange={handleRssUrlChange}
          onFilterChange={handleFilterChange}
          onLimitChange={handleLimitChange}
          onFetchFeed={handleFetchFeed}
          isLoading={fetchFeedMutation.isPending}
        />

        <FeedStatus 
          status={currentStatus}
          errorMessage={errorMessage}
          totalItems={feedItems?.length || 0}
          filterKeywords={filterKeywords}
        />

        <FeedItemsList
          items={feedItems}
          filterKeywords={filterKeywords.split(',').map(kw => kw.trim()).filter(Boolean)}
        />

        <div className="mt-6">
          <FeedJsonDisplay items={feedItems} />
        </div>

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>RSS Feed Filter App &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}
