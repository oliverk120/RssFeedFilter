import { FeedStatusType } from "@/lib/types";

interface FeedStatusProps {
  status: FeedStatusType;
  errorMessage?: string;
  totalItems: number;
  filterKeywords: string;
}

export default function FeedStatus({
  status,
  errorMessage = "Failed to load RSS feed. Please check the URL and try again.",
  totalItems,
  filterKeywords
}: FeedStatusProps) {
  const keywords = filterKeywords.split(',').map(k => k.trim()).filter(Boolean);
  const keywordsText = keywords.length > 0 ? `"${keywords.join(', ')}"` : "none";

  return (
    <div className="mb-6">
      {/* Initial state */}
      {status === "initial" && (
        <div className="bg-blue-50 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="ri-information-line text-blue-400 text-xl"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">Enter an RSS feed URL and click "Fetch Feed" to begin</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {status === "loading" && (
        <div className="bg-gray-50 rounded-md p-6 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-gray-600">Loading RSS feed...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="bg-red-50 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="ri-error-warning-line text-red-400 text-xl"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty results state */}
      {status === "empty" && (
        <div className="bg-yellow-50 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="ri-filter-off-line text-yellow-400 text-xl"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">No items match your filter criteria. Try using different keywords.</p>
            </div>
          </div>
        </div>
      )}

      {/* Success state */}
      {status === "success" && totalItems > 0 && (
        <div className="bg-green-50 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="ri-check-line text-green-400 text-xl"></i>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-green-700">
                RSS feed loaded successfully.
                <span className="font-medium">
                  {` Showing ${totalItems} items ${keywords.length > 0 ? `matching your filters: ${keywordsText}` : 'from the feed'}`}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
