const express = require("express");
const path = require("path");
const formulaire = require("./formulaire");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sert le formulaire HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Utilise la route du formulaire
app.use("/", formulaire);

app.listen(3000, () => console.log("🚀 Serveur lancé sur http://localhost:3000"));