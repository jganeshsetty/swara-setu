import mongoose, { Connection } from "mongoose";

export interface MemoryStore {
  collections: Map<string, any[]>;
}

let connection: Connection | null = null;
let memoryStore: MemoryStore | null = null;
let connecting: Promise<Connection | null> | null = null;

export function getMemoryStore(): MemoryStore {
  if (!memoryStore) memoryStore = { collections: new Map() };
  return memoryStore;
}

export function isMemoryStore(conn: Connection | null): conn is Connection & {
  $memory: MemoryStore;
} {
  return Boolean(conn && (conn as any).$memory);
}

/**
 * Connect to MongoDB. Returns the active connection, or `null` if no real
 * MongoDB is available and the in-memory fallback is in use.
 */
export async function connectDb(): Promise<Connection | null> {
  if (connection && connection.readyState === 1) return connection;
  if (connecting) return connecting;

  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim().length > 0) {
    connecting = (async () => {
      try {
        const conn = await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 4000,
          maxPoolSize: 10,
        });
        connection = conn.connection;
        return connection;
      } catch (err) {
        console.warn("[db] MongoDB unavailable, falling back to in-memory store:", err);
        connection = null;
        return null;
      }
    })();
    try {
      return await connecting;
    } finally {
      connecting = null;
    }
  }

  // No URI configured: use in-memory store directly.
  return null;
}

/**
 * Return the in-memory store. Used by the fallback CRUD layer when no real
 * connection is available.
 */
export function getMemoryStoreSingleton(): MemoryStore {
  return getMemoryStore();
}

/**
 * Graceful shutdown. Safe to call multiple times.
 */
export async function disconnectDb(): Promise<void> {
  if (connection) {
    await connection.close();
    connection = null;
  }
  memoryStore = null;
}

/**
 * Health check used by the API `/api/health` route.
 */
export function dbStatus(): "connected" | "memory" | "unconfigured" {
  if (connection && connection.readyState === 1) return "connected";
  if (process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0) {
    return "memory";
  }
  return "unconfigured";
}

export default {
  connectDb,
  disconnectDb,
  dbStatus,
  getMemoryStoreSingleton,
};