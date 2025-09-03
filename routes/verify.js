const express = require("express");
const router = express.Router();
const userStore = require("../models/userStore");

router.get("/verify", (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send("Token manquant.");

  const user = userStore.findUserByToken(token);
  if (!user) return res.status(400).send("token invalide ou déjà utilisé.");
  if (user.status === "active") return res.status(400).send("Compte déjà activé.");
  if (user.tokenExpires < Date.now()) return res.status(400).send("Token expiré.");

  userStore.updateUser(user.email, {
    status: "active",
    verificationToken: undefined,
    tokenExpires: undefined
  });

  res.send("votre compte a bien été activé.");
});

module.exports = router;
