import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

// Inicializar Prisma Client
const prisma = new PrismaClient();

// Definir el tipo para la respuesta
interface Response {
  message?: string;
  token?: string;
  usuario?: any;
  error?: any;
}

// Definir el tipo de carga útil para JWT
interface JwtPayload {
  id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  // Asegurarse de que el método sea POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  // Extraer los datos del cuerpo de la solicitud
  const { correo, password } = req.body;

  // Validar que todos los campos estén presentes
  if (!correo || !password) {
    return res.status(400).json({ message: 'Por favor, completa todos los campos' });
  }

  try {
    // Buscar al usuario en la base de datos por su correo
    const usuario = await prisma.usuario.findUnique({ where: { correo } });

    // Si el usuario no existe, devolver un error
    if (!usuario) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Comparar la contraseña proporcionada con la almacenada
    const isMatch = await bcrypt.compare(password, usuario.password);

    // Si las contraseñas no coinciden, devolver un error
    if (!isMatch) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Generar el token JWT usando el id del usuario
    const token = jwt.sign({ id: usuario.id } as JwtPayload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    // Devolver el token y los detalles del usuario en la respuesta
    res.status(200).json({ token, usuario });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
}
