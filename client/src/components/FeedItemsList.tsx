import { Card, CardContent } from "@/components/ui/card";
import { FeedItem } from "@/lib/types";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";

interface FeedItemsListProps {
  items: FeedItem[];
  filterKeywords: string[];
}

export default function FeedItemsList({ items, filterKeywords }: FeedItemsListProps) {
  // Helper function to highlight matched keywords
  const getMatchedKeywords = (item: FeedItem) => {
    const itemText = `${item.title} ${item.content}`.toLowerCase();
    return filterKeywords.filter(keyword => 
      keyword && itemText.includes(keyword.toLowerCase())
    );
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const matchedKeywords = getMatchedKeywords(item);
        const formattedDate = item.pubDate 
          ? format(new Date(item.pubDate), 'MMM dd, yyyy')
          : '';
          
        return (
          <Card key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                {filterKeywords.length > 0 && matchedKeywords.length > 0 && (
                  <span className="bg-primary-light bg-opacity-10 text-primary text-xs px-2 py-1 rounded-full">
                    Filtered match
                  </span>
                )}
                {formattedDate && (
                  <span className="text-xs text-gray-500">{formattedDate}</span>
                )}
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2 hover:text-primary">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {item.contentSnippet || item.content}
              </p>
              <div className="flex justify-between items-center">
                <a 
                  href={item.link} 
                  className="text-primary hover:text-primary-dark text-sm font-medium flex items-center"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Read full article
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
                {matchedKeywords.length > 0 && (
                  <div className="flex space-x-1">
                    {matchedKeywords.map((keyword, i) => (
                      <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
