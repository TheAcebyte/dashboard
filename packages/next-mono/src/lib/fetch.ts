import { cst } from "@/constants";
import { PaginatedGroupRecord } from "@/db/queries/groups";
import type { ActiveSessionResponse, Session } from "@/db/queries/sessions";
import { PaginatedStudentRecord } from "@/db/queries/students";
import { fetchAllPages, fetchPage } from "@/lib/paginate";

const studentEndpoint = new URL("/api/students", cst.APP_URL);
const groupEndpoint = new URL("/api/groups", cst.APP_URL);
const sessionEndpoint = new URL("/api/sessions", cst.APP_URL);

export async function fetchPicture(
  pictureUrl: string,
  options?: { name?: string; type?: string },
) {
  const response = await fetch(pictureUrl);
  const blob = await response.blob();
  return new File([blob], options?.name ?? "unnamed", { type: options?.type });
}

export async function fetchStudentsFromGroup(group: string, n: number) {
  const url = new URL(studentEndpoint);
  url.searchParams.set("group", group.toString());
  const response = await fetchPage<PaginatedStudentRecord>(url, 1, n + 1);

  return { total: response.total, students: response.data };
}

export async function fetchGroupOptions() {
  const data = await fetchAllPages<PaginatedGroupRecord>(groupEndpoint);
  const options = data.map((record) => ({
    id: record.groupId,
    label: record.name,
  }));
  return options;
}

export async function fetchGroupByName(name: string) {
  const url = new URL(groupEndpoint);
  url.searchParams.set("name", name);
  const response = await fetchPage<PaginatedGroupRecord>(url, 1, 1);
  const [group] = response.data;
  return group;
}

export async function fetchSessionById(sessionId: string) {
  const url = new URL(`${sessionEndpoint}/${sessionId}`);
  const response = await fetch(url);
  const data = await response.json();
  return data as Session;
}

export async function fetchActiveSessionByGroupId(groupId: string) {
  const url = new URL(`${groupEndpoint}/${groupId}/sessions/active`);
  const response = await fetch(url);
  const data = await response.json();
  return data as ActiveSessionResponse;
}

export async function fetchActiveSessionByGroupName(name: string) {
  const group = await fetchGroupByName(name);
  const session = await fetchActiveSessionByGroupId(group.groupId);
  return session;
}
