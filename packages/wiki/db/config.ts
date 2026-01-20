import { defineDb, defineTable, column } from 'astro:db';

const Articles = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    title: column.text(),
    slug: column.text({ unique: true }),
    content: column.text(),
    updatedAt: column.date({ default: new Date() }),
    author: column.text({ optional: true })
  }
});

export default defineDb({
  tables: {
    Articles
  }
});
