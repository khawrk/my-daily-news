import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface Props {
  path?: string | undefined;
}

const Header = ({ path }: Props) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-4 sm:gap-8">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              Briefly
            </h1>
            <nav className="hidden sm:flex items-center gap-1">
              <span className="text-muted-foreground text-sm tracking-wide uppercase">
                {path ? path.charAt(0).toUpperCase() + path.slice(1) : "World"}
              </span>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <p className="hidden lg:block text-sm text-muted-foreground italic">
              News, Simplified
            </p>
            <Select
              defaultValue={path || "world"}
              onValueChange={(value) => router.push(`/${value}`)}
            >
              <SelectTrigger className="w-[140px] sm:w-[180px] bg-secondary border-border text-secondary-foreground hover:bg-muted transition-colors">
                <SelectValue placeholder="World" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="world" className="focus:bg-muted">World</SelectItem>
                <SelectItem value="business" className="focus:bg-muted">Business</SelectItem>
                <SelectItem value="entertainment" className="focus:bg-muted">Entertainment</SelectItem>
                <SelectItem value="technology" className="focus:bg-muted">Technology</SelectItem>
                <SelectItem value="asia" className="focus:bg-muted">Asia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
