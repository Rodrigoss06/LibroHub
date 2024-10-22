import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const UsuarioDetallesPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      // Obtener los detalles del usuario desde la API
      const fetchUsuario = async () => {
        try {
          // Obtener el token JWT desde localStorage
          const token = localStorage.getItem('token');
          if (!token) {
            setError('No autorizado. Inicia sesión para acceder.');
            setLoading(false);
            return;
          }

          // Realizar la solicitud con el encabezado Authorization
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
    <div className="min-h-screen bg-gray-900 py-10 px-6 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-100">Detalles del Usuario</h1>
        
        {/* Detalles del usuario */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-300">Nombre:</h2>
            <p className="text-gray-400">{usuario?.nombre}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-300">Correo:</h2>
            <p className="text-gray-400">{usuario?.correo}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-300">Tipo de Usuario:</h2>
            <p className="text-gray-400">{usuario?.tipo}</p>
          </div>
        </div>

        <button
          onClick={() => router.back()}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-lg transition duration-300 ease-in-out"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default UsuarioDetallesPage;
