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
    <div className="flex flex-1 items-center gap-4 rounded-full border border-gray-300 px-4">
      {searchQuery == "" ? (
        <Search className="text-zinc-900" />
      ) : (
        <X
          className="cursor-pointer text-zinc-900 hover:text-zinc-700"
          onClick={clearSearchQuery}
        />
      )}
      <input
        type="text"
        placeholder={tPage("student-searchbar-placeholder")}
        className="min-w-0 flex-1 text-zinc-900 outline-none placeholder:text-gray-400"
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
