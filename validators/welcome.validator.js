import Joi from "joi";

const welcomeSchema = Joi.object({
  nom: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
});

export default welcomeSchema;
