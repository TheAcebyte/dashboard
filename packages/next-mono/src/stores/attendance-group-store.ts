import useParamState from "@/hooks/use-param-state";

export default function useAttendanceGroupStore() {
  const [group, pushGroup] = useParamState("group", "");

  return {
    group: group,
    setGroup: pushGroup,
  };
}
