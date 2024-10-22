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
  usuarios?: any;
  error?: any;
}

// Definir el manejador de la API
export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  // Asegurarse de que el método sea GET
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  // Obtener el token JWT del encabezado Authorization
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Acceso no autorizado' });

  try {
    // Verificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Buscar al usuario en la base de datos
    const usuario = await prisma.usuario.findUnique({ where: { id: decoded.id } });

    // Verificar si el usuario es un administrador
    if (!usuario || usuario.tipo !== 'ADMIN') {
      return res.status(403).json({ message: 'Permisos insuficientes' });
    }

    // Obtener la lista de usuarios
    const usuarios = await prisma.usuario.findMany();

    // Devolver la lista de usuarios en la respuesta
    res.status(200).json({ usuarios });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({ message: 'Error al obtener los usuarios', error });
  }
}
