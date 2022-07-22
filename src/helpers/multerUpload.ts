import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve("uploads"));
  },
  filename: (req, file, callback) => {
    const { originalname } = file;
    const extension = originalname.split(".")[1];
    callback(null, `${Date.now()}.${extension}`);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});
