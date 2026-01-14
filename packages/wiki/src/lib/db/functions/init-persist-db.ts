import type { WikiArticle } from '../db';
import fs from 'node:fs';

interface PersistDbParams {
  MOCK_DB: Record<string, WikiArticle>;
  DB_PATH: string;
}

// Simple write lock to avoid race conditions
let isWriting = false;
let needsWrite = false;

// Helper to persist changes to disk with basic locking
export const initPersistDb = async ({ MOCK_DB, DB_PATH }: PersistDbParams) => {
  if (isWriting) {
    needsWrite = true;
    return;
  }
  isWriting = true;
  try {
    // Write at least once, and repeat if a new write was requested during the write
    do {
      needsWrite = false;
      // Snapshot the data *now* for writing
      const dataToWrite = JSON.stringify(MOCK_DB, null, 2);
      await fs.promises.writeFile(DB_PATH, dataToWrite, 'utf-8');
    } while (needsWrite);
  } catch (error) {
    console.error('Error persisting database:', error);
    // If we fail, we might want to propagate or retry, but for now log it.
    throw error;
  } finally {
    isWriting = false;
  }
};
