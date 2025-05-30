const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Asegúrate de importar fs

// Define el directorio de destino para las imágenes
const uploadsDir = path.join(__dirname, "../uploads/vehicles");

// Asegúrate de que el directorio exista
// Se ejecuta una vez al inicio
fs.mkdirSync(uploadsDir, { recursive: true });

const vehicleStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Genera un nombre de archivo único y seguro
    // Usa un timestamp para asegurar unicidad y elimina caracteres especiales
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Extrae la extensión original del archivo
    const fileExtension = path.extname(file.originalname);
    // Sanitiza el nombre original para evitar problemas, aunque el timestamp ya ayuda mucho
    const safeOriginalname = file.originalname
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9.]/g, "_");

    // Combina un nombre base (ej. el nombre original sanitizado) con el sufijo único y la extensión
    // Si el nombre original es muy largo o problemático, puedes usar solo el sufijo único
    // Opcionalmente: limitar la longitud del nombre original para evitar nombres de archivo excesivamente largos
    const baseName = path
      .basename(safeOriginalname, fileExtension)
      .substring(0, 50); // Limita a 50 caracteres

    cb(null, `${baseName}-${uniqueSuffix}${fileExtension}`);
  },
});

const uploadVehicleImage = multer({
  storage: vehicleStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes (jpeg, jpg, png, gif)."));
    }
  },
});

module.exports = uploadVehicleImage;
