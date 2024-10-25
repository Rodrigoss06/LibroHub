import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const RegisterPage = () => {
  const [nombre, setNombre] = useState('');
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
      const response = await axios.post('/api/auth/register', { nombre, correo, password });
      setIsSuccess(true);
      localStorage.setItem('token', response.data.token);
      setMessage('Registro exitoso. Redirigiendo a la página de login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000); 
    } catch (error) {
      setIsSuccess(false);
      setMessage('Error al registrar el usuario. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-paper bg-cover bg-no-repeat flex items-center justify-center">
      <div className="bg-secondary p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">Crear cuenta</h1>

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
            <label htmlFor="nombre" className="block text-sm font-medium text-foreground">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full mt-1 p-3 bg-background text-foreground border border-primary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
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
            Registrarse
          </button>
        </form>

        <p className="text-center text-foreground mt-6">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="text-accent hover:text-highlight font-semibold">
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
