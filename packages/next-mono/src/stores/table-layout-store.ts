import useValidateParamState from "@/hooks/use-validate-param-state";
import { z } from "zod";

const tableLayoutEnum = z.enum(["list", "card"]);

export default function useTableLayoutStore() {
  const [tableLayout, pushTableLayout] = useValidateParamState(
    "view",
    tableLayoutEnum,
    "list",
  );

  return {
    tableLayout: tableLayout,
    setTableLayout: pushTableLayout,
  };
}
