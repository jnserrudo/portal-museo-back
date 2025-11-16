// src/routes/usuario.js
import express from 'express';
import { UsuarioController } from '../controllers/usuarioController.js';

export const usuarioRouter = express.Router();

usuarioRouter.get('/', UsuarioController.getAll);
usuarioRouter.get('/:id', UsuarioController.getById);
usuarioRouter.post('/', UsuarioController.create);
usuarioRouter.put('/:id', UsuarioController.update);
usuarioRouter.delete('/:id', UsuarioController.delete);