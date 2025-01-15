"use client";
import { getNews } from "@/actions/getNews";
import Header from "@/components/Header";
import { getNewsSummarized } from "@/actions/getNewSummarized";
import { useState, useCallback, useEffect } from "react";
import Briefly from "../../public/Briefly.svg";
import News from "@/components/News";

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
  link?: string | undefined;
  url?: string | undefined;
  urlToImage: string;
}

export default function Home() {
  const [news, setNews] = useState<NewsArticle>();
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [clickedArticleUrl, setClickedArticleUrl] = useState<string | null>(
    null
  );
  const [summaryMap, setSummaryMap] = useState<Record<string, string | null>>(
    {}
  );

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const news: NewsArticle = await getNews("/world");
        setNews(news);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
    // console.log("news from getNews:", news);
  }, []);

  const handleArticleClicked = useCallback(
    async (articleUrl: string) => {
      setClickedArticleUrl(articleUrl);
      setIsSummaryLoading(true);
      try {
        // Check if the article summary is already loaded
        if (summaryMap[articleUrl]) {
          setClickedArticleUrl(articleUrl);
          setIsSummaryLoading(false);
          return;
        }

        const response = await fetch(
          `/api/getFullContent?url=${encodeURIComponent(articleUrl)}`
        );
        const { content } = await response.json();

        // Summarize the clicked article content
        const summary = await getNewsSummarized(content);

        // Update the summary map with the summary for the clicked article
        setSummaryMap((prev) => ({ ...prev, [articleUrl]: summary }));
        setClickedArticleUrl(articleUrl);
      } catch (error) {
        console.error("Error summarizing article:", error);
      } finally {
        // Ensure loading state is set to false once the request completes
        setIsSummaryLoading(false);
      }
    },
    [summaryMap]
  );

  // close the article summary by clicking close button
  const closeArticleSummary = () => {
    setClickedArticleUrl(null);
  };

  if (!news) {
    return (
      <div className="w-full bg-white flex justify-center items-center h-screen">
        <img
          src={Briefly.src}
          alt="Briefly Icon"
          width={100}
          height={100}
          className="animate-bounce"
        />
      </div>
    );
  }

  return (
    <div className="w-full z-10 relative">
      <Header />
      <div className=" gap-2 flex flex-row items-center justify-center flex-wrap">
        {news.articles.map((article: FetchedArticle) => (
          <News
            key={article.link}
            article={article}
            handleArticleClicked={handleArticleClicked}
            clickedArticleUrl={clickedArticleUrl}
            summaryMap={summaryMap}
            isSummaryLoading={isSummaryLoading}
            setIsSummaryLoading={setIsSummaryLoading}
            closeArticleSummary={closeArticleSummary}
          />
        ))}
      </div>
    </div>
  );
}
