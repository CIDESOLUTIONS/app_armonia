import Link from 'next/link';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">403</h1>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Acceso Denegado</h2>
        <p className="text-gray-600 mb-6">
          No tienes los permisos necesarios para acceder a esta página.
        </p>
        <Link href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
