const express = require("express");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const verifyRoutes = require("./routes/verify");

const app = express();
app.use(bodyParser.json());


app.use("/", authRoutes);
app.use("/", verifyRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`serveur démarré sur http://localhost:${PORT}`);
});
