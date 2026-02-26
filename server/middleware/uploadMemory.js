import multer from "multer";

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // aceita somente imagens
  if (!file.mimetype.startsWith("image/")) {
    return cb(
      new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only images are allowed"),
      false
    );
  }
  cb(null, true);
};

const uploadMemory = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
});

export default uploadMemory;