import * as dotenv from "dotenv";
dotenv.config();
import * as cheerio from "cheerio";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { getNewsSummarized } from "./getNewSummarized";

interface Article {
  url: string;
  title: string;
}

export const getNews = async () => {
  console.log("Fetching news...");
  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  const data = await response.json();
  return data;
};

// Fetch full article content from a given URL
export const getFullContent = async (articleUrl: string) => {
  if (typeof window !== "undefined") {
    throw new Error("getFullContent must be called from the server!");
  }

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
  } catch (error: any) {
    console.error("Error fetching full content:", error.message);
    return null;
  }
};

// Utility function to limit requests to avoid API rate limits
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
