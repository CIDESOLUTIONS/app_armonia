// src/app/(public)/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('Español');

  useEffect(() => {
    if (isLoggedIn) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError(language === 'Español'
        ? 'Por favor, completa todos los campos.'
        : 'Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(formData.email, formData.password);
    } catch (err) {
      console.error('[Login] Error:', err);
      setError(language === 'Español'
        ? 'Credenciales inválidas'
        : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
            {language === 'Español' ? 'Iniciar Sesión' : 'Log In'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">
                {language === 'Español' ? 'Email' : 'Email'}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
                className="mt-1"
                placeholder={language === 'Español' ? 'Tu correo electrónico' : 'Your email'}
              />
            </div>

            <div>
              <Label htmlFor="password">
                {language === 'Español' ? 'Contraseña' : 'Password'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
                className="mt-1"
                placeholder={language === 'Español' ? 'Tu contraseña' : 'Your password'}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-10"
              disabled={loading}
            >
              {loading 
                ? (language === 'Español' ? 'Iniciando sesión...' : 'Logging in...')
                : (language === 'Español' ? 'Iniciar Sesión' : 'Log In')}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => router.push(ROUTES.HOME)}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                {language === 'Español' ? 'Volver al inicio' : 'Back to home'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}