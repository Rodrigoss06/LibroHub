import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const HomePage = () => {
  const [libros, setLibros] = useState([]);
  const [error, setError] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const router = useRouter();

  // Verificar si el usuario tiene un token y es válido
  useEffect(() => {
    const verificarUsuario = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/auth/validate', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsuario(response.data.usuario); // Usuario autenticado
        } catch (err) {
          // Si el token no es válido, remover el token
          localStorage.removeItem('token');
        }
      }
    };
    verificarUsuario();
  }, []);

  useEffect(() => {
    // Obtener todos los libros desde la API
    const fetchLibros = async () => {
      try {
        const response = await axios.get('/api/libros');
        setLibros(response.data.libros);
      } catch (err) {
        // Si ocurre un error, mostrar mensaje de error
        setError(true);
      }
    };
    fetchLibros();
  }, []);

  const eliminarLibro = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/libros/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLibros(libros.filter((libro:any) => libro.id !== id));
    } catch (err) {
      alert('Error al eliminar el libro.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-xl font-bold">LibroHub</div>
          <div>
            {usuario ? (
              <div className="flex items-center">
                <button
                  className="text-gray-300 hover:text-white"
                  onClick={() => router.push(`/usuario/${usuario.id}`)}
                >
                  <img
                    src="/user-icon.jpg"
                    alt="Usuario"
                    className="w-8 h-8 rounded-full"
                  />
                </button>
                <button
                  className="ml-4 text-gray-300 hover:text-white"
                  onClick={() => {
                    localStorage.removeItem('token');
                    setUsuario(null);
                    router.push('/login');
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <>
                <a href="/register" className="text-gray-300 hover:text-white mr-4">
                  Register
                </a>
                <a href="/login" className="text-gray-300 hover:text-white">
                  Login
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-8">Lista de Libros</h1>

        {error ? (
          // Mensaje de error si el servidor no responde
          <div className="text-center text-red-500">
            <p>Error al cargar los libros. Por favor, intenta nuevamente más tarde.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {libros.map((libro: any) => (
              <div key={libro.id} className="bg-gray-800 rounded-lg shadow-md p-6">
                <img
                  src="https://via.placeholder.com/150"
                  alt={libro.titulo}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-semibold">{libro.titulo}</h2>
                <p className="text-gray-400 mt-2">{libro.descripcion}</p>
                <p className="text-white mt-4 font-bold">Precio: ${libro.precio}</p>
                <div className="flex justify-between mt-4">
                  <a
                    href={`/libros/${libro.id}`}
                    className="text-blue-400 hover:text-blue-600 font-semibold"
                  >
                    Ver detalles
                  </a>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                    Agregar al carrito
                  </button>
                </div>
                {usuario && usuario.tipo === 'ADMIN' && (
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => router.push(`/libros/editar/${libro.id}`)}
                      className="text-yellow-400 hover:text-yellow-600 font-semibold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarLibro(libro.id)}
                      className="text-red-400 hover:text-red-600 font-semibold"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
