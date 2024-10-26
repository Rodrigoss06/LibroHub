import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/components/Modal';
import Navbar from '@/components/Navbar'; // Asegúrate de que la ruta sea correcta
import { useRouter } from 'next/router';

const AdminProductos = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verificarUsuario = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/auth/validate', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.usuario.tipo === 'ADMIN') {
          setIsAdmin(true);
          cargarProductos();
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Error al verificar usuario:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    verificarUsuario();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await axios.get('/api/libros');
      setProductos(response.data.libros);
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  };

  const handleAgregarProducto = () => {
    setProductoSeleccionado(null);
    setIsEditMode(false);
    setModalVisible(true);
  };

  const handleEditarProducto = (producto: any) => {
    setProductoSeleccionado(producto);
    setIsEditMode(true);
    setModalVisible(true);
  };

  const handleEliminarProducto = async (productoId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await axios.delete(`/api/libros/${productoId}`);
        setProductos(productos.filter((prod) => prod.id !== productoId));
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    }
  };

  const handleGuardarProducto = async (producto: any) => {
    try {
      if (isEditMode) {
        await axios.put(`/api/libros/${productoSeleccionado.id}`, producto);
        setProductos(productos.map((p) => (p.id === productoSeleccionado.id ? producto : p)));
      } else {
        const response = await axios.post('/api/libros', producto);
        setProductos([...productos, response.data.libro]);
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
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
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar /> {/* Navbar agregado */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Gestión de Productos</h1>
        <button
          onClick={handleAgregarProducto}
          className="mb-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
        >
          Agregar Producto
        </button>

        {/* Tabla de productos con borde */}
        <div className="grid grid-cols-12 gap-4 text-center border border-gray-700 rounded-lg p-4">
          <div className="col-span-3 font-semibold">Imagen</div>
          <div className="col-span-3 font-semibold">Título</div>
          <div className="col-span-2 font-semibold">Precio</div>
          <div className="col-span-2 font-semibold">Stock</div>
          <div className="col-span-2 font-semibold">Acciones</div>

          {productos.map((producto) => (
            <div key={producto.id} className="contents border-t border-gray-700">
              <div className="col-span-3 flex items-center justify-center">
                <img
                  src={producto.urlPhoto || 'https://via.placeholder.com/150'}
                  alt={producto.titulo}
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
              <div className="col-span-3">{producto.titulo}</div>
              <div className="col-span-2">${producto.precio}</div>
              <div className="col-span-2">{producto.stock}</div>
              <div className="col-span-2 space-x-2">
                <button
                  onClick={() => handleEditarProducto(producto)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminarProducto(producto.id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para agregar/editar producto */}
      {modalVisible && (
        <Modal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleGuardarProducto}
          producto={isEditMode ? productoSeleccionado : null}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
};

export default AdminProductos;
