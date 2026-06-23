import mongoose from "mongoose";
import { DB_URI } from "./constants";

type LegacyIndex = {
    name?: string;
};

type LegacyNewsCollection = {
    indexes: () => Promise<LegacyIndex[]>;
    dropIndex: (indexName: string) => Promise<unknown>;
};

//connect to DB
const connectDB = async () => {
    try {
        const mongoOptions = {
            serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
            socketTimeoutMS: 45000, // Close sockets after 45s inactivity
        } as unknown as mongoose.ConnectOptions;

        const conn = await mongoose.connect(DB_URI, mongoOptions);

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Ensure old TTL index does not keep deleting news records.
        try {
            const newsCollection = conn.connection.collection(
                "news",
            ) as unknown as LegacyNewsCollection;
            const indexes = await newsCollection.indexes();
            const hasFetchedAtTtl = indexes.some(
                (index: LegacyIndex) => index.name === "fetched_at_1",
            );
            if (hasFetchedAtTtl) {
                await newsCollection.dropIndex("fetched_at_1");
                console.log("Dropped legacy TTL index: fetched_at_1");
            }
        } catch (indexError) {
            console.warn("Index cleanup skipped:", indexError);
        }

        // Event listeners
        mongoose.connection.on("error", (err) => {
            console.error("DB connection error:", err.message);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
        });

        // Graceful shutdown
        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            console.log("MongoDB connection closed through app termination");
            process.exit(0);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    }
};

export default connectDB;
