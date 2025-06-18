"use client";

import Select, { selectContext } from "@/components/ui/select";
import { getSessionStudentFilterOptions } from "@/constants/filters";
import useSessionStudentSearchStore from "@/stores/session-student-search-store";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ChangeEvent, useContext } from "react";

export default function SessionStudentSearchbar() {
  const tPage = useTranslations("attendance-page");
  const tFilters = useTranslations("filters");
  const sessionStudentFilterOptions = getSessionStudentFilterOptions(tFilters);

  const { searchField, setSearchField, searchQuery, setSearchQuery } =
    useSessionStudentSearchStore();
  const clearSearchQuery = () => setSearchQuery("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  return (
    <div className="flex flex-1 items-center gap-4 rounded-full border border-default-border px-4">
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
        placeholder={tPage("student-searchbar-placeholder")}
        className="min-w-0 flex-1 text-primary-fg outline-none placeholder:text-muted-fg"
        value={searchQuery}
        onChange={handleChange}
      />
      <Select
        options={sessionStudentFilterOptions}
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
