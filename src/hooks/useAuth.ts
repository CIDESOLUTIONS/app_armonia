import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const router = useRouter();
  const { login: storeLogin } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al iniciar sesión");
      }

      storeLogin(result.user, result.token);

      // Redirección basada en rol
      switch (result.user.role) {
        case "ADMIN":
          router.push("/admin/app-admin/dashboard");
          break;
        case "COMPLEX_ADMIN":
          router.push("/admin/complex-admin/admin-dashboard");
          break;
        case "RESIDENT":
          router.push("/resident/resident-dashboard");
          break;
        case "RECEPTION":
          router.push("/reception/reception/reception-dashboard");
          break;
        default:
          router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
