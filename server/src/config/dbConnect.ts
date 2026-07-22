import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers([
  "10.94.8.11",
  "10.94.8.12"
]);

export const isMockDb = process.env.MOCK_DB === 'true';

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    console.log("DNS:", dns.getServers());
    connectionPromise = mongoose.connect(process.env.MONGODB_URI!).then(conn => {
      console.log("✅ Connected");
      console.log("Database:", conn.connection.name);
      console.log("Host:", conn.connection.host);
      return mongoose;
    }).catch(err => {
      console.error(err);
      connectionPromise = null;
      throw err;
    });
  }

  await connectionPromise;
}