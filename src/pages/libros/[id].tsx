import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const LibroDetallesPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [libro, setLibro] = useState<any>(null);

  useEffect(() => {
    if (id) {
      // Obtener los detalles del libro desde la API
      const fetchLibro = async () => {
        const response = await axios.get(`/api/libros/${id}`);
        setLibro(response.data.libro);
      };
      fetchLibro();
    }
  }, [id]);

  if (!libro) return <div>Cargando...</div>;

  return (
    <div>
      <h1>{libro.titulo}</h1>
      <p>{libro.descripcion}</p>
      <p>Autor: {libro.autor}</p>
      <p>Género: {libro.genero}</p>
      <p>Precio: ${libro.precio}</p>
      <p>Stock: {libro.stock}</p>
    </div>
  );
};

export default LibroDetallesPage;
