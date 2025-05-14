import { sessionStudentFilterOptions } from "@/constants/filters";
import useParamState from "@/hooks/use-param-state";
import useValidateParamState from "@/hooks/use-validate-param-state";
import { z } from "zod";

const sessionStudentFilterFieldEnum = z.enum(
  sessionStudentFilterOptions.map((option) => option.id),
);

export default function useSessionStudentSearchStore() {
  const [searchField, pushSearchField] = useValidateParamState(
    "field",
    sessionStudentFilterFieldEnum,
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
