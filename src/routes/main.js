// src/routes/main.js
import express from 'express';
import { eventoRouter } from './evento.js';
import { usuarioRouter } from './usuario.js';

export const router = express.Router();

router.use('/eventos', eventoRouter);
router.use('/usuarios', usuarioRouter);