export interface NewsContentType {
    image_url: string;
    title: string;
    description: string;
}

export interface NewsDataType {
    _id: string;
    article_id: string;
    category: string[];
    content: NewsContentType[];
    country: string[];
    creator: string[];
    description: string;
    fetched_at: string;
    image_url: string;
    keywords: string[];
    language: string;
    link: string;
    pubDate: string;
    title: string;
    video_url: string | null;
    isSystem: boolean;
    active: boolean;
    downloads: number;
    shares: number;
}

export interface NewsCategoryType {
    _id: string;
    name: string;
    description: string;
    slug: string;
}

// Form specific type
export type INewsFormInput = Omit<
    NewsDataType,
    "_id" | "fetched_at" | "isSystem"
>;
