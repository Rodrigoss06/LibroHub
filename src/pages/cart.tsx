import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';

const CartPage = () => {
  const [carrito, setCarrito] = useState<any[]>([]);
  const [libros, setLibros] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    // Obtener el carrito desde el localStorage
    const carritoIds = JSON.parse(localStorage.getItem('carrito') || '[]');
    setCarrito(carritoIds);

    // Si el carrito no está vacío, obtener los detalles de los libros desde la API
    if (carritoIds.length > 0) {
      const fetchLibros = async () => {
        try {
          const response = await axios.get(`/api/libros`);
          const librosEnCarrito = response.data.libros.filter((libro: any) =>
            carritoIds.includes(libro.id)
          );
          setLibros(librosEnCarrito);
        } catch (error) {
          console.error('Error al obtener los libros:', error);
        }
      };
      fetchLibros();
    }
  }, []);

  useEffect(() => {
    // Calcular el total de los precios de los libros en el carrito
    const totalPrecio = libros.reduce((acc, libro) => acc + libro.precio, 0);
    setTotal(totalPrecio);
  }, [libros]);

  const eliminarDelCarrito = (libroId: string) => {
    const carritoActualizado = carrito.filter((id) => id !== libroId);
    setCarrito(carritoActualizado);
    localStorage.setItem('carrito', JSON.stringify(carritoActualizado));

    // También eliminar el libro de la visualización
    const librosActualizados = libros.filter((libro: any) => libro.id !== libroId);
    setLibros(librosActualizados);
  };

  if (carrito.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-4xl font-bold text-center mb-8">Tu carrito está vacío</h1>
          <div className="flex justify-center">
            <button
              onClick={() => router.push('/')}
              className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg"
            >
              Volver a la tienda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center text-tertiary mb-8">Tu Carrito</h1>

        {/* Tabla de libros en el carrito */}
        <div className="grid grid-cols-12 gap-4 mb-8 border-t border-tertiary pt-4">
          {/* Encabezados de la tabla */}
          <div className="col-span-5 text-xl font-semibold text-tertiary">Producto</div>
          <div className="col-span-3 text-xl font-semibold text-tertiary">Precio</div>
          <div className="col-span-2 text-xl font-semibold text-tertiary">Eliminar</div>

          {/* Filas de la tabla */}
          {libros.map((libro: any) => (
            <div key={libro.id} className="contents border-b border-primary p-4">
              <div className="col-span-5 flex items-center space-x-4">
                <img
                  src={libro.urlPhoto || 'https://via.placeholder.com/150'}
                  alt={libro.titulo}
                  className="w-16 h-16 object-cover rounded-none border border-primary"
                />
                <h2 className="text-lg font-medium text-accent">{libro.titulo}</h2>
              </div>
              <div className="col-span-3 flex items-center">
                <p className="text-lg font-bold">${libro.precio}</p>
              </div>
              <div className="col-span-2 flex items-center">
                <button
                  onClick={() => eliminarDelCarrito(libro.id)}
                  className="bg-error text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen del carrito */}
        <div className="mt-10 bg-secondary p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-background mb-4">Resumen del Carrito</h2>
          <p className="text-lg text-foreground">Total de artículos: {libros.length}</p>
          <p className="text-lg text-accent font-bold">Precio total: ${total.toFixed(2)}</p>
          <button className="mt-4 bg-highlight hover:bg-highlighthover text-white font-semibold py-3 px-6 rounded-lg">
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
