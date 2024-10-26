import { useState, useEffect } from 'react';

const Modal = ({ visible, onClose, onSave, producto, isEditMode }: any) => {
  const [titulo, setTitulo] = useState('');
  const [precio, setPrecio] = useState(0);
  const [stock, setStock] = useState(0);
  const [urlPhoto, setUrlPhoto] = useState('');

  useEffect(() => {
    if (producto && isEditMode) {
      setTitulo(producto.titulo);
      setPrecio(producto.precio);
      setStock(producto.stock);
      setUrlPhoto(producto.urlPhoto || '');
    }
  }, [producto, isEditMode]);

  const handleGuardar = () => {
    const nuevoProducto = { titulo, precio, stock, urlPhoto };
    onSave(nuevoProducto);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Editar Producto' : 'Agregar Producto'}</h2>
        <div className="mb-4">
          <label className="block">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block ">Precio</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block ">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block ">URL de la Foto</label>
          <input
            type="text"
            value={urlPhoto}
            onChange={(e) => setUrlPhoto(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            {isEditMode ? 'Guardar Cambios' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
