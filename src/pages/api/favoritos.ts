import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Acceso no autorizado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const usuarioId = (decoded as any).id;

    const { libroId } = req.body;
    if (!libroId) return res.status(400).json({ message: 'Faltan datos necesarios' });

    if (req.method === 'POST') {
      // Agregar a favoritos
      await prisma.favoritos.create({
        data: {
          usuarioId,
          libroId,
        },
      });
      res.status(200).json({ message: 'Libro agregado a favoritos' });
    } else if (req.method === 'DELETE') {
      // Eliminar de favoritos
      await prisma.favoritos.deleteMany({
        where: {
          usuarioId,
          libroId,
        },
      });
      res.status(200).json({ message: 'Libro eliminado de favoritos' });
    } else {
      res.status(405).json({ message: 'Método no permitido' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
}
