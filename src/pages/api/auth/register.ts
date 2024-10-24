import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from 'jsonwebtoken';

// Inicializar Prisma Client
const prisma = new PrismaClient();

// Definir el tipo para la respuesta
interface Response {
  message?: string;
  error?: any;
  token?:string
  nuevoUsuario?: any;
}

// Definir el manejador de la API
export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  // Asegurarse de que el método sea POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  // Extraer los datos del cuerpo de la solicitud
  const { nombre, correo, password } = req.body;

  // Validar que todos los campos estén presentes
  if (!nombre || !correo || !password) {
    return res.status(400).json({ message: 'Por favor, completa todos los campos' });
  }

  // Hashear la contraseña usando bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Crear un nuevo usuario en la base de datos
    
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        password: hashedPassword,
        tipo: "USUARIO", // Puedes cambiar el tipo si es necesario
      },
    });
    const token = jwt.sign({ id: nuevoUsuario.id } as JwtPayload, process.env.JWT_SECRET as string, { expiresIn: '8h' });


    // Devolver el nuevo usuario en la respuesta
    res.status(201).json({ token,nuevoUsuario });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({ message: 'Error al crear el usuario', error });
  }
}
