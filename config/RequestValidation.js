// Import Modules
const { Joi } = require("express-validation");

// Create User Validation
module.exports.createUserValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .regex(/^[79]\d{7}$/)
      .required(),
    username: Joi.string().required(),
  }),
};

// Login Validation
module.exports.loginValidation = {
  body: Joi.object({
    username: Joi.string().required(),
  }),
};

// Create Message Validation
module.exports.createMessageValidation = {
  body: Joi.object({
    message: Joi.string().required(),
    userId: Joi.number().required(),
  }),
};
