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

// In-memory mock database
const MOCK_DB: Record<string, WikiArticle> = {
  bienvenida: {
    slug: 'bienvenida',
    title: 'Bienvenido a Sismas Manual',
    content:
      '# Bienvenido\n\nEste es el manual interno de Sismas.\n\n## Características\n- Renderizado SSR rápido\n- Editor interactivo\n- Integración con el ecosistema existente',
    updatedAt: new Date().toISOString(),
    author: 'Admin'
  },
  arquitectura: {
    slug: 'arquitectura',
    title: 'Arquitectura del Sistema',
    content:
      '# Arquitectura\n\nEl sistema se compone de:\n1. **Angular Monorepo**: Core del negocio\n2. **Manual Astro**: Documentación rápida\n3. **Nginx**: Gateway reverso',
    updatedAt: new Date().toISOString(),
    author: 'Architect'
  }
};

export const wikiRepository: WikiRepository = {
  async getArticle(slug: string) {
    // Simulate latency
    await new Promise((resolve) => setTimeout(resolve, 50));
    return MOCK_DB[slug] || null;
  },

  async saveArticle(article: WikiArticle) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    MOCK_DB[article.slug] = article;
  },

  async listArticles() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return Object.values(MOCK_DB);
  },

  async editArticle(article: WikiArticle) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    MOCK_DB[article.slug] = article;
  },

  async deleteArticle(slug: string) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    delete MOCK_DB[slug];
  }
};
