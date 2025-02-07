// const express = require("express");
// const upload = require("../config/multer");

// const router = express.Router();

// // POST route to upload image
// router.post("/upload", upload.single("image"), (req, res) => {
//   try {
//     res.json({ imageUrl: req.file.path }); // Return Cloudinary image URL
//   } catch (error) {
//     res.status(500).json({ error: "Image upload failed" });
//   }
// });

// module.exports = router;
