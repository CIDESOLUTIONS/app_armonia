// src/components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Guardar el token y la información del usuario en el store de Zustand
      setUser(data.user, data.token);
      toast({
        title: "Inicio de sesión exitoso",
        description: "Redirigiendo...",
      });

      // Redirigir según el rol del usuario
      switch (data.user.role) {
        case "ADMIN":
        case "COMPLEX_ADMIN":
          router.push("/admin/dashboard");
          break;
        case "RESIDENT":
          router.push("/resident/dashboard");
          break;
        case "RECEPTION":
          router.push("/reception/dashboard");
          break;
        case "APP_ADMIN":
          router.push("/app-admin/dashboard");
          break;
        default:
          router.push("/portal-selector");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Error al iniciar sesión");
      toast({
        title: "Error",
        description: err.message || "Error al iniciar sesión",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && (
        <div
          data-testid="error-message"
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
          {error}
        </div>
      )}

      <div>
        <input
          data-testid="email-input"
          type="email"
          required
          className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </div>

      <div>
        <input
          data-testid="password-input"
          type="password"
          required
          className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Contraseña"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
      </div>

      <div>
        <button
          data-testid="login-button"
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Iniciar sesión
        </button>
      </div>
    </form>
  );
}
