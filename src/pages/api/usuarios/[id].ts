import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

// Inicializar Prisma Client
const prisma = new PrismaClient();

// Definir el tipo de carga útil para JWT
interface JwtPayload {
  id: string;
}

// Definir el tipo para la respuesta
interface Response {
  message?: string;
  usuario?: any;
  error?: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  const { id } = req.query;

  // Obtener el token JWT del encabezado Authorization
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Acceso no autorizado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Buscar al usuario en la base de datos por el id del token
    const usuario = await prisma.usuario.findUnique({ where: { id: decoded.id } });

    // Verificar si el usuario es un administrador
    if (!usuario || usuario.tipo !== 'USUARIO') {
      return res.status(403).json({ message: 'Permisos insuficientes' });
    }

    // Manejar los diferentes métodos HTTP
    if (req.method === 'GET') {
      // Obtener un usuario por su ID
      const usuario = await prisma.usuario.findUnique({ where: { id: String(id) } });
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.status(200).json({usuario:usuario});
    } else if (req.method === 'PUT') {
      // Actualizar los datos de un usuario
      const { nombre, correo } = req.body;
      const usuarioActualizado = await prisma.usuario.update({
        where: { id: String(id) },
        data: { nombre, correo },
      });
      res.status(200).json({usuario:usuarioActualizado});
    } else if (req.method === 'DELETE') {
      // Eliminar un usuario
      await prisma.usuario.delete({ where: { id: String(id) } });
      res.status(200).json({ message: 'Usuario eliminado' });
    } else {
      res.status(405).json({ message: 'Método no permitido' });
    }
  } catch (error) {
    // Manejo de errores
    res.status(500).json({ message: 'Error al manejar el usuario', error });
  }
}
