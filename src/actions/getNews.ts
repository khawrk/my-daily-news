"use server";
import * as dotenv from "dotenv";
dotenv.config();
import * as cheerio from "cheerio";
import axios from "axios";
import { parseStringPromise } from "xml2js";

interface NewsArticle {
  articles: FetchedArticle[];
}

interface FetchedArticle {
  author: string;
  content: string;
  description: string;
  pubDate: string;
  source: { id: string; name: string };
  title: string;
  link: string;
  urlToImage: string;
  "media:thumbnail"?: { $: { url: string } }[];
}

// Test RSS feed

export async function getNews(path: string): Promise<NewsArticle> {
  const response = await fetch(`https://feeds.bbci.co.uk/news${path}/rss.xml`);
  const xml = await response.text();

  // Parse XML to JSON
  const parsedData = await parseStringPromise(xml);
  // console.log(parsedData.rss.channel[0]);

  // Map parsed data to your Article interface
  const articles = parsedData.rss.channel[0].item
    .filter((item: FetchedArticle) => !item.link[0].includes("/video"))
    .map((item: FetchedArticle) => ({
      author: "BBC News",
      content: item.description[0],
      description: item.description[0],
      publishedAt: item.pubDate[0],
      source: { id: "bbc-news", name: "BBC News" },
      title: item.title[0],
      url: item.link[0],
      urlToImage: item["media:thumbnail"]?.[0]?.$.url || "/default-image.jpg",
    }));

  console.log(articles);
  return { articles };
}

// -- below is fetching using API
// interface Article {
//   url: string;
//   title: string;
// }

// const newsSeacrhURL = `https://newsapi.org/v2/top-headlines?pageSize=30&sources=bbc-news&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`;

// export const getNews = async () => {
//   console.log("Fetching news...");
//   const response = await fetch(newsSeacrhURL);

//   if (!response.ok) {
//     throw new Error("Failed to fetch news");
//   }

//   const data = await response.json();
//   return data;
// };

// Fetch full article content from a given URL
export const getFullContent = async (articleUrl: string) => {
  // if (typeof window !== "undefined") {
  //   throw new Error("getFullContent must be called from the server!");
  // }

  try {
    // Make the server-side request
    const { data } = await axios.get(articleUrl);
    const $ = cheerio.load(data);

    let articleContent = "";

    // Extract article content
    $('div[data-component="text-block"] p').each((index, element) => {
      articleContent += `${$(element).text().trim()}\n`;
    });

    return articleContent.trim();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching full content:", error.message);
    }
    return null;
  }
};

// export function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }
