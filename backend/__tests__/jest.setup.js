jest.mock('../src/config/i18n', () => ({
  setLocale: jest.fn(),
  __: jest.fn((key, ...args) => {
    if (args.length) return key.replace('%s', args[0]);
    return key;
  })
}));

jest.mock('../src/lib/logger', () => ({
  error: jest.fn()
}));

jest.mock('../src/utils/Errors/prismaErrors', () => {
  const { CustomError } = require('../src/utils/Errors/customErrors');
  return {
    handlePrismaError: jest.fn((error, label) => {
      if (error instanceof CustomError) throw error;
      if (error instanceof Error) throw new CustomError(`Mocked ${label} error`, 500);
    })
  };
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockReqWithLang = (body = {}, lang = 'en', token = 'Bearer test_token') => ({
  body,
  headers: {
    'accept-language': lang,
    'content-type': 'application/json',
    authorization: token
  }
});

global.mockRes = mockRes;
global.mockReqWithLang = mockReqWithLang;
