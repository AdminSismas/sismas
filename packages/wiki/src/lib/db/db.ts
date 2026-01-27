import { db, Articles, eq, desc } from 'astro:db';
export type WikiArticle = typeof Articles.$inferSelect;

export const wikiRepository = {
  async listArticles() {
    return db.select().from(Articles).orderBy(Articles.position);
  },
  async getArticle(slug: string) {
    return db.select().from(Articles).where(eq(Articles.slug, slug));
  },
  async saveArticle(article: typeof Articles.$inferInsert) {
    const position = await db
      .select({ position: Articles.position })
      .from(Articles)
      .orderBy(desc(Articles.position))
      .limit(1);
    return db.insert(Articles).values({
      ...article,
      position: position[0].position + 1
    });
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
