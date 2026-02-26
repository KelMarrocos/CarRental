import multer from "multer";

export const multerErrorHandler = (err, req, res, next) => {
  if (!err) return next();

  // Erros do multer
  if (err instanceof multer.MulterError) {
    // file muito grande
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Max size is 5MB.",
      });
    }

    // tipo inválido / campo inesperado
    return res.status(400).json({
      success: false,
      message: "Invalid file. Please upload an image (jpg/png/webp).",
    });
  }

  // Outros erros
  return res.status(400).json({
    success: false,
    message: err.message || "Upload failed. Try again.",
  });
};