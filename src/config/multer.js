// src/config/multer.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Asegurarse de que el directorio de uploads exista en src/uploads
const uploadDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Directorio de uploads creado en: ${uploadDir}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    // Usamos un nombre de archivo más seguro
    const safeFilename = file.originalname
      .replace(/[^\w\d\.-]/g, '_') // Reemplaza caracteres no deseados
      .toLowerCase();
    
    cb(null, `evento-${Date.now()}-${uniqueSuffix}${ext}`);
  }
});

// Función para filtrar archivos
const fileFilter = (req, file, cb) => {
  const allowed = /jpe?g|png|webp/i;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;
  
  if (allowed.test(ext) && mimeType.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, JPG, PNG, WebP)'), false);
  }
};

export const upload = multer({ 
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // Máximo 5 archivos
  },
  fileFilter
});

// Middleware para manejar errores de multer
export const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Un error de Multer al cargar
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'El archivo es demasiado grande. Tamaño máximo: 5MB' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Demasiados archivos. Máximo 5 archivos permitidos' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Tipo de archivo no permitido' });
    }
  } else if (err) {
    // Otros errores
    return res.status(400).json({ message: err.message || 'Error al cargar el archivo' });
  }
  
  // Si no hay errores, continuar
  next();
};