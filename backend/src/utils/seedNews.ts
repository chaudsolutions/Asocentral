import crypto from "node:crypto";
import NewsModel from "../models/news.model";

const categories = ["Politics", "Technology", "Sports", "Health", "Business"];

const dummyNews = Array.from({ length: 10 }).map((_, i) => ({
    article_id: crypto.randomUUID(),
    title: `Headline #${i + 1}: Major Breakthrough in ${categories[i % categories.length]}`,
    category: [categories[i % categories.length], "Trending"],
    description: `A detailed report on the latest events affecting the ${categories[i % categories.length]} sector globally.`,
    content: [
        {
            title: "The Initial Discovery",
            image_url: `https://picsum.photos/seed/${i + 10}/800/400`,
            description:
                "Experts gathered in Lagos earlier this week to discuss the unfolding situation and its long-term implications for the industry.",
        },
        {
            title: "Future Projections",
            image_url: "", // Testing missing content image
            description:
                "Analysts predict a 20% shift in market dynamics by the end of the 2026 fiscal year.",
        },
    ],
    country: ["Nigeria", "Global"],
    creator: [], // Leave empty for now as requested
    image_url: `https://picsum.photos/seed/${i}/800/600`,
    keywords: [
        "news",
        "breaking",
        categories[i % categories.length].toLowerCase(),
    ],
    language: "en",
    link: "https://trojannews.com/sample-article",
    pubDate: new Date().toISOString(),
    video_url:
        i % 3 === 0 ? "https://www.w3schools.com/html/mov_bbb.mp4" : null, // Every 3rd news has a video
    isSystem: true,
    active: true,
    shares: Math.floor(Math.random() * 100),
    downloads: Math.floor(Math.random() * 50),
    comments: [
        {
            sessionId: crypto.randomUUID(),
            user: "Reader_1",
            content: "Great insights on this topic!",
            createdAt: new Date(),
        },
    ],
}));

async function seedDatabase() {
    try {
        // Optional: Clear existing news before seeding
        await NewsModel.deleteMany({ isSystem: true });

        await NewsModel.insertMany(dummyNews);
        console.log("Successfully seeded 10 news articles!");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

export default seedDatabase;
