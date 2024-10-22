import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const UsuarioDetallesPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    if (id) {
      // Obtener los detalles del usuario desde la API
      const fetchUsuario = async () => {
        const response = await axios.get(`/api/usuarios/${id}`);
        setUsuario(response.data);
      };
      fetchUsuario();
    }
  }, [id]);

  if (!usuario) return <div>Cargando...</div>;

  return (
    <div>
      <h1>{usuario.nombre}</h1>
      <p>Correo: {usuario.correo}</p>
      <p>Tipo: {usuario.tipo}</p>
    </div>
  );
};

export default UsuarioDetallesPage;
