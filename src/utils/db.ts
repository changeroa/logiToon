import { StoryResponse } from "../types";

const DB_NAME = "LogiToonDB";
const STORE_NAME = "stories";
const DB_VERSION = 1;

/**
 * Open the IndexedDB database.
 */
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "topic" });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

/**
 * Save a story to the database.
 */
export const saveStoryToCache = async (topic: string, story: StoryResponse): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    // Normalize topic key
    const normalizedTopic = topic.trim().toLowerCase();
    store.put({ topic: normalizedTopic, ...story, timestamp: Date.now() });
  } catch (error) {
    console.error("Failed to save story to cache:", error);
  }
};

/**
 * Retrieve a story from the database.
 */
export const getStoryFromCache = async (topic: string): Promise<StoryResponse | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const normalizedTopic = topic.trim().toLowerCase();
      const request = store.get(normalizedTopic);

      request.onsuccess = () => {
        resolve(request.result as StoryResponse || null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("Failed to get story from cache:", error);
    return null;
  }
};

/**
 * Retrieve ALL stories from the database.
 */
export const getAllStories = async (): Promise<(StoryResponse & { topic: string, timestamp: number })[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        // Sort by timestamp if available (newest first), otherwise roughly by insert order
        const results = request.result as (StoryResponse & { topic: string, timestamp: number })[];
        results.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        resolve(results);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("Failed to get all stories:", error);
    return [];
  }
};

/**
 * Delete a story from the database.
 */
export const deleteStoryFromCache = async (topic: string): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const normalizedTopic = topic.trim().toLowerCase();
    store.delete(normalizedTopic);
  } catch (error) {
    console.error("Failed to delete story:", error);
  }
};
