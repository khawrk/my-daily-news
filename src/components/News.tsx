import React from "react";
import Image from "next/image";

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

type Props = {
  article: Article;
  handleArticleClicked: (articleUrl: string) => void;
  clickedArticleUrl: string | null;
  summaryMap: Record<string, string | null>;
};

const News = ({
  article,
  handleArticleClicked,
  clickedArticleUrl,
  summaryMap,
}: Props) => {
  return (
    <div
      key={article.url}
      className="flex flex-row w-full gap-4 cursor-pointer"
      onClick={() => handleArticleClicked(article.url)}
      onKeyUp={() => handleArticleClicked(article.url)}
    >
      <div className="w-[60%]">
        <Image
          src={article.urlToImage}
          alt={article.title}
          width={400}
          height={200}
          priority
        />
        <h2>Title: {article.title}</h2>
        <p>Description: {article.description}</p>
      </div>
      {/* only display summary of specific article */}
      {clickedArticleUrl === article.url && summaryMap[article.url] && (
        <div className="w-[40%]">
          <h3>News Summary:</h3>
          <p>{summaryMap[article.url]}</p>
        </div>
      )}
    </div>
  );
};

export default News;
