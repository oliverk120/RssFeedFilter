import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import RssParser from "rss-parser";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new RSS parser instance
  const parser = new RssParser({
    customFields: {
      item: [
        ['content:encoded', 'content'],
        ['description', 'content'],
      ],
    },
  });

  // API endpoint to fetch and filter RSS feed
  app.get("/api/feed", async (req, res) => {
    try {
      const url = req.query.url as string;
      const keywords = req.query.keywords as string;
      const limitParam = parseInt(req.query.limit as string);
      const limit = Number.isNaN(limitParam) ? undefined : Math.max(limitParam, 0);

      if (!url) {
        return res.status(400).json({ message: "RSS feed URL is required" });
      }

      // Fetch and parse the RSS feed
      const feed = await parser.parseURL(url);
      
      // Extract feed items
      const items = feed.items.map(item => ({
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate || '',
        content: item.content || item['content:encoded'] || item.description || '',
        contentSnippet: item.contentSnippet || '',
        author: item.creator || item.author || '',
        isoDate: item.isoDate || '',
      }));

      // Filter items if keywords are provided
      let filteredItems = items;
      
      if (keywords && keywords.trim() !== '') {
        const keywordsList = keywords
          .split(',')
          .map(k => k.trim().toLowerCase())
          .filter(Boolean);
        
        if (keywordsList.length > 0) {
          filteredItems = items.filter(item => {
            const itemText = `${item.title} ${item.content}`.toLowerCase();
            return keywordsList.some(keyword => itemText.includes(keyword));
          });
        }
      }

      // Apply limit if provided
      if (typeof limit === 'number' && limit > 0) {
        filteredItems = filteredItems.slice(0, limit);
      }

      // Store items in memory for future reference (optional)
      await storage.storeFeedItems(filteredItems);

      return res.status(200).json(filteredItems);
    } catch (error) {
      console.error('Error fetching RSS feed:', error);
      return res.status(500).json({ 
        message: error instanceof Error 
          ? error.message 
          : "Failed to fetch and parse the RSS feed" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
