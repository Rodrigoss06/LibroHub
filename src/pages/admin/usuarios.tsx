import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import ModalUsuario from '@/components/ModalUsuario';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verificarUsuario = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/auth/validate', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data.usuario.tipo === 'ADMIN') {
            setIsAdmin(true);
            cargarUsuarios();
          } else {
            setIsAdmin(false);
          }
        } catch (err) {
          console.error('Error al verificar usuario:', err);
          setIsAdmin(false);
        } finally {
          setLoading(false);
        }
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    };

    verificarUsuario();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await axios.get('/api/usuarios');
      setUsuarios(response.data.usuarios);
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  };

  const handleEditarUsuario = (usuario: any) => {
    setUsuarioSeleccionado(usuario);
    setModalVisible(true);
  };

  const handleEliminarUsuario = async (usuarioId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await axios.delete(`/api/usuarios/${usuarioId}`);
        setUsuarios(usuarios.filter((usr) => usr.id !== usuarioId));
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
      }
    }
  };

  const handleGuardarUsuario = async (usuario: any) => {
    try {
      if (usuarioSeleccionado) {
        await axios.put(`/api/usuarios/${usuarioSeleccionado.id}`, usuario);
        setUsuarios(usuarios.map((u) => (u.id === usuarioSeleccionado.id ? usuario : u)));
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center text-white">Cargando...</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-center text-white">
        <div className="bg-gray-800 p-10 rounded-lg shadow-lg max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4">Acceso no autorizado</h1>
          <p className="text-lg mb-4">Lo sentimos, pero no tienes permiso para acceder a esta página.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Gestión de Usuarios</h1>

        {/* Tabla de usuarios */}
        <div className="grid grid-cols-12 gap-4 text-center">
          <div className="col-span-4 font-semibold">Nombre</div>
          <div className="col-span-4 font-semibold">Correo</div>
          <div className="col-span-2 font-semibold">Tipo</div>
          <div className="col-span-2 font-semibold">Acciones</div>

          {usuarios.map((usuario) => (
            <div key={usuario.id} className="contents border-b border-gray-700">
              <div className="col-span-4">{usuario.nombre}</div>
              <div className="col-span-4">{usuario.correo}</div>
              <div className="col-span-2">{usuario.tipo}</div>
              <div className="col-span-2 space-x-2">
                <button
                  onClick={() => handleEditarUsuario(usuario)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminarUsuario(usuario.id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para editar usuario */}
      {modalVisible && (
        <ModalUsuario
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleGuardarUsuario}
          usuario={usuarioSeleccionado}
        />
      )}
    </div>
  );
};

export default AdminUsuarios;
