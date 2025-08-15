import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const router = useRouter();
  const { login: storeLogin, logout: storeLogout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email, password, complexId, schemaName, redirectTo) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, complexId, schemaName }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al iniciar sesión");
      }

      storeLogin(result.user, result.token);

      // Redirección basada en rol
      switch (result.user.role) {
        case "ADMIN":
          router.push(ROUTES.APP_ADMIN_DASHBOARD);
          break;
        case "COMPLEX_ADMIN":
          router.push(ROUTES.COMPLEX_ADMIN_DASHBOARD);
          break;
        case "RESIDENT":
          router.push(ROUTES.RESIDENT_DASHBOARD);
          break;
        case "RECEPTION":
          router.push(ROUTES.RECEPTION_DASHBOARD);
          break;
        default:
          router.push(ROUTES.HOME);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const registerComplex = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register-complex`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al registrar el conjunto");
      }

      storeLogin(result.user, result.token);
      router.push("/admin/complex-admin/admin-dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    storeLogout();
    router.push("/");
  };

  return { login, registerComplex, logout, loading, error };
}
