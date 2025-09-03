require("dotenv").config(); 
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Crée le dossier uploads/ si inexistant
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configure le stockage des fichiers uploadés
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir), // Définit le dossier de destination
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)), // Renomme le fichier avec timestamp
});

// Filtre les fichiers autorisés (pdf, jpg, jpeg, png)
const fileFilter = (req, file, cb) => {
  const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("Seuls les fichiers .pdf, .jpg et .png sont autorisés !"));
};

// Initialise multer avec le stockage + filtre
const upload = multer({ storage, fileFilter });

// Configure le transporteur d’emails (SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Route POST /contact : envoie l'email + accusé de réception et supprime le fichier temporaire
router.post("/contact", upload.single("file"), async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const file = req.file;

    // Envoie le message à l’admin
    await transporter.sendMail({
      from: `"Formulaire Contact" <${process.env.SMTP_USER}>`,
      to: process.env.DEST_EMAIL,
      subject: "Nouveau message via formulaire de contact",
      text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`,
      attachments: file ? [{ filename: file.originalname, path: file.path }] : [],
    });

    // Envoie un accusé de réception à l’expéditeur
    await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Accusé de réception - Votre message",
      text: `Bonjour ${name},\n\nMerci pour votre message, nous vous répondrons rapidement.\n\nCordialement,\nL'équipe.`,
    });

    // Supprime le fichier uploadé après envoi
    if (file) fs.unlinkSync(file.path);

    res.json({ success: true, message: "Message envoyé avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur lors de l’envoi" });
  }
});

module.exports = router; 
