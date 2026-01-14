import fs from 'fs';
import path from 'path';
import type { WikiArticle } from '../db';

// Define the path to the JSON database file
// using process.cwd() allows it to work when running from project root,
// targeting the source file for persistence in this context.
const DB_PATH = path.join(process.cwd(), 'src/lib/db/mock-db.json');

// Initialize MOCK_DB from file
let MOCK_DB: Record<string, WikiArticle> = {};

export function initDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
      MOCK_DB = JSON.parse(fileContent);
      return { MOCK_DB, DB_PATH };
    } else {
      // If file doesn't exist, create directory structure and empty file
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify({}, null, 2));
      return { MOCK_DB, DB_PATH };
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    MOCK_DB = {};
    return { MOCK_DB, DB_PATH };
  }
}
