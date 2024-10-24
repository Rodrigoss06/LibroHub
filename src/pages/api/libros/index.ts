import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/prisma";

// Definir el tipo para la respuesta
interface Response {
  message?: string;
  libros?: any;
  libro?: any;
  error?: any;
}

// Definir el manejador de la API
export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  if (req.method === 'GET') {
    // Obtener todos los libros
    try {
      const libros = await prisma.libro.findMany();
      console.log(libros)
      res.status(200).json({ libros });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Error al obtener los libros', error });
    }
  } else if (req.method === 'POST') {
    // Extraer los datos del cuerpo de la solicitud
    const { titulo, autor, genero, precio, descripcion, stock,urlPhoto } = req.body;

    // Validar que todos los campos obligatorios estén presentes
    if (!titulo || !autor || !genero || !precio || !descripcion || typeof stock !== 'number') {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
      // Crear un nuevo libro en la base de datos
      const libro = await prisma.libro.create({
        data: { titulo, autor, genero, precio, descripcion, stock,urlPhoto },
      });
      res.status(201).json({ libro });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el libro', error });
    }
  } else {
    // Si el método HTTP no es GET o POST
    res.status(405).json({ message: 'Método no permitido' });
  }
}
