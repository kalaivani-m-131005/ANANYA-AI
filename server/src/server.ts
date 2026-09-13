import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server/.env BEFORE importing the Express application
const envPath = path.join(__dirname, '../.env');

dotenv.config({ path: envPath });

// Safe check: never print the actual API key
console.log(
  '[ANANYA-AI] Gemini API key loaded:',
  Boolean(process.env.GEMINI_API_KEY)
);

console.log(
  '[ANANYA-AI] Environment loaded from:',
  envPath
);

// Import the application only AFTER environment variables are loaded.
// This avoids ESM import-order problems.
const { default: app } = await import('./app');
const { connectDB } = await import('./config/db');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[ANANYA-AI] Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      '[ANANYA-AI] Failed to connect to MongoDB:',
      error
    );
    process.exit(1);
  });