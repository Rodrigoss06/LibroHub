import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

// Inicializar Prisma Client
const prisma = new PrismaClient();

// Definir el tipo para la respuesta
interface Response {
  message?: string;
  libro?: any;
  error?: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Obtener un libro por su ID
    try {
      const libro = await prisma.libro.findUnique({ where: { id: String(id) } });
      if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
      res.status(200).json({ libro });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el libro', error });
    }
  } else if (req.method === 'PUT') {
    // Actualizar un libro
    const { titulo, autor, genero, precio, descripcion, stock } = req.body;

    // Validar que todos los campos obligatorios estén presentes
    if (!titulo || !autor || !genero || !precio || !descripcion || typeof stock !== 'number') {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
      const libroActualizado = await prisma.libro.update({
        where: { id: String(id) },
        data: { titulo, autor, genero, precio, descripcion, stock },
      });
      res.status(200).json({ libro: libroActualizado });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el libro', error });
    }
  } else if (req.method === 'DELETE') {
    // Eliminar un libro por su ID
    try {
      await prisma.libro.delete({ where: { id: String(id) } });
      res.status(200).json({ message: 'Libro eliminado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el libro', error });
    }
  } else {
    // Si el método HTTP no es GET, PUT o DELETE
    res.status(405).json({ message: 'Método no permitido' });
  }
}
