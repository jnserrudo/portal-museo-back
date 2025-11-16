// src/routes/evento.js
import express from 'express';
import { EventoController } from '../controllers/eventoController.js';

export const eventoRouter = express.Router();

eventoRouter.get('/', EventoController.getAll);
eventoRouter.get('/:id', EventoController.getById);
eventoRouter.post('/', EventoController.create);
eventoRouter.put('/:id', EventoController.update);
eventoRouter.delete('/:id', EventoController.delete);