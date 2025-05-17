const isProduction = process.env.NODE_ENV === 'production';

const accessTokenOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'None',
  maxAge: 1000 * 60 * 15, 
};

const refreshTokenOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite:'None',
  maxAge: 1000 * 60 * 60 * 24 * 7, 
};

module.exports = {
  accessTokenOptions,
  refreshTokenOptions,
};
