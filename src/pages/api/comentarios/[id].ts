import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Asegúrate de que prisma esté configurado

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const comentarios = await prisma.comentario.findMany({
        where: { libroId: String(id) },
        orderBy: { fecha: 'desc' },
        include: {
          usuario: true, // Incluye los detalles del usuario
        },
      });
      res.status(200).json({ comentarios });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los comentarios', error });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
