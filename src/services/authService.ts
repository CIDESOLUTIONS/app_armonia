import { fetchApi } from "@/lib/api";

export async function requestPasswordReset(
  email: string,
): Promise<{ message: string }> {
  return fetchApi("/auth/request-password-reset", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  password: string,
  token: string,
): Promise<{ message: string }> {
  return fetchApi("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ password, token }),
  });
}
