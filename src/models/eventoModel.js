// src/models/eventoModel.js
import prisma from '../config/prismaClient.js';

export class EventoModel {
  static getAll = async () => {
    try {
      const eventos = await prisma.evento.findMany({
        orderBy: { fecha: 'desc' },
        include: { autor: true },
      });
      return eventos;
    } catch (error) {
      throw error;
    }
  };

  static getById = async (id) => {
    if (isNaN(id)) return null;
    try {
      const evento = await prisma.evento.findUnique({
        where: { id },
        include: { autor: true },
      });
      return evento;
    } catch (error) {
      throw error;
    }
  };

  static create = async (data) => {
    try {
      const evento = await prisma.evento.create({
        data: {
          titulo: data.titulo,
          descripcion: data.descripcion,
          fecha: new Date(data.fecha),
          lugar: data.lugar,
          imagenUrls: data.imagenUrls || [],
          publicado: data.publicado || false,
          autor: { connect: { id: parseInt(data.autorId) } },
        },
      });
      return evento;
    } catch (error) {
      throw error;
    }
  };

  static update = async (id, data) => {
    if (isNaN(id)) return null;
    try {
      const evento = await prisma.evento.update({
        where: { id },
        data: {
          titulo: data.titulo,
          descripcion: data.descripcion,
          fecha: new Date(data.fecha),
          lugar: data.lugar,
          imagenUrls: data.imagenUrls || [],
          publicado: data.publicado,
        },
      });
      return evento;
    } catch (error) {
      throw error;
    }
  };

  static delete = async (id) => {
    if (isNaN(id)) return null;
    try {
      const evento = await prisma.evento.delete({
        where: { id },
      });
      return evento;
    } catch (error) {
      throw error;
    }
  };
}