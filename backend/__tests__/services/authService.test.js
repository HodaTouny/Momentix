jest.mock('../../src/lib/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn()
  }
}));


jest.mock('bcryptjs');
jest.mock('../../src/utils/jwt', () => ({
  generateToken: jest.fn(),
  generateRefetchToken: jest.fn(),
  verifyRefreshToken: jest.fn()
}));



const authService = require('../../src/services/authService');
const prisma  = require('../../src/lib/prisma'); 
const bcrypt = require('bcryptjs');
const jwt = require('../../src/utils/jwt');
const { CustomError } = require('../../src/utils/Errors/customErrors');

describe('AuthService', () => {
  const lang = 'en';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register()', () => {
    it('should register a new user successfully', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      prisma.user.create.mockResolvedValue({ name: 'John', email: 'john@example.com' });

      const user = await authService.register({
        name: 'John',
        email: 'john@example.com',
        password: 'secret123'
      }, lang);

      expect(user).toHaveProperty('name', 'John');
      expect(prisma.user.findUnique).toHaveBeenCalled();
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should throw if user already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ email: 'john@example.com' });

      await expect(authService.register({
        name: 'John',
        email: 'john@example.com',
        password: 'secret123'
      }, lang)).rejects.toThrow(CustomError);
    });

    it('should log and handle unexpected registration errors', async () => {
      const error = new Error('DB error');
      prisma.user.findUnique.mockRejectedValue(error);

      await expect(authService.register({
        name: 'Error',
        email: 'error@example.com',
        password: 'fail'
      }, lang)).rejects.toThrow('Mocked User error');
    });
  });

  describe('login()', () => {
    it('should return tokens if credentials are valid', async () => {
      prisma.user.findUnique.mockResolvedValue({
        user_id: 1,
        email: 'john@example.com',
        password: 'hashed',
        role: 'user'
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.generateToken.mockReturnValue('access_token');
      jwt.generateRefetchToken.mockReturnValue('refresh_token');

      const result = await authService.login({
        email: 'john@example.com',
        password: 'secret123'
      }, lang);

      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        user: {
          user_id: 1,
          email: 'john@example.com',
          role: 'user'
        }
      });
    });

    it('should throw if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.login({
        email: 'notfound@example.com',
        password: 'pass'
      }, lang)).rejects.toThrow(CustomError);
    });

    it('should throw if password does not match', async () => {
      prisma.user.findUnique.mockResolvedValue({ password: 'hashed' });
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login({
        email: 'john@example.com',
        password: 'wrongpass'
      }, lang)).rejects.toThrow(CustomError);
    });

    it('should handle login errors', async () => {
      const error = new Error('DB fail');
      prisma.user.findUnique.mockRejectedValue(error);

      await expect(authService.login({
        email: 'fail@example.com',
        password: 'secret'
      }, lang)).rejects.toThrow('Mocked User error');
    });
  });

  describe('refreshToken()', () => {
    it('should return new access token if refresh is valid', async () => {
      jwt.verifyRefreshToken.mockReturnValue({ id: 1, role: 'user' });
      jwt.generateToken.mockReturnValue('new_access_token');

      const token = await authService.refreshToken('refresh_token', lang);
      expect(token).toBe('new_access_token');
    });

    it('should throw on invalid refresh token', async () => {
      jwt.verifyRefreshToken.mockImplementation(() => {
        throw new Error('Invalid refresh');
      });

      await expect(authService.refreshToken('bad_token', lang)).rejects.toThrow(CustomError);
    });
  });
});
