import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage(''); // Reset message
    setIsSuccess(false); // Reset success state

    try {
      const response = await axios.post('/api/auth/login', { correo, password });
      localStorage.setItem('token', response.data.token);
      setIsSuccess(true);
      setMessage('Inicio de sesión exitoso. Redirigiendo...');
      setTimeout(() => {
        router.push(`/usuarios/${response.data.usuario.id}`);
      }, 2000); // Redirigir después de 2 segundos
    } catch (error) {
      setIsSuccess(false);
      setMessage('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-100">Iniciar sesión</h1>

        {/* Mostrar mensaje de éxito o error */}
        {message && (
          <div
            className={`py-2 px-4 rounded mb-4 text-center ${
              isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            Iniciar sesión
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          ¿No tienes una cuenta?{' '}
          <a href="/register" className="text-blue-400 hover:text-blue-500 font-semibold">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
