import React from "react";
import countries from "i18n-iso-countries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { languageCodes } from "@/constants/languageCodes";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
const countryCode = (languageCode: string) => {
  return countries.getName(languageCode.toUpperCase(), "en", {
    select: "official",
  });
};

const NewsSearch = (props: Props) => {
  return (
    <div className="w-full justify-center flex items-center flex-rolw gap-2 p-4">
      <h2 className="font-bold">Find News Headlines:</h2>
      <Input
        id="keyword"
        name="keyword"
        type="text"
        placeholder="Keyword"
        className="w-[200px]"
      />
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select news category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="business">Business</SelectItem>
          <SelectItem value="entertainment">Entertainment</SelectItem>
          <SelectItem value="general">General</SelectItem>
          <SelectItem value="health">Health</SelectItem>
          <SelectItem value="science">Science</SelectItem>
          <SelectItem value="sports">Sports</SelectItem>
          <SelectItem value="technology">Technology</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select news language" />
        </SelectTrigger>
        <SelectContent>
          {languageCodes.map(
            (name: string) =>
              countryCode(name) && (
                <SelectItem value={name} key={name}>
                  {name.toUpperCase()}: {countryCode(name)}
                </SelectItem>
              )
          )}
        </SelectContent>
      </Select>
      <Button>Search</Button>
    </div>
  );
};

export default NewsSearch;
