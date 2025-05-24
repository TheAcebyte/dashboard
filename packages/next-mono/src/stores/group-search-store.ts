import { getGroupFilterOptions } from "@/constants/filters";
import useParamState from "@/hooks/use-param-state";
import useValidateParamState from "@/hooks/use-validate-param-state";
import type { TranslationFunction } from "@/types/utils";
import { useTranslations } from "next-intl";
import { z } from "zod";

const getGroupFilterFieldEnum = (t: TranslationFunction) => {
  const groupFilterOptions = getGroupFilterOptions(t);
  return z.enum(groupFilterOptions.map((option) => option.id));
};

export default function useGroupSearchStore() {
  const t = useTranslations("filters");
  const [searchField, pushSearchField] = useValidateParamState(
    "field",
    getGroupFilterFieldEnum(t),
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
