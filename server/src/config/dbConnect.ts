import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers([
  "10.94.8.11",
  "10.94.8.12"
]);

export async function connectDB() {
  try {
    console.log("DNS:", dns.getServers());

    const conn = await mongoose.connect(process.env.MONGODB_URI!);

    console.log("✅ Connected");
    console.log("Database:", conn.connection.name);
    console.log("Host:", conn.connection.host);
  } catch (err) {
    console.error(err);
    throw err;
  }
}