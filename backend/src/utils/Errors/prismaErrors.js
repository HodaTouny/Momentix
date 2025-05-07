const { Prisma } = require('@prisma/client');
const { CustomError } = require('./customErrors');
const i18n = require('../../config/i18n');

function handlePrismaError(error, modelLabel = i18n.__('Record')) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new CustomError(
          i18n.__('Unique constraint failed, data already exists'),
          409
        );

      case 'P2025':
        throw new CustomError(
          i18n.__('%s not found', modelLabel),
          404
        );

      default:
        throw new CustomError(
          i18n.__('Database error: %s', error.code),
          500
        );
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new CustomError(
      i18n.__('Data validation error'),
      400
    );
  }

  throw new CustomError(
    i18n.__('Database connection error'),
    500
  );
}

module.exports = { handlePrismaError };
