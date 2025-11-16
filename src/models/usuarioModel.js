// src/models/usuarioModel.js
import prisma from '../config/prismaClient.js';

export class UsuarioModel {
  static getAll = async () => {
    try {
      const usuarios = await prisma.usuario.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return usuarios;
    } catch (error) {
      throw error;
    }
  };

  static getById = async (id) => {
    if (isNaN(id)) return null;
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id },
        include: { eventos: true },
      });
      return usuario;
    } catch (error) {
      throw error;
    }
  };

  static create = async (data) => {
    try {
      const usuario = await prisma.usuario.create({
        data: {
          rol: data.rol || 'usuario',
          password: data.password, // ← en producción, hashear con bcrypt
        },
      });
      return usuario;
    } catch (error) {
      throw error;
    }
  };

  static update = async (id, data) => {
    if (isNaN(id)) return null;
    try {
      const usuario = await prisma.usuario.update({
        where: { id },
        data: {
          rol: data.rol,
          password: data.password,
        },
      });
      return usuario;
    } catch (error) {
      throw error;
    }
  };

  static delete = async (id) => {
    if (isNaN(id)) return null;
    try {
      const usuario = await prisma.usuario.delete({
        where: { id },
      });
      return usuario;
    } catch (error) {
      throw error;
    }
  };
}