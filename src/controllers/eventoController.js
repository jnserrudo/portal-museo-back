// src/controllers/eventoController.js
import { EventoModel } from '../models/eventoModel.js';
import { upload, handleMulterErrors } from '../config/multer.js';

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

  static create = [
    // Middleware de Multer para manejar múltiples archivos
    (req, res, next) => {
      // Middleware para parsear el formulario
      upload.array('imagenes', 5)(req, res, (err) => {
        if (err) {
          // Si hay un error de Multer, lo manejamos
          return handleMulterErrors(err, req, res, next);
        }
        next();
      });
    },
    async (req, res, next) => {
      try {
        console.log('Body recibido:', req.body);
        console.log('Archivos recibidos:', req.files ? req.files.length : 0);
        
        // Verificar campos requeridos
        const { titulo, descripcion, fecha, lugar } = req.body;
        
        if (!titulo || !descripcion || !fecha) {
          return res.status(400).json({ 
            message: 'Los campos título, descripción y fecha son obligatorios' 
          });
        }

        let imagenUrls = [];

        // Si hay archivos subidos, procesa las URLs
        if (req.files && req.files.length > 0) {
          // Usar la ruta relativa para que funcione tanto en desarrollo como en producción
          imagenUrls = req.files.map(file => `/uploads/${file.filename}`);
          console.log('URLs de imágenes generadas:', imagenUrls);
        }

        // Crear el objeto de evento con el ID de usuario 1
        const eventoData = {
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          fecha: new Date(fecha),
          lugar: lugar ? lugar.trim() : null,
          imagenUrls,
          publicado: req.body.publicado === 'true',
          autorId: 1  // Usamos siempre el ID 1
        };

        console.log('Datos del evento a crear:', eventoData);

        // Crear el evento en la base de datos
        const nuevoEvento = await EventoModel.create(eventoData);
        
        console.log('Evento creado exitosamente:', nuevoEvento);
        
        res.status(201).json({
          success: true,
          data: nuevoEvento,
          message: 'Evento creado exitosamente'
        });
      } catch (error) {
        console.error('Error al crear el evento:', error);
        next(error);
      }
    }
  ];

  static update = [
    // Middleware de Multer para manejar múltiples archivos
    (req, res, next) => {
      // Middleware para parsear el formulario
      upload.array('imagenes', 5)(req, res, (err) => {
        if (err) {
          // Si hay un error de Multer, lo manejamos
          return handleMulterErrors(err, req, res, next);
        }
        next();
      });
    },
    async (req, res, next) => {
      try {
        const { id } = req.params;
        console.log(`Actualizando evento ID: ${id}`);
        console.log('Datos recibidos:', req.body);
        console.log('Archivos recibidos:', req.files ? req.files.length : 0);
        
        // Verificar campos requeridos
        const { titulo, descripcion, fecha } = req.body;
        
        if (!titulo || !descripcion || !fecha) {
          return res.status(400).json({ 
            message: 'Los campos título, descripción y fecha son obligatorios' 
          });
        }

        // Obtener el evento actual
        const eventoActual = await EventoModel.getById(parseInt(id));
        if (!eventoActual) {
          return res.status(404).json({ message: 'Evento no encontrado' });
        }

        let imagenUrls = [];

        // Si hay archivos subidos, usamos solo las nuevas imágenes
        if (req.files && req.files.length > 0) {
          const baseUrl = process.env.UPLOADS_PUBLIC_URL || '/uploads';
          imagenUrls = req.files.map(file => `${baseUrl}/${file.filename}`);
          console.log('Nuevas URLs de imágenes:', imagenUrls);
        } else if (req.body.imagenUrls) {
          // Si no hay archivos nuevos pero hay URLs de imágenes existentes
          try {
            const urls = JSON.parse(req.body.imagenUrls);
            if (Array.isArray(urls)) {
              imagenUrls = urls;
            }
          } catch (e) {
            console.warn('No se pudieron parsear las URLs de imágenes:', e);
          }
        }

        // Crear el objeto de datos actualizado
        const updateData = {
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          fecha: new Date(fecha),
          lugar: req.body.lugar ? req.body.lugar.trim() : null,
          publicado: req.body.publicado === 'true',
          autorId: parseInt(req.body.autorId) || 1 // temporal
        };

        // Solo actualizamos las imágenes si hay nuevas
        if (imagenUrls.length > 0) {
          updateData.imagenUrls = imagenUrls;
        }

        console.log('Datos para actualizar:', updateData);

        // Actualizar el evento en la base de datos
        const eventoActualizado = await EventoModel.update(parseInt(id), updateData);
        
        if (!eventoActualizado) {
          return res.status(404).json({ message: 'No se pudo actualizar el evento' });
        }
        
        console.log('Evento actualizado exitosamente:', eventoActualizado);
        
        res.json({
          success: true,
          data: eventoActualizado,
          message: 'Evento actualizado exitosamente'
        });
      } catch (error) {
        console.error('Error al actualizar el evento:', error);
        next(error);
      }
    }
  ];

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