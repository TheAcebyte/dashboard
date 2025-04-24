import {
  findStudentsWithPagination,
  getStudentCount,
} from "@/db/queries/students";
import paginate from "@/lib/paginate";
import { notFound } from "next/navigation";

export async function GET(request: Request) {
  const result = await paginate(
    request.url,
    findStudentsWithPagination,
    getStudentCount,
  );

  if (!result.success) notFound();
  return Response.json(result.response);
}
