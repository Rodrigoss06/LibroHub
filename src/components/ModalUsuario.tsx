import React, { useState, useEffect } from 'react';

interface ModalUsuarioProps {
  visible: boolean;
  onClose: () => void;
  onSave: (usuario: any) => void;
  usuario: any;
}

const ModalUsuario: React.FC<ModalUsuarioProps> = ({ visible, onClose, onSave, usuario }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [tipo, setTipo] = useState('');

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre || '');
      setCorreo(usuario.correo || '');
      setTipo(usuario.tipo || 'USUARIO');
    }
  }, [usuario]);

  const handleSave = () => {
    onSave({ ...usuario, nombre, correo, tipo });
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Editar Usuario</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Usuario</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ADMIN">Admin</option>
            <option value="USUARIO">Usuario</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalUsuario;
