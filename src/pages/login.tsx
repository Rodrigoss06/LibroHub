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
    <div className="min-h-screen bg-paper bg-cover bg-no-repeat flex items-center justify-center">
      <div className="bg-secondary p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">Iniciar sesión</h1>

        {/* Mostrar mensaje de éxito o error */}
        {message && (
          <div
            className={`py-2 px-4 rounded mb-4 text-center ${
              isSuccess ? 'bg-highlight text-white' : 'bg-error text-white'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-foreground">
              Correo electrónico
            </label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="w-full mt-1 p-3 bg-background text-foreground border border-primary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 p-3 bg-background text-foreground border border-primary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-highlight hover:bg-highlighthover text-white font-semibold py-3 rounded-lg shadow-lg transition duration-300 ease-in-out"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="text-center text-foreground mt-6">
          ¿No tienes una cuenta?{' '}
          <a href="/register" className="text-accent hover:text-highlight font-semibold">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
