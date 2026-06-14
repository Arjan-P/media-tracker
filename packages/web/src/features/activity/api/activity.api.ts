import { api } from "@/lib/api";
import { ActivityLogEntry, PaginatedResponse } from "@media-tracker/shared";

export async function listActivity(params: { page?: number; limit?: number }) {
  const res = await api.get<PaginatedResponse<ActivityLogEntry>>(
    "/api/activity",
    { params },
  );
  return res.data;
}
