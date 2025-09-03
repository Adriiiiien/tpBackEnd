const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const userStore = require("../models/userStore");

require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

router.post("/register", async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, email, password } = req.body;
  if (userStore.findUserByEmail(email)) return res.status(400).json({ error: "email déjà utilisé." });

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = uuidv4();
  const tokenExpires = Date.now() + 15 * 60 * 1000;

  userStore.addUser({
    name,
    email,
    password: hashedPassword,
    status: "pending",
    verificationToken,
    tokenExpires
  });

  const verificationUrl = `http://localhost:3000/verify?token=${verificationToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "vérification de votre compte",
    html: `<p>bonjour ${name},</p><p>merci de vous être inscris. cliquez sur le liens pour valider votre compte :</p><a href="${verificationUrl}">${verificationUrl}</a>`
  });

  res.json({ message: "inscription réussie. vérifiez votre email pour validé votre compte." });
});

module.exports = router;

