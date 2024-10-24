import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';

const UsuarioDetallesPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchUsuario = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setError('No autorizado. Inicia sesión para acceder.');
            setLoading(false);
            return;
          }

          const response = await axios.get(`/api/usuarios/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsuario(response.data.usuario);
        } catch (err) {
          setError('Error al cargar los datos del usuario.');
        } finally {
          setLoading(false);
        }
      };
      fetchUsuario();
    }
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>;

  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-10 flex justify-center items-center min-h-[70vh]">
        <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-100">Detalles del Usuario</h1>
          
          {/* Detalles del usuario */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-300">Nombre:</h2>
                <p className="text-lg text-gray-400">{usuario?.nombre}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-300">Correo:</h2>
                <p className="text-lg text-gray-400">{usuario?.correo}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-300">Tipo de Usuario:</h2>
                <p className="text-lg text-gray-400">{usuario?.tipo}</p>
              </div>
            </div>
          </div>

          {/* Favoritos */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-100">Favoritos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {usuario?.favoritos.map((fav: any) => (
                <div key={fav.libro.id} className="bg-gray-700 p-4 rounded-lg shadow-lg">
                  <img
                    src={fav.libro.urlPhoto || 'https://via.placeholder.com/150'}
                    alt={fav.libro.titulo}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-lg font-semibold text-white">{fav.libro.titulo}</h3>
                  <p className="text-sm text-gray-400">{fav.libro.autor}</p>
                  <p className="text-white mt-2">${fav.libro.precio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de Deseos */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-100">Lista de Deseos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {usuario?.listaDeseos.map((deseo: any) => (
                <div key={deseo.libro.id} className="bg-gray-700 p-4 rounded-lg shadow-lg">
                  <img
                    src={deseo.libro.urlPhoto || 'https://via.placeholder.com/150'}
                    alt={deseo.libro.titulo}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-lg font-semibold text-white">{deseo.libro.titulo}</h3>
                  <p className="text-sm text-gray-400">{deseo.libro.autor}</p>
                  <p className="text-white mt-2">${deseo.libro.precio}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => router.back()}
            className="mt-10 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-300 ease-in-out"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsuarioDetallesPage;
