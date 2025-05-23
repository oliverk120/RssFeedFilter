import { FeedItem } from "@/lib/types";

interface FeedJsonDisplayProps {
  items: FeedItem[];
}

export default function FeedJsonDisplay({ items }: FeedJsonDisplayProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-100 rounded-md p-4 overflow-x-auto text-sm">
      <pre className="whitespace-pre-wrap break-words">
        {JSON.stringify(items, null, 2)}
      </pre>
    </div>
  );
}
