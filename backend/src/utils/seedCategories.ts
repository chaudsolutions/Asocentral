import { CategoryModel } from "../models/category.model";

const categories = [
    {
        name: "Politics",
        slug: "politics",
        description: "Government, elections, and public policy",
    },
    {
        name: "World",
        slug: "world",
        description: "International news and global events",
    },
    {
        name: "Business",
        slug: "business",
        description: "Economy, markets, and corporate news",
    },
    {
        name: "Technology",
        slug: "technology",
        description: "Innovations, gadgets, and software",
    },
    {
        name: "Science",
        slug: "science",
        description: "Scientific discoveries and space exploration",
    },
    {
        name: "Health",
        slug: "health",
        description: "Medical news, wellness, and fitness",
    },
    {
        name: "Entertainment",
        slug: "entertainment",
        description: "Movies, music, celebrity news, and arts",
    },
    {
        name: "Sports",
        slug: "sports",
        description: "Match results, athlete profiles, and sports updates",
    },
    {
        name: "Lifestyle",
        slug: "lifestyle",
        description: "Travel, food, fashion, and home",
    },
    {
        name: "Environment",
        slug: "environment",
        description: "Climate change, conservation, and nature",
    },
    {
        name: "Education",
        slug: "education",
        description: "Schools, universities, and learning",
    },
    {
        name: "Opinion",
        slug: "opinion",
        description: "Editorials, commentary, and viewpoints",
    },
    {
        name: "Crime",
        slug: "crime",
        description: "Legal issues, investigations, and safety",
    },
    {
        name: "Finance",
        slug: "finance",
        description: "Personal finance, crypto, and banking",
    },
    {
        name: "Top News",
        slug: "top-news",
        description: "The most important breaking stories of the day",
    },
];

const seedDB = async () => {
    try {
        // Clear existing categories to start fresh
        await CategoryModel.deleteMany({});
        console.log("Existing categories cleared.");

        // Insert new categories
        await CategoryModel.insertMany(categories);
        console.log(`Successfully added ${categories.length} categories!`);
    } catch (error) {
        console.error("Error seeding categories:", error);
        process.exit(1);
    }
};

export default seedDB;
