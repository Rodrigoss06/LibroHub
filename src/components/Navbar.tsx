import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [carritoCount, setCarritoCount] = useState(0); // Estado para contar los productos en el carrito
  const router = useRouter();

  useEffect(() => {
    const verificarUsuario = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/auth/validate', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsuario(response.data.usuario);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
    };
    verificarUsuario();
  }, []);

  useEffect(() => {
    // Obtener el carrito del localStorage y contar los productos
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    setCarritoCount(carrito.length);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Icono de LibroHub */}
        <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
          <img
            src="/librohub-icon.jpg" // Asegúrate de que el ícono esté en la carpeta public
            alt="LibroHub"
            className="w-10 h-10 mr-2" // Ajusta el tamaño del ícono
          />
          <div className="text-xl font-bold text-white">LibroHub</div>
        </div>

        <div className="flex items-center">
          {/* Icono del carrito */}
          <div
            className="relative flex items-center cursor-pointer"
            onClick={() => router.push('/cart')}
          >
            {/* Espacio para tu ícono SVG */}
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5H19m-5 13a2 2 0 100-4 2 2 0 000 4zm-6 0a2 2 0 100-4 2 2 0 000 4z"></path>
            </svg>
            {/* Contador de productos en el carrito */}
            {carritoCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {carritoCount}
              </span>
            )}
          </div>

          {/* Opciones del usuario */}
          {usuario ? (
            <div className="flex items-center ml-4">
              <button
                className="text-gray-300 hover:text-white"
                onClick={() => router.push(`/usuarios/${usuario.id}`)}
              >
                <img
                  src="/user-icon.jpg"
                  alt="Usuario"
                  className="w-8 h-8 rounded-full"
                />
              </button>
              <button
                className="ml-4 text-gray-300 hover:text-white"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="ml-4">
              <a href="/register" className="text-gray-300 hover:text-white mr-4">
                Register
              </a>
              <a href="/login" className="text-gray-300 hover:text-white">
                Login
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
