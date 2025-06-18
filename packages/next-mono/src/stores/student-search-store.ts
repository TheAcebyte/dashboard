import { getStudentFilterOptions } from "@/constants/filters";
import useParamState from "@/hooks/use-param-state";
import useValidateParamState from "@/hooks/use-validate-param-state";
import type { TranslationFunction } from "@/types/utils";
import { useTranslations } from "next-intl";
import { z } from "zod";

const getStudentFilterFieldEnum = (t: TranslationFunction<"filters">) => {
  const studentFilterOptions = getStudentFilterOptions(t);
  return z.enum(studentFilterOptions.map((option) => option.id));
};

export default function useStudentSearchStore() {
  const t = useTranslations("filters");
  const [searchField, pushSearchField] = useValidateParamState(
    "field",
    getStudentFilterFieldEnum(t),
    "name",
  );
  const [searchQuery, pushSearchQuery] = useParamState("query", "");

  return {
    searchField: searchField,
    setSearchField: pushSearchField,
    searchQuery: searchQuery,
    setSearchQuery: pushSearchQuery,
  };
}
