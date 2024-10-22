import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

// Inicializar Prisma Client
const prisma = new PrismaClient();

// Definir el tipo de carga útil para JWT
interface JwtPayload {
  id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificar que sea un método GET
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  // Obtener el token JWT del encabezado Authorization
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado. Token faltante.' });
  }

  try {
    // Verificar el token JWT con el secreto
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Buscar al usuario en la base de datos utilizando el ID del token decodificado
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        nombre: true,
        correo: true,
        tipo: true, // Asegurarse de devolver el tipo de usuario
      },
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Devolver los datos del usuario si el token es válido
    res.status(200).json({ usuario });
  } catch (error) {
    // Si el token no es válido o ha expirado
    return res.status(401).json({ message: 'Acceso no autorizado. Token inválido o expirado.' });
  }
}
