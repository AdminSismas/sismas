import { db, Articles, eq } from 'astro:db';
export type WikiArticle = typeof Articles.$inferSelect;

export const wikiRepository = {
  async listArticles() {
    return db.select().from(Articles);
  },
  async getArticle(slug: string) {
    return db.select().from(Articles).where(eq(Articles.slug, slug));
  },
  async saveArticle(article: typeof Articles.$inferInsert) {
    return db.insert(Articles).values(article);
  },
  async editArticle(article: typeof Articles.$inferInsert) {
    return db
      .update(Articles)
      .set(article)
      .where(eq(Articles.slug, article.slug));
  },
  async deleteArticle(slug: string) {
    return db.delete(Articles).where(eq(Articles.slug, slug));
  }
};
