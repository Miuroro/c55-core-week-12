import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, "data/data.json");
const DB_FILE = join(__dirname, "data/flashcards.db");

let db;

try {
  const data = JSON.parse(readFileSync(DATA_FILE, "utf-8"));
  db = new Database(DB_FILE);

  const insertDeck = db.prepare(
    "INSERT INTO decks (id, name, description) VALUES (?, ?, ?)",
  );
  for (const deck of data.decks) {
    insertDeck.run(deck.id, deck.name, deck.description);
  }
  console.log(`Inserted ${data.decks.length} decks`);

  const insertCard = db.prepare(
    "INSERT INTO cards (id, question, answer, learned, deck_id) VALUES (?, ?, ?, ?, ?)",
  );
  for (const card of data.cards) {
    insertCard.run(
      card.id,
      card.question,
      card.answer,
      card.learned ? 1 : 0,
      card.deckId,
    );
  }
  console.log(`Inserted ${data.cards.length} cards`);
  console.log("Migration complete");
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
} finally {
  db?.close();
}
