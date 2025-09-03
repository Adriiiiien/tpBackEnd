import nodemailer from "nodemailer";
import welcomeSchema from "../validators/welcome.validator.js";

export async function sendWelcomeEmail(req, res) {
  const { error, value } = welcomeSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .send("Erreur de validation : " + error.details[0].message);
  }

  const { nom, email } = value;

  try {
    // Créer le transporteur (utilise un vrai mail + mot de passe d’application)
    let transporter = nodemailer.createTransport({
      service: "gmail", // ou autre (Yahoo, Outlook…)
      auth: {
        user: "tonemail@gmail.com",
        pass: "tonMotDePasseApp",
      },
    });

    // Message à envoyer
    let info = await transporter.sendMail({
      from: '"Mon Application" <tonemail@gmail.com>',
      to: email,
      subject: "Bienvenue !",
      html: `<h2>Bienvenue ${nom} !</h2><p>Merci de vous être inscrit à notre application 🎉</p>`,
    });

    console.log("E-mail envoyé :", info.messageId);
    res.send(
      `<h3>Bienvenue ${nom} ! Un email vient d’être envoyé à ${email} ✅</h3>`
    );
  } catch (err) {
    console.error("Erreur lors de l'envoi :", err);
    res.status(500).send("Erreur d'envoi de l'email.");
  }
}
