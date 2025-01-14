import * as dotenv from "dotenv";
dotenv.config();
import * as cheerio from "cheerio";
import axios from "axios";

const newsSeacrhURL = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=blockchain&apikey=${process.env.NEXT_PUBLIC_ALPHA_KEY}`;

export const getFinanceNews = async () => {
  console.log("Fetching news...");
  const response = await fetch(newsSeacrhURL);

  if (!response.ok) {
    throw new Error("Failed to fetch finance news");
  }

  const data = await response.json();
  return data;
};
