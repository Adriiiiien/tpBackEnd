const express = require("express");
const path = require("path");
const formulaire = require("./formulaire");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Utilise la route du formulaire (POST /contact et GET /contact/history)
app.use("/", formulaire);

// Sert les fichiers statiques (JS, CSS, images, HTML)
app.use(express.static(path.join(__dirname)));

// Sert le formulaire HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Sert la page d'historique
app.get("/history", (req, res) => {
  res.sendFile(path.join(__dirname, "history.html"));
});

app.listen(3000, () => console.log("🚀 Serveur lancé sur http://localhost:3000"));
