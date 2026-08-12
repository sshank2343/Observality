const { registerUser, loginUser } = require('./auth.service');
const { registerSchema, loginSchema } = require('../../schemas/auth.schema');

const register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await registerUser(data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await loginUser(data);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };