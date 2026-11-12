import { BACKEND_BASE_URL } from "@/components/constants";

type TeacherResponse<T> = { data: T };

export const teacherRequest = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  const baseUrl = BACKEND_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.replace(/^\//, "");
  const response = await fetch(`${baseUrl}/teacher/${normalizedPath}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const payload = await response.json().catch(() => ({})) as TeacherResponse<T> & { message?: string };
  if (!response.ok) {
    throw new Error(payload.message ?? "Não foi possível concluir a operação.");
  }
  return payload.data;
};
