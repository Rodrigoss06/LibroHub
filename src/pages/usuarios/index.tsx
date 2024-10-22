import { useEffect, useState } from 'react';
import axios from 'axios';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Obtener la lista de usuarios desde la API
    const fetchUsuarios = async () => {
      const response = await axios.get('/api/usuarios');
      setUsuarios(response.data.usuarios);
    };
    fetchUsuarios();
  }, []);

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <ul>
        {usuarios.map((usuario:any) => (
          <li key={usuario.id}>
            <h2>{usuario.nombre}</h2>
            <p>Correo: {usuario.correo}</p>
            <a href={`/usuarios/${usuario.id}`}>Ver detalles</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsuariosPage;
