"use client";

import Select, { selectContext } from "@/components/ui/select";
import { getGroupFilterOptions } from "@/constants/filters";
import { cn } from "@/lib/utils";
import useGroupSearchStore from "@/stores/group-search-store";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ChangeEvent, useContext } from "react";

interface Props {
  className?: string;
}

export default function GroupSearchbar({ className }: Props) {
  const tPage = useTranslations("database-page");
  const tFilters = useTranslations("filters");
  const groupFilterOptions = getGroupFilterOptions(tFilters);

  const { searchField, setSearchField, searchQuery, setSearchQuery } =
    useGroupSearchStore();
  const clearSearchQuery = () => setSearchQuery("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-full border border-default-border px-4",
        className,
      )}
    >
      {searchQuery == "" ? (
        <Search className="text-primary-fg" />
      ) : (
        <X
          className="cursor-pointer text-primary-fg hover:text-primary-hover-fg"
          onClick={clearSearchQuery}
        />
      )}
      <input
        type="text"
        placeholder={tPage("group-searchbar-placeholder")}
        className="min-w-0 flex-1 text-primary-fg outline-none placeholder:text-muted-fg"
        value={searchQuery}
        onChange={handleChange}
      />
      <Select
        options={groupFilterOptions}
        offsetX={16}
        value={searchField}
        setValue={setSearchField}
        className="gap-2"
      >
        <SelectLabel />
      </Select>
    </div>
  );
}

function SelectLabel() {
  const option = useContext(selectContext);
  if (!option) {
    throw new Error("SelectLabel must be placed inside a Select component.");
  }

  const t = useTranslations("filters");
  return (
    <p className="py-2 font-medium">
      {t("by")} {option}
    </p>
  );
}
