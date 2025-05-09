jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

jest.mock('../../src/lib/prisma', () => ({
  user: {
    findUnique: jest.fn()
  }
}));

const { authenticateJWT, requireUser, requireAdmin } = require('../../src/middlewares/auth');
const jwt = require('jsonwebtoken'); 
const prisma = require('../../src/lib/prisma');

describe('auth middlewares', () => {
  const next = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateJWT', () => {
    it('should add user to req on valid token', async () => {
      const mockUser = { id: 1, name: 'Test User', role: 'user' };
      jwt.verify.mockReturnValue({ id: 1 });
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const req = mockReqWithLang({}, 'en', 'Bearer valid_token');
      const res = mockRes();

      await authenticateJWT(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      jwt.verify.mockImplementation(() => { throw new Error('Invalid'); });

      const req = mockReqWithLang({}, 'en', 'Bearer invalid_token');
      const res = mockRes();

      await authenticateJWT(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid token' });
    });

    it('should return 401 if no token provided', async () => {
      const req = mockReqWithLang({}, 'en', '');
      const res = mockRes();

      await authenticateJWT(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: No token provided' });
    });
  });

  describe('requireUser', () => {
    it('should call next if role is user', () => {
      const req = { user: { role: 'user' }, language: 'en' };
      const res = mockRes();
      requireUser(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if role is not user', () => {
      const req = { user: { role: 'admin' }, language: 'en' };
      const res = mockRes();
      requireUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
  });

  describe('requireAdmin', () => {
    it('should call next if role is admin', () => {
      const req = { user: { role: 'admin' }, language: 'en' };
      const res = mockRes();
      requireAdmin(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if role is not admin', () => {
      const req = { user: { role: 'user' }, language: 'en' };
      const res = mockRes();
      requireAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
  });
});
