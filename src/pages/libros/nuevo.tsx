import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const NuevoLibroPage = () => {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [genero, setGenero] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');
  const router = useRouter();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      await axios.post('/api/libros', {
        titulo, autor, genero, precio, descripcion, stock: parseInt(stock),
      });
      router.push('/');
    } catch (error) {
      alert('Error al agregar el libro');
    }
  };

  return (
    <div>
      <h1>Agregar nuevo libro</h1>
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
        <button type="submit">Agregar libro</button>
      </form>
    </div>
  );
};

export default NuevoLibroPage;
