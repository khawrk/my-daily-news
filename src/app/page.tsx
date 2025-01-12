"use client";
import { getNews, getFullContent, delay } from "@/actions/getNews";
import Header from "@/components/Header";
import { getNewsSummarized } from "@/actions/getNewSummarized";
import { useState, useCallback, useEffect } from "react";
import News from "@/components/News";

interface News {
  articles: Article[];
}

interface Article {
  author: string;
  content: string;
  description: string;
  publishedAt: string;
  source: { id: string; name: string };
  title: string;
  url: string;
  urlToImage: string;
}

export default function Home() {
  const [news, setNews] = useState<News>();
  const [clickedArticleUrl, setClickedArticleUrl] = useState<string | null>(
    null
  );
  const [summaryMap, setSummaryMap] = useState<Record<string, string | null>>(
    {}
  );

  useEffect(() => {
    const fetchNews = async () => {
      const news = await getNews();
      setNews(news);
    };

    fetchNews();
  }, []);

  console.log(news);

  const handleArticleClicked = useCallback(
    async (articleUrl: string) => {
      try {
        // Check if the article summary is already loaded
        if (summaryMap[articleUrl]) {
          setClickedArticleUrl(articleUrl);
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
      }
    },
    [summaryMap]
  );

  if (!news) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative">
      <Header />
      <div className=" flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        {news.articles.map((article: Article, index: number) => (
          <News
            key={article.url}
            article={article}
            handleArticleClicked={handleArticleClicked}
            clickedArticleUrl={clickedArticleUrl}
            summaryMap={summaryMap}
          />
        ))}
      </div>
    </div>
  );
}
