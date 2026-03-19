"use client";
import { getNews } from "@/actions/getNews";
import { getNewsSummarized } from "@/actions/getNewSummarized";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import News from "@/components/News";

interface NewsArticle {
  articles: FetchedArticle[];
}

interface FetchedArticle {
  author: string;
  content: string;
  description: string;
  pubDate?: string;
  publishedAt?: string;
  source: { id: string; name: string };
  title: string;
  link?: string | undefined;
  url?: string | undefined;
  urlToImage: string;
}

const Page = () => {
  const { category } = useParams() as { category: string };
  let query = "";
  if (category === "asia") {
    query = "world/asia";
  } else if (category === "entertainment") {
    query = "entertainment_and_arts";
  } else {
    query = category;
  }
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
      if (category) {
        try {
          const news: NewsArticle = await getNews(`/${query}`);
          setNews(news);
        } catch (error) {
          console.error("Error fetching news:", error);
        }
      }
    };

    fetchNews();
  }, [query, category]);

  console.log("news", news);

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
      <div className="min-h-screen bg-background">
        <Header path={category} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={i}
                className="h-[30rem] rounded-xl overflow-hidden"
              >
                <Skeleton className="w-full h-full" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header path={category} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {news.articles.map((article: FetchedArticle) => (
            <News
              key={article.url}
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
    </div>
  );
};

export default Page;
