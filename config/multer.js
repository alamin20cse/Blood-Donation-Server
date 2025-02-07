// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("./cloudinary");

// // Configure Multer Storage with Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "blood-donation", // Cloudinary folder name
//     format: async (req, file) => "png", // File format (png, jpg, etc.)
//     public_id: (req, file) => Date.now() + "-" + file.originalname, // Unique name
//   },
// });

// const upload = multer({ storage: storage });

// module.exports = upload;
