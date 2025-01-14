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
  pubDate: string;
  source: { id: string; name: string };
  title: string;
  link?: string | undefined;
  url?: string | undefined;
  urlToImage: string;
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

  if (!news) {
    return (
      <div>
        <Header path={category} />
        <div className="w-screen gap-2 flex flex-row items-center justify-center flex-wrap pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={i}
              className="w-[300px] sm:w-[600px] justify-center items-center flex flex-row  cursor-pointer"
            >
              <div className="w-[60%]">
                <div className="w-full items-center flex flex-col gap-3">
                  <Skeleton className="w-[300px] h-40 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header path={category} />
      <div className="w-screen gap-2 flex flex-row items-center justify-center flex-wrap pt-4">
        {news.articles.map((article: FetchedArticle) => (
          <News
            key={article.url}
            article={article}
            handleArticleClicked={handleArticleClicked}
            clickedArticleUrl={clickedArticleUrl}
            summaryMap={summaryMap}
            isSummaryLoading={isSummaryLoading}
            setIsSummaryLoading={setIsSummaryLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
