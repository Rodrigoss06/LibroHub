import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";

const HomePage = () => {
  const [libros, setLibros] = useState([]);
  const [error, setError] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const verificarUsuario = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("/api/auth/validate", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsuario(response.data.usuario);
        } catch (err) {
          localStorage.removeItem("token");
        }
      }
    };
    verificarUsuario();
  }, []);

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const response = await axios.get("/api/libros");
        setLibros(response.data.libros);
      } catch (err) {
        setError(true);
      }
    };
    fetchLibros();
  }, []);

  // Función para agregar al carrito
  const agregarAlCarrito = (libroId: string) => {
    // Obtener el carrito actual del localStorage (si no existe, se crea un array vacío)
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

    // Verificar si el libro ya está en el carrito
    if (!carrito.includes(libroId)) {
      // Agregar el libro al carrito
      carrito.push(libroId);
      // Guardar el carrito actualizado en el localStorage
      localStorage.setItem("carrito", JSON.stringify(carrito));
      alert("Libro agregado al carrito");
    } else {
      alert("El libro ya está en el carrito");
    }
  };

  const eliminarLibro = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/libros/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLibros(libros.filter((libro: any) => libro.id !== id));
    } catch (err) {
      alert("Error al eliminar el libro.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-8">Lista de Libros</h1>

        {error ? (
          <div className="text-center text-red-500">
            <p>
              Error al cargar los libros. Por favor, intenta nuevamente más
              tarde.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {libros.map((libro: any) => (
              <div
                key={libro.id}
                className="bg-gray-800 rounded-lg shadow-md p-6"
              >
                <img
                  src={libro.urlPhoto}
                  alt={libro.titulo}
                  className="w-full h-[500px] object-cover rounded-lg mb-4" // Cambié la altura de la imagen a 72 para mostrar más de la portada
                />
                <h2 className="text-2xl font-semibold">{libro.titulo}</h2>
                <p className="text-gray-400 mt-2">{libro.descripcion}</p>
                <p className="text-white mt-4 font-bold">
                  Precio: ${libro.precio}
                </p>

                <div className="flex justify-between mt-4">
                  <a
                    href={`/libros/${libro.id}`}
                    className="text-blue-400 hover:text-blue-600 font-semibold"
                  >
                    Ver detalles
                  </a>
                  <button
                    onClick={() => agregarAlCarrito(libro.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Agregar al carrito
                  </button>
                </div>

                {usuario && usuario.tipo === "ADMIN" && (
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => router.push(`/libros/editar/${libro.id}`)}
                      className="text-yellow-400 hover:text-yellow-600 font-semibold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarLibro(libro.id)}
                      className="text-red-400 hover:text-red-600 font-semibold"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
