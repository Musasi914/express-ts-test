import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "YelpCamp",
    allowed_formats: ["jpeg", "jpg", "png"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }], // 画像サイズ制限
  },
});

export { cloudinary, storage };
