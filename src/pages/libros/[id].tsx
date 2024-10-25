import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';

const LibroDetallesPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [libro, setLibro] = useState<any>(null);
  const [librosRelacionados, setLibrosRelacionados] = useState<any[]>([]);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState<string>('');
  const [valoracion, setValoracion] = useState<number>(5);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const verificarUsuario = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/auth/validate', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsuario(response.data.usuario);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
    };
    verificarUsuario();
  }, []);

  useEffect(() => {
    if (id) {
      // Obtener los detalles del libro desde la API
      const fetchLibro = async () => {
        try {
          const response = await axios.get(`/api/libros/${id}`);
          setLibro(response.data.libro);
        } catch (error) {
          console.error('Error al obtener el libro:', error);
        }
      };
      fetchLibro();

      // Obtener libros relacionados (o todos los libros) para la lista inferior
      const fetchLibrosRelacionados = async () => {
        try {
          const response = await axios.get('/api/libros');
          setLibrosRelacionados(response.data.libros);
        } catch (error) {
          console.error('Error al obtener los libros relacionados:', error);
        }
      };
      fetchLibrosRelacionados();

      // Obtener comentarios del libro
      const fetchComentarios = async () => {
        try {
          const response = await axios.get(`/api/comentarios/${id}`);
          setComentarios(response.data.comentarios);
        } catch (error) {
          console.error('Error al obtener los comentarios:', error);
        }
      };
      fetchComentarios();
    }
  }, [id]);

  const agregarComentario = async () => {
    if (nuevoComentario.trim() === '' || !valoracion || !usuario) return;
    try {
      await axios.post(
        '/api/comentarios',
        {
          contenido: nuevoComentario,
          valoracion,
          libroId: id,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setNuevoComentario('');
      setValoracion(5);
      const response = await axios.get(`/api/comentarios/${id}`);
      setComentarios(response.data.comentarios);
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  const agregarAFavoritos = async () => {
    if (!usuario) {
      alert('Inicia sesión para agregar a favoritos');
      return;
    }
    try {
      await axios.post(
        '/api/favoritos',
        { libroId: id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Libro agregado a favoritos');
    } catch (error) {
      console.error('Error al agregar a favoritos:', error);
    }
  };

  const agregarAListaDeseos = async () => {
    if (!usuario) {
      alert('Inicia sesión para agregar a la lista de deseos');
      return;
    }
    try {
      await axios.post(
        '/api/listaDeseos',
        { libroId: id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Libro agregado a la lista de deseos');
    } catch (error) {
      console.error('Error al agregar a la lista de deseos:', error);
    }
  };

  if (!libro) return <div className="flex justify-center items-center h-screen">Cargando...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <Navbar />

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl w-full bg-secondary rounded-lg shadow-retro p-8 mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Imagen del libro */}
            <div className="w-full md:w-1/3">
              <img
                src={libro.urlPhoto || 'https://via.placeholder.com/300'}
                alt={libro.titulo}
                className="w-full h-auto object-cover rounded-none border border-retro"
              />
            </div>
            {/* Detalles del libro */}
            <div className="w-full md:w-2/3 flex flex-col justify-between">
              <h1 className="text-3xl md:text-4xl font-bold text-background mb-4">{libro.titulo}</h1>
              <p className="text-lg mb-4">
                <strong>Autor:</strong> {libro.autor}
              </p>
              <p className="text-lg mb-4">{libro.descripcion}</p>
              <p className="text-lg mb-4">
                <strong>Precio:</strong> ${libro.precio}
              </p>

              {/* Botones para favoritos y lista de deseos */}
              {usuario && (
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={agregarAFavoritos}
                    className="bg-highlight text-white px-4 py-2 rounded-lg hover:bg-accent"
                  >
                    Agregar a Favoritos
                  </button>
                  <button
                    onClick={agregarAListaDeseos}
                    className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-highlight"
                  >
                    Agregar a Lista de Deseos
                  </button>
                </div>
              )}

              <button
                onClick={() => router.push('/libros')}
                className="mt-6 w-full bg-primary hover:bg-tertiary text-white font-semibold py-3 rounded-lg transition duration-300"
              >
                Volver a la lista de libros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de libros relacionados con scroll horizontal */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-tertiary mb-4">Libros relacionados</h2>
          <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
            {librosRelacionados.map((libroRelacionado) => (
              <div
                key={libroRelacionado.id}
                className="min-w-[200px] max-w-[200px] bg-secondary rounded-lg shadow-retro p-4"
              >
                <img
                  src={libroRelacionado.urlPhoto || 'https://via.placeholder.com/150'}
                  alt={libroRelacionado.titulo}
                  className="w-full h-40 object-cover rounded-none mb-2 border border-retro"
                />
                <h3 className="text-lg font-semibold text-background">{libroRelacionado.titulo}</h3>
                <p className="text-sm text-foreground">{libroRelacionado.autor}</p>
                <a
                  href={`/libros/${libroRelacionado.id}`}
                  className="text-highlight hover:text-accent mt-2 block"
                >
                  Ver detalles
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de comentarios */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-tertiary mb-4">Comentarios</h2>
          <div className="space-y-4">
            {comentarios.map((comentario) => (
              <div key={comentario.id} className="bg-secondary p-4 rounded-lg shadow-retro">
                <p>
                  <strong>{comentario.usuario.nombre}</strong> -{' '}
                  <span className="text-yellow-400">{comentario.valoracion}/5</span>
                </p>
                <p>{comentario.contenido}</p>
                <span className="text-sm text-foreground">{comentario.fecha}</span>
              </div>
            ))}
          </div>

          {/* Solo mostrar el formulario de comentarios si el usuario está autenticado */}
          {usuario && (
            <div className="mt-6">
              <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                rows={4}
                className="w-full bg-secondary text-foreground p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Escribe tu comentario..."
              ></textarea>
              <div className="mt-4">
                <label htmlFor="valoracion" className="text-secondary block mb-2">
                  Valoración:
                </label>
                <input
                  id="valoracion"
                  type="number"
                  min="1"
                  max="5"
                  value={valoracion}
                  onChange={(e) => setValoracion(Number(e.target.value))}
                  className="bg-secondary text-foreground p-2 rounded-lg"
                />
              </div>
              <button
                onClick={agregarComentario}
                className="mt-4 bg-primary hover:bg-tertiary text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
              >
                Enviar comentario
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibroDetallesPage;
