// src/controllers/eventoController.js
import { EventoModel } from '../models/eventoModel.js';

export class EventoController {
  static getAll = async (req, res, next) => {
    try {
      const eventos = await EventoModel.getAll();
      res.json(eventos);
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const evento = await EventoModel.getById(parseInt(id));
      if (evento) {
        res.json(evento);
      } else {
        res.status(404).json({ message: "Evento no encontrado" });
      }
    } catch (error) {
      next(error);
    }
  };

  static create = async (req, res, next) => {
    try {
      const nuevoEvento = await EventoModel.create(req.body);
      res.status(201).json(nuevoEvento);
    } catch (error) {
      next(error);
    }
  };

  static update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const eventoActualizado = await EventoModel.update(parseInt(id), req.body);
      if (eventoActualizado) {
        res.json(eventoActualizado);
      } else {
        res.status(404).json({ message: "Evento no encontrado para actualizar" });
      }
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const eventoEliminado = await EventoModel.delete(parseInt(id));
      if (eventoEliminado) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Evento no encontrado para eliminar" });
      }
    } catch (error) {
      next(error);
    }
  };
}