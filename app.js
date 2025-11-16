// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
app.disable("x-powered-by");

const server = http.createServer(app);

// --- Configuración CORS ---
const ACCEPTED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://195.200.0.39", // Tu IP
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("No permitido por CORS"), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// --- Middleware ---
app.use(express.json());

// --- Rutas Principales ---
import { router as apiRouter } from "./src/routes/main.js";
app.use("/api", apiRouter);

// --- Health Check ---
app.get("/health", (req, res) => {
  res.status(200).send("OK - Service Alive");
});

// --- Ruta Base ---
app.get("/", (req, res) => {
  res.send("API del Portal del Museo Funcionando!");
});

// --- Manejo de Errores Global ---
app.use((err, req, res, next) => {
  console.error("Error no manejado detectado:", err);

  if (err.message === "No permitido por CORS") {
    return res
      .status(403)
      .json({ message: "Acceso denegado por política de CORS." });
  }

  const statusCode = err.status || 500;
  const responseMessage =
    statusCode === 500 && process.env.NODE_ENV === "production"
      ? "Ocurrió un error inesperado en el servidor."
      : err.message || "Error interno del servidor.";

  res.status(statusCode).json({ message: responseMessage });
});

// --- Manejo de Rutas No Encontradas (404) ---
app.use((req, res) => {
  res
    .status(404)
    .json({
      message: `No se encontró la ruta: ${req.method} ${req.originalUrl}`,
    });
});

// --- Puerto y Arranque del Servidor ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, "localhost", () => {
  console.log(
    `✅ API del Portal del Museo corriendo en http://localhost:${PORT}`
  );
});
