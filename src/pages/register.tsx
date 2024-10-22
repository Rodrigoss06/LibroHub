import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const RegisterPage = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(''); // Reset error message
    try {
      await axios.post('/api/auth/register', { nombre, correo, password });
      router.push('/login');
    } catch (error) {
      setError('Error al registrar el usuario. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-100">Crear cuenta</h1>

        {error && (
          <div className="bg-red-100 text-red-600 py-2 px-4 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-300">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full mt-1 p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-gray-300">
              Correo electrónico
            </label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="w-full mt-1 p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-300 ease-in-out"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="text-blue-400 hover:text-blue-500 font-semibold">
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
