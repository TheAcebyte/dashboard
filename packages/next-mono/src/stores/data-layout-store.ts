import useValidateParamState from "@/hooks/use-validate-param-state";
import { z } from "zod";

const dataLayoutEnum = z.enum(["table", "card"]);

export default function useDataLayoutStore() {
  const [dataLayout, pushDataLayout] = useValidateParamState(
    "layout",
    dataLayoutEnum,
    "table",
  );

  return {
    dataLayout: dataLayout,
    setDataLayout: pushDataLayout,
  };
}
