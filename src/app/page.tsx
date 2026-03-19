"use client";
import { getNews } from "@/actions/getNews";
import Header from "@/components/Header";
import { getNewsSummarized } from "@/actions/getNewSummarized";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
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
  }, []);

  const handleArticleClicked = useCallback(
    async (articleUrl: string) => {
      // If clicking the same article, close it
      if (clickedArticleUrl === articleUrl) {
        setClickedArticleUrl(null);
        return;
      }
      
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
    [summaryMap, clickedArticleUrl]
  );

  // close the article summary by clicking close button
  const closeArticleSummary = () => {
    setClickedArticleUrl(null);
  };

  if (!news) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <div className="relative">
          <Image
            src="./Briefly.svg"
            alt="Briefly Icon"
            width={80}
            height={80}
            className="animate-pulse"
          />
        </div>
        <p className="mt-6 text-muted-foreground text-sm tracking-wide uppercase">
          Loading stories...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Today&apos;s Headlines
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
            Curated news from around the world, simplified for quick reading.
          </p>
        </div>
      </div>
      
      {/* News Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {news.articles.map((article: FetchedArticle) => (
            <News
              key={article.link || article.url}
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
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-display text-xl font-bold text-primary">Briefly</p>
            <p className="text-sm text-muted-foreground">
              Stay informed. Stay ahead.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
