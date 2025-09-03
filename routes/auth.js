const express = require('express');
const router = express.Router();
const db = require('../db');
const transporter = require('../mailer');
const generateResetToken = require('../utils/generateToken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

router.post(
  '/forgot-password',
  body('email').isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: 'Email invalide.' });

    const { email } = req.body;
    await db.read();
    const user = db.data.users.find(u => u.email === email);

    if (user) {
      const { token, expiresAt } = generateResetToken();

      db.data.resetTokens.push({
        token,
        email,
        expiresAt,
        used: false
      });

      await db.write();

      const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Réinitialisation de mot de passe',
        html: `
          <p>Bonjour,</p>
          <p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>Ce lien expire dans 15 minutes.</p>
        `
      });
    }

    res.json({ success: true, message: 'Si cet email existe, un lien a été envoyé.' });
  }
);

router.post(
  '/reset-password',
  body('token').notEmpty(),
  body('password').isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: 'Champs invalides.' });

    const { token, password } = req.body;
    await db.read();
    const tokenEntry = db.data.resetTokens.find(t => t.token === token);

    if (!tokenEntry || tokenEntry.used || Date.now() > tokenEntry.expiresAt) {
      return res.status(400).json({ success: false, message: 'Token invalide ou expiré.' });
    }

    const user = db.data.users.find(u => u.email === tokenEntry.email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    tokenEntry.used = true;
    await db.write();

    res.json({ success: true, message: 'Mot de passe réinitialisé avec succès.' });
  }
);

module.exports = router;