const authController = require('../../src/controllers/authController');
const authService = require('../../src/services/authService');
const { CustomError } = require('../../src/utils/Errors/customErrors');
const i18n = require('../../src/config/i18n'); 
jest.mock('../../src/services/authService');

describe('AuthController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register()', () => {
    it('should return 201 on successful registration', async () => {
      const req = mockReqWithLang({
        name: 'Jane',
        email: 'jane@example.com',
        password: 'securepass'
      });
      const res = mockRes();

      authService.register.mockResolvedValue({ name: 'Jane', email: 'jane@example.com' });
      i18n.__.mockReturnValue('User registered successfully');

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: { name: 'Jane', email: 'jane@example.com' }
      });
    });

    it('should return error if service throws', async () => {
      const req = mockReqWithLang({ email: 'exists@example.com' });
      const res = mockRes();

      authService.register.mockImplementation(() => {
        throw new CustomError('Email exists', 400);
      });

      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email exists' });
    });
  });

  describe('login()', () => {
    it('should set cookies and return 200 on valid login', async () => {
      const req = mockReqWithLang({ email: 'john@example.com', password: 'secret' });
      const res = mockRes();

      res.cookie = jest.fn();

      authService.login.mockResolvedValue({
        message: 'Login successful',
        accessToken: 'access_token',
        refreshToken: 'refresh_token'
      });

      i18n.__.mockReturnValue('Login successful');

      await authController.login(req, res);

      expect(res.cookie).toHaveBeenCalledWith('access_token', 'access_token', expect.any(Object));
      expect(res.cookie).toHaveBeenCalledWith('refresh_token', 'refresh_token', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Login successful',
        accessToken: 'access_token',
        refreshToken: 'refresh_token'
       });
    });

    it('should handle login errors', async () => {
      const req = mockReqWithLang({ email: 'fail@example.com', password: 'badpass' });
      const res = mockRes();
      authService.login.mockImplementation(() => {
        throw new CustomError('Invalid credentials', 401);
      });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  describe('refreshToken()', () => {
    it('should return new access token', async () => {
      const req = { cookies: { refresh_token: 'old_token' }, headers: { 'accept-language': 'en' } };
      const res = mockRes();
      res.cookie = jest.fn();

      authService.refreshToken.mockResolvedValue('new_access_token');

      await authController.refreshToken(req, res);

      expect(res.cookie).toHaveBeenCalledWith('access_token', 'new_access_token', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ accessToken: 'new_access_token' });
    });

    it('should handle refresh token failure', async () => {
      const req = { cookies: { refresh_token: 'bad_token' }, headers: { 'accept-language': 'en' } };
      const res = mockRes();
      authService.refreshToken.mockImplementation(() => {
        throw new CustomError('Invalid refresh token', 403);
      });

      await authController.refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid refresh token' });
    });
  });

  describe('logout()', () => {
    it('should clear cookies and return logout message', async () => {
      const req = { headers: { 'accept-language': 'en' } };
      const res = mockRes();
      res.clearCookie = jest.fn();
      i18n.__.mockReturnValue('Logged out successfully');

      await authController.logout(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('access_token');
      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
    });
  });
});
