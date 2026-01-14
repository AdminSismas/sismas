import { initDB } from './functions/file-system-manager';
import { initPersistDb } from './functions/init-persist-db';

export interface WikiArticle {
  slug: string;
  title: string;
  content: string; // Markdown content
  updatedAt?: string;
  author?: string;
}

export interface WikiRepository {
  getArticle(slug: string): Promise<WikiArticle | null>;
  saveArticle(article: WikiArticle): Promise<void>;
  listArticles(): Promise<WikiArticle[]>;
  editArticle(article: WikiArticle): Promise<void>;
  deleteArticle(slug: string): Promise<void>;
}

const { MOCK_DB, DB_PATH } = initDB();
const persistDb = () => initPersistDb({ MOCK_DB, DB_PATH });

export const wikiRepository: WikiRepository = {
  async getArticle(slug: string) {
    // Simulate latency
    await new Promise((resolve) => setTimeout(resolve, 50));
    return MOCK_DB[slug] || null;
  },

  async saveArticle(article: WikiArticle) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    MOCK_DB[article.slug] = article;
    await persistDb();
  },

  async listArticles() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return Object.values(MOCK_DB);
  },

  async editArticle(article: WikiArticle) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    MOCK_DB[article.slug] = article;
    await persistDb();
  },

  async deleteArticle(slug: string) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    delete MOCK_DB[slug];
    await persistDb();
  }
};
