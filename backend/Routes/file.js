const express = require("express");
const path = require("path");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const File = require("../Models/fileModels");
const router = express.Router();

router.post("/upload", upload.single("myfile"), async (req, res) => {
  try {
    // Get extension (e.g., .png, .pdf, .docx)
    const action = req.body.action; // whether it is a quiz or notes
    const ext = path.extname(req.file.originalname).toLowerCase();
    let resourceType = "auto";


    let fileType;

    if ([".pdf", ".docx", ".txt", ".doc"].includes(ext)) {
      resourceType = "raw";  // Cloudinary will serve proper URL for docs
      fileType = ext === ".pdf" ? "pdf" : "docx";
    } else if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) {
      resourceType = "image";
      fileType = "image";
    }
    else{
      return res.status(400).json({message: "Unsupported file type"});
    }

    // Upload with correct resource type
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: resourceType });

    // Save file info to MongoDB
    const savedFile = await File.create({
      originalName: req.file.originalname,
      cloudinaryUrl: result.secure_url, // Correct URL for file type
      cloudinaryId: result.public_id,
    });

    
    // 3. Directly call extract+AI logic within this route
    // Import your 'complete' route's extract and AI logic as helper functions!

    const { processFileWithAI } = require('../utils/processing');

    const aiText = await processFileWithAI(result.secure_url,fileType,action);

    res.json({file: savedFile, aiText});


  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});


module.exports = router;
