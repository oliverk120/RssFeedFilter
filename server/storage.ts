import { feedItems, type FeedItem, type InsertFeedItem } from "@shared/schema";
import { users, type User, type InsertUser } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  storeFeedItems(items: any[]): Promise<FeedItem[]>;
  getFeedItems(): Promise<FeedItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private feeds: Map<number, FeedItem>;
  currentUserId: number;
  currentFeedId: number;

  constructor() {
    this.users = new Map();
    this.feeds = new Map();
    this.currentUserId = 1;
    this.currentFeedId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async storeFeedItems(items: any[]): Promise<FeedItem[]> {
    // Clear previous feeds to save memory
    this.feeds.clear();
    this.currentFeedId = 1;
    
    const storedItems: FeedItem[] = [];
    
    for (const item of items) {
      const id = this.currentFeedId++;
      const feedItem: FeedItem = { 
        ...item, 
        id,
        createdAt: new Date()
      };
      this.feeds.set(id, feedItem);
      storedItems.push(feedItem);
    }
    
    return storedItems;
  }

  async getFeedItems(): Promise<FeedItem[]> {
    return Array.from(this.feeds.values());
  }
}

export const storage = new MemStorage();
