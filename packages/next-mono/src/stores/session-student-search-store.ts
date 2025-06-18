import { getSessionStudentFilterOptions } from "@/constants/filters";
import useParamState from "@/hooks/use-param-state";
import useValidateParamState from "@/hooks/use-validate-param-state";
import type { TranslationFunction } from "@/types/utils";
import { useTranslations } from "next-intl";
import { z } from "zod";

const getSessionStudentFilterFieldEnum = (
  t: TranslationFunction<"filters">,
) => {
  const sessionStudentFilterOptions = getSessionStudentFilterOptions(t);
  return z.enum(sessionStudentFilterOptions.map((option) => option.id));
};

export default function useSessionStudentSearchStore() {
  const t = useTranslations("filters");
  const [searchField, pushSearchField] = useValidateParamState(
    "field",
    getSessionStudentFilterFieldEnum(t),
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
