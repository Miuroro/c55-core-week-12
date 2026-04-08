// database.js
// Your task: implement each function below using better-sqlite3.
// The function signatures are identical to storage.js so you can
// compare the two files side by side.
//
// When every function works correctly, `node app.js` should
// print exactly the same output as it did with storage.js.

import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_FILE = join(__dirname, "../data/flashcards.db");

const db = new Database(DB_FILE);

// ----------------------------------------------------------------
// Decks
// ----------------------------------------------------------------

export function getAllDecks() {
  // TODO: return all rows from the decks table
  try {
    return db.prepare("SELECT * FROM decks").all();
  } catch (err) {
    throw new Error(`Failed to fetch all decks: ${err.message}`);
  }
}

export function getDeckById(id) {
  // TODO: return the deck row with the given id, or null if not found
  try {
    return db.prepare("SELECT * FROM decks WHERE id = ?").get(id) ?? null;
  } catch (err) {
    throw new Error(`Failed to fetch deck: ${id}${err.message}`);
  }
}

export function addDeck(name, description) {
  // TODO: insert a new deck and return the new row (including its id)
  try {
    const info = db
      .prepare("INSERT INTO decks (name, description) VALUES (?, ?)")
      .run(name, description);
    return { id: info.lastInsertRowid, name, description };
  } catch (err) {
    throw new Error(`Failed to create deck: ${err.message}`);
  }
}

export function deleteDeck(deckId) {
  // TODO: delete the deck with the given id
  //       return true if a row was deleted, false otherwise
  try {
    const info = db.prepare("DELETE FROM decks WHERE id = ?").run(deckId);
    return info.changes > 0;
  } catch (err) {
    throw new Error(`Failed to delete deck: ${id}${err.message}`);
  }
}

// ----------------------------------------------------------------
// Cards
// ----------------------------------------------------------------

export function getAllCardsForDeck(deckId) {
  // TODO: return all card rows whose deckId matches
  try {
    return db
      .prepare(
        "SELECT id, question, answer, learned, deck_id AS deckId FROM cards WHERE deck_id = ?",
      )
      .all(deckId);
  } catch (err) {
    throw new Error(`Failed to fetch cards for deck: ${err.message}`);
  }
}

export function addCard(question, answer, deckId) {
  // TODO: insert a new card and return the new row (including its id)
  try {
    const info = db
      .prepare("INSERT INTO cards (question, answer, deck_id) VALUES (?, ?, ?)")
      .run(question, answer, deckId);
    return { id: info.lastInsertRowid, question, answer, learned: 0, deckId };
  } catch (err) {
    throw new Error(`Failed to add card: ${err.message}`);
  }
}

export function markCardLearned(cardId) {
  // TODO: set learned = 1 for the card with the given id
  //       return the updated row, or null if not found
  try {
    db.prepare("UPDATE cards SET learned = 1 WHERE id = ?").run(cardId);
    const card =
      db
        .prepare(
          "SELECT id, question, answer, learned, deck_id AS deckId FROM cards WHERE id = ?",
        )
        .get(cardId) ?? null;

    if (!card) return null;
    return { ...card, learned: card.learned === 1 };
  } catch (err) {
    throw new Error(`Failed to mark card as learned: ${err.message}`);
  }
}

export function deleteCard(cardId) {
  // TODO: delete the card with the given id
  //       return true if a row was deleted, false otherwise
  try {
    const info = db.prepare("DELETE FROM cards WHERE id = ?").run(cardId);
    return info.changes > 0;
  } catch (err) {
    throw new Error(`Failed to delete card: ${err.message}`);
  }
}
