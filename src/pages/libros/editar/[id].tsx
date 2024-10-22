import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';

const EditarLibroPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [genero, setGenero] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (id) {
      // Obtener los datos del libro a editar
      const fetchLibro = async () => {
        const response = await axios.get(`/api/libros/${id}`);
        const libro = response.data.libro;
        setTitulo(libro.titulo);
        setAutor(libro.autor);
        setGenero(libro.genero);
        setPrecio(libro.precio);
        setDescripcion(libro.descripcion);
        setStock(libro.stock);
      };
      fetchLibro();
    }
  }, [id]);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      await axios.put(`/api/libros/${id}`, {
        titulo, autor, genero, precio, descripcion, stock: parseInt(stock),
      });
      router.push('/');
    } catch (error) {
      alert('Error al actualizar el libro');
    }
  };

  return (
    <div>
      <h1>Editar libro</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Autor</label>
          <input
            type="text"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Género</label>
          <input
            type="text"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Precio</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <button type="submit">Actualizar libro</button>
      </form>
    </div>
  );
};

export default EditarLibroPage;
