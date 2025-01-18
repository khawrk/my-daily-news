import { Badge } from "./ui/badge";
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
    <div className="sticky top-0 bg-white flex flex-row gap-2 justify-between w-full text-xl p-4 border-b-2 z-10">
      <div className="flex flex-row gap-2">
        <h1 className="text-3xl font-bold text-center">Briefly</h1>
        <p className="self-end text-sm hidden sm:inline-block">
          Stay Up to Date. News, Simplified
        </p>
        {path ? (
          <Badge variant="outline" className="h-6 bg-zinc-200">
            {path.charAt(0).toUpperCase() + path.slice(1)}
          </Badge>
        ) : (
          <Badge variant="outline" className="h-6 bg-zinc-200">
            World
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Select
          defaultValue={path}
          onValueChange={(value) => router.push(`/${value}`)}
        >
          <SelectTrigger className="w-[150px] sm:w-[200px]">
            <SelectValue placeholder="World" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="world">World</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="asia">Asia</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Header;
