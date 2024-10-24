import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// Definir el tipo para JwtPayload
interface JwtPayload {
  id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { contenido, valoracion, libroId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!contenido || !valoracion || !libroId || !token) {
      return res.status(400).json({ message: 'Faltan datos necesarios' });
    }

    try {
      // Verificar y decodificar el token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      const usuarioId = decoded.id; // Ahora podemos acceder al campo 'id'

      const nuevoComentario = await prisma.comentario.create({
        data: {
          contenido,
          valoracion: Number(valoracion),
          libroId,
          usuarioId,
          fecha: new Date(),
        },
      });

      res.status(201).json({ comentario: nuevoComentario });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el comentario', error });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
