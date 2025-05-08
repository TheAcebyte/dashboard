import { cst } from "@/constants";
import { PaginatedGroupRecord } from "@/db/queries/groups";
import { fetchAllPages } from "@/lib/paginate";

const groupEndpoint = new URL("/api/groups", cst.APP_URL);

export async function fetchGroupOptions() {
  const data = await fetchAllPages<PaginatedGroupRecord>(groupEndpoint);
  const options = data.map((record) => ({
    id: record.groupId,
    label: record.name,
  }));
  return options;
}

export async function fetchPicture(
  pictureUrl: string,
  options?: { name?: string; type?: string },
) {
  const response = await fetch(pictureUrl);
  const blob = await response.blob();
  return new File([blob], options?.name ?? "unnamed", { type: options?.type });
}
