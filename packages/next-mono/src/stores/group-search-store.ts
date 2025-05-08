import { groupFilterOptions } from "@/constants/filters";
import useParamState from "@/hooks/use-param-state";
import useValidateParamState from "@/hooks/use-validate-param-state";
import { z } from "zod";

const groupFilterFieldEnum = z.enum(
  groupFilterOptions.map((option) => option.id),
);

export default function useGroupSearchStore() {
  const [searchField, pushSearchField] = useValidateParamState(
    "field",
    groupFilterFieldEnum,
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
