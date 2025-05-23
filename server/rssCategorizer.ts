import 'dotenv/config';
import axios from 'axios';
import Parser from 'rss-parser';

// Fetch up to 5 RSS articles from the given URL
export async function fetchRSS(url: string) {
  const parser = new Parser({
    customFields: {
      item: [
        ['content:encoded', 'content'],
        ['description', 'content'],
      ],
    },
  });
  const feed = await parser.parseURL(url);
  return (feed.items ?? []).slice(0, 5).map(item => ({
    title: item.title ?? '',
    snippet:
      item.contentSnippet ??
      (item as any).content ??
      (item as any)['content:encoded'] ??
      item.summary ??
      item.description ??
      '',
  }));
}

const OPENAI_URL = 'https://api.openai.com/v1/embeddings';
const MODELS = ['text-embedding-3-small', 'text-embedding-ada-002'];

// Request an embedding from OpenAI, trying preferred model first
export async function getEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in the environment');
  }

  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i];
    try {
      const response = await axios.post(
        OPENAI_URL,
        { input: text, model },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      return response.data.data[0].embedding as number[];
    } catch (err: any) {
      if (i === MODELS.length - 1) {
        throw err;
      }
      console.warn(`Model ${model} failed, trying fallback`);
    }
  }
  throw new Error('Failed to retrieve embedding');
}

// Simple cosine similarity between two vectors
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

type CategoryEmbedding = { name: string; embedding: number[] };

// Categorize a single article text against provided categories
export async function categorizeArticle(
  articleText: string,
  categoryEmbeddings: CategoryEmbedding[]
) {
  const articleEmbedding = await getEmbedding(articleText);
  const scores = categoryEmbeddings.map(cat => ({
    name: cat.name,
    score: cosineSimilarity(articleEmbedding, cat.embedding),
  }));
  const best = scores.reduce((prev, curr) =>
    curr.score > prev.score ? curr : prev
  );
  const matchedCategory = best.score > 0.8 ? best.name : null;
  return { scores, matchedCategory };
}

// --- Demo execution when run directly ---
if (import.meta.url === `file://${process.argv[1]}`) {
  async function main() {
    const feedUrl =
      'https://feeds.marketwatch.com/marketwatch/topstories';
    const articles = await fetchRSS(feedUrl);

    const categories = [
      {
        name: 'Private equity investments or acquisitions in Canada',
        prompt: 'Private equity investments or acquisitions in Canada',
      },
      {
        name: 'Industrial automation or robotics M&A in North America',
        prompt: 'Industrial automation or robotics M&A in North America',
      },
    ];

    const categoryEmbeddings: CategoryEmbedding[] = [];
    for (const cat of categories) {
      const emb = await getEmbedding(cat.prompt);
      categoryEmbeddings.push({ name: cat.name, embedding: emb });
    }

    for (const article of articles) {
      const text = `${article.title}\n${article.snippet}`;
      const { scores, matchedCategory } = await categorizeArticle(
        text,
        categoryEmbeddings
      );
      console.log(`Title: ${article.title}`);
      console.log(`Category: ${matchedCategory ?? 'No match'}`);
      console.log(
        scores
          .map(s => `${s.name}: ${s.score.toFixed(4)}`)
          .join(' | ')
      );
      console.log('---');
    }
  }

  main().catch(err => {
    console.error(err);
  });
}
