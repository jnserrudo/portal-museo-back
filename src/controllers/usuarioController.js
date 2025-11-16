// src/controllers/usuarioController.js
import { UsuarioModel } from '../models/usuarioModel.js';

export class UsuarioController {
  static getAll = async (req, res, next) => {
    try {
      const usuarios = await UsuarioModel.getAll();
      res.json(usuarios);
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const usuario = await UsuarioModel.getById(parseInt(id));
      if (usuario) {
        res.json(usuario);
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      next(error);
    }
  };

  static create = async (req, res, next) => {
    try {
      const nuevoUsuario = await UsuarioModel.create(req.body);
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      next(error);
    }
  };

  static update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const usuarioActualizado = await UsuarioModel.update(parseInt(id), req.body);
      if (usuarioActualizado) {
        res.json(usuarioActualizado);
      } else {
        res.status(404).json({ message: "Usuario no encontrado para actualizar" });
      }
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const usuarioEliminado = await UsuarioModel.delete(parseInt(id));
      if (usuarioEliminado) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Usuario no encontrado para eliminar" });
      }
    } catch (error) {
      next(error);
    }
  };
}