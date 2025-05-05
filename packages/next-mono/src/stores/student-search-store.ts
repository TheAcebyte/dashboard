import { studentFilterOptions } from "@/constants/filters";
import useParamState from "@/hooks/use-param-state";
import useValidateParamState from "@/hooks/use-validate-param-state";
import { z } from "zod";

const studentFilterFieldEnum = z.enum(
  studentFilterOptions.map((option) => option.id),
);

export default function useStudentSearchStore() {
  const [searchField, pushSearchField] = useValidateParamState(
    "field",
    studentFilterFieldEnum,
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
