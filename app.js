import express from "express";

import path from "path";
import { fileURLToPath } from "url";
import welcomeRoutes from "./routes/welcome.routes.js";

import nodemailer from "nodemailer";
import dotenv from "dotenv";
/* import { Low } from "lowdb";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator"; */

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Config pour __dirname (car on est en ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true })); // pour lire les données du formulaire

// Route pour afficher la page HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Routes Welcome
app.use("/", welcomeRoutes);

app.listen(PORT, () => {
  console.log(` ce server tourne sur ::: http://localhost:${PORT}`);
});
