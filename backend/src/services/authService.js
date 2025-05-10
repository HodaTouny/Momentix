const bcrypt = require('bcryptjs');
const  prisma = require('../lib/prisma');
const { generateToken, generateRefetchToken, verifyRefreshToken } = require('../utils/jwt');
const { CustomError } = require('../utils/Errors/customErrors');
const { handlePrismaError } = require('../utils/Errors/prismaErrors');
const i18n = require('../config/i18n');
const logger = require('../lib/logger');

class AuthService {
  async register(data, lang) {
    try {
      i18n.setLocale(lang);
      const { name, email, password } = data;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new CustomError(i18n.__('User already exists'), 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'user'
        }
      });

      return user;
    } catch (error) {
      logger.error(error);
      if (error instanceof CustomError) {
        throw error;
      }
      handlePrismaError(error, i18n.__('User'));
    }
  }

  async login(credentials, lang) {
    i18n.setLocale(lang);
    try {
      const { email, password } = credentials;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new CustomError(i18n.__('Invalid Credentials, Email not found'), 401);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new CustomError(i18n.__('Invalid Credentials, Password does not match'), 401);
      }

      const payload = { id: user.user_id, role: user.role };
      const accessToken = generateToken(payload);
      const refreshToken = generateRefetchToken(payload);
      const newUser = {user_id: user.user_id, email: user.email, role: user.role};

      return { accessToken, refreshToken, user: newUser };
    } catch (error) {
      logger.error(error);
      if (error instanceof CustomError) {
        throw error;
      }
      handlePrismaError(error, i18n.__('User'));
    }
  }

  async refreshToken(token, lang) {
    i18n.setLocale(lang);
    try {
      const decoded = verifyRefreshToken(token);
      const payload = { id: decoded.id, role: decoded.role };
      return generateToken(payload);
    } catch (err) {
      logger.error(err);
      throw new CustomError(i18n.__('Invalid refresh token'), 403);
    }
  }
}

module.exports = new AuthService();
