const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const registerSchema = require('../validations/registerSchema');
const loginSchema = require('../validations/loginSchema');

router.post('/register', validate(registerSchema), (req, res) => authController.register(req, res));
router.post('/login', validate(loginSchema), (req, res) => authController.login(req, res));
router.post('/refresh', (req, res) => authController.refreshToken(req, res));
router.get('/logout', (req, res) => authController.logout(req, res));

module.exports = router;
