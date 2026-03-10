import { useState } from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { formatToLocalDate } from "@/hooks/formatTime";
import { ArrowRight, X, Plus, Minus } from "lucide-react";

interface Article {
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

type Props = {
  article: Article;
  handleArticleClicked: (articleUrl: string) => void;
  clickedArticleUrl: string | null;
  summaryMap: Record<string, string | null>;
  isSummaryLoading: boolean;
  setIsSummaryLoading: (loading: boolean) => void;
  closeArticleSummary: () => void;
};

type textOptions = "xs" | "sm" | "base" | "lg" | "xl";

const News = ({
  article,
  handleArticleClicked,
  clickedArticleUrl,
  summaryMap,
  isSummaryLoading,
  closeArticleSummary,
}: Props) => {
  const [textSize, setTextSize] = useState<textOptions>("sm");
  const [imageError, setImageError] = useState(false);
  
  const increaseTextSize = () => {
    if (textSize === "xl") return;
    setTextSize((prev) => {
      switch (prev) {
        case "xs": return "sm";
        case "sm": return "base";
        case "base": return "lg";
        case "lg": return "xl";
        default: return "sm";
      }
    });
  };
  
  const decreaseTextSize = () => {
    if (textSize === "xs") return;
    setTextSize((prev) => {
      switch (prev) {
        case "sm": return "xs";
        case "base": return "sm";
        case "lg": return "base";
        case "xl": return "lg";
        default: return "sm";
      }
    });
  };

  const isExpanded = clickedArticleUrl === article.url;

  return (
    <article className="group w-full">
      <div className={`flex flex-col lg:flex-row gap-0 transition-all duration-300 ${isExpanded ? 'lg:gap-0' : ''}`}>
        {/* Main Card */}
        <div className={`relative bg-card rounded-lg overflow-hidden border border-border transition-all duration-300 hover:border-primary/30 ${isExpanded ? 'lg:w-1/2' : 'w-full'}`}>
          {/* Image Section */}
          <div className="relative aspect-[16/10] overflow-hidden">
            {!imageError && article.urlToImage ? (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No image available</span>
              </div>
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            
            {/* Date Badge */}
            <div className="absolute top-4 left-4">
              <span className="text-xs uppercase tracking-widest text-primary/80 font-medium">
                {article.publishedAt ? formatToLocalDate(article.publishedAt.toString()) : "Recent"}
              </span>
            </div>
            
            {/* Source Badge */}
            {article.source?.name && (
              <div className="absolute top-4 right-4">
                <span className="text-xs text-muted-foreground bg-background/60 backdrop-blur-sm px-2 py-1 rounded">
                  {article.source.name}
                </span>
              </div>
            )}
          </div>
          
          {/* Content Section */}
          <div className="p-5 sm:p-6 space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl leading-tight text-card-foreground line-clamp-3 text-balance">
              {article.title}
            </h2>
            
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {article.description}
            </p>
            
            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                asChild
                variant="ghost"
                className="text-primary hover:text-primary hover:bg-primary/10 px-0 group/btn"
              >
                <a href={article.url ?? ""} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                  Read Full Article
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </a>
              </Button>
              
              <Button
                onClick={() => handleArticleClicked(article.url ?? "")}
                variant="secondary"
                className="bg-secondary hover:bg-muted text-secondary-foreground"
              >
                {isExpanded ? "Hide Summary" : "Summarize"}
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Panel */}
        {isExpanded && (
          <div className="lg:w-1/2 bg-secondary/50 border border-border lg:border-l-0 rounded-lg lg:rounded-l-none overflow-hidden animate-in slide-in-from-right-5 duration-300">
            <div className="p-5 sm:p-6 h-full flex flex-col">
              {/* Summary Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="font-serif text-lg text-card-foreground">Summary</h3>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={decreaseTextSize}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    onClick={increaseTextSize}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    onClick={closeArticleSummary}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Summary Content */}
              <div className="flex-1 overflow-y-auto pt-4">
                {isSummaryLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full bg-muted" />
                    <Skeleton className="h-4 w-[90%] bg-muted" />
                    <Skeleton className="h-4 w-[95%] bg-muted" />
                    <Skeleton className="h-4 w-[85%] bg-muted" />
                    <Skeleton className="h-4 w-[80%] bg-muted" />
                  </div>
                ) : summaryMap[article.url ?? ""] ? (
                  <p className={`text-${textSize} text-card-foreground leading-relaxed`}>
                    {summaryMap[article.url ?? ""]}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default News;
