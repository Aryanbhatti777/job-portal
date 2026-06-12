import multer from "multer";

// Use memoryStorage instead of diskStorage for Railway compatibility
const storage = multer.memoryStorage();

export const upload = multer({ storage });