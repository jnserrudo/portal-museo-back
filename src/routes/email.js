// src/routes/email.js
import express from 'express';
import { EmailController } from '../controllers/emailController.js';

export const emailRouter = express.Router();

emailRouter.post('/enviar', EmailController.enviarEmail);
