import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface Article {
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

type Props = {
  article: Article;
  handleArticleClicked: (articleUrl: string) => void;
  clickedArticleUrl: string | null;
  summaryMap: Record<string, string | null>;
  isSummaryLoading: boolean;
  setIsSummaryLoading: (loading: boolean) => void;
  closeArticleSummary: () => void;
};

const News = ({
  article,
  handleArticleClicked,
  clickedArticleUrl,
  summaryMap,
  isSummaryLoading,
  closeArticleSummary,
}: Props) => {
  console.log(clickedArticleUrl);
  return (
    <div
      key={article.url}
      className="w-[300px] sm:min-w-[700px] h-full sm:h-[450px] justify-center flex flex-col sm:flex-row "
    >
      <div className="sm:w-[50%] w-full h-full bg-zinc-200 border-zinc-100 border-2 flex rounded-md">
        <div className="w-full sm:w-[400px] h-full justify-between items-center flex flex-col gap-3">
          <img
            src={article.urlToImage}
            alt={article.title}
            width={400}
            height={300}
            className="rounded-t-md"
          />
          <h2 className="font-bold text-center text-md w-[300px]">
            {article.title}
          </h2>
          <p className="text-sm w-[300px] text-center mx-4">
            {article.description}
          </p>
          <div className="flex gap-2 pb-2 self-center">
            <Button asChild>
              <a href={article.url ?? ""} target="_blank" rel="noreferrer">
                {" "}
                Full Article
              </a>
            </Button>
            <Button
              onClick={() => handleArticleClicked(article.url ?? "")}
              onKeyUp={() => handleArticleClicked(article.url ?? "")}
            >
              Summarize
            </Button>
          </div>
        </div>
      </div>

      {/* only display summary of specific article */}
      {/* Show skeleton when processing */}
      {clickedArticleUrl === article.url && (
        <div className="sm:w-[50%] w-full h-full bg-white border-2 p-1 rounded-md flex flex-col justify-between overflow-y-scroll">
          {isSummaryLoading ? (
            <div className="h-full flex flex-col justify-start items-center space-y-3">
              <Skeleton className="w-[300px] h-40 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : null}
          {clickedArticleUrl === article.url && summaryMap[article.url] && (
            <div className="h-full">
              <div className="flex justify-between items-center p-1">
                <h3 className="font-bold text-md">News Summary:</h3>
                <Button
                  type="button"
                  onClick={() => closeArticleSummary()}
                  className="p-2 w-1 h-1 text-xs rounded-full"
                >
                  X
                </Button>
              </div>
              <p className="text-xs">{summaryMap[article.url]}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default News;
