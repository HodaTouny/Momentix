const { uploadModelImage, deleteImage } = require('../utils/cloudinary');
const { CustomError } = require('../utils/Errors/customErrors');
const i18n = require('../config/i18n');
const logger = require('../lib/logger');

class UploadService {
  async uploadModelImage(buffer, model, modelId) {
    try {
      return await uploadModelImage(buffer, model, modelId);
    } catch (error) {
      logger.error(error.message);
      throw new CustomError(i18n.__('Image upload failed'), 500);
    }
  }

  async deleteModelImage(publicId) {
    try {
      return await deleteImage(publicId);
    } catch (error) {
      logger.error(error.message);
      throw new CustomError(i18n.__('Image deletion failed'), 500);
    }
  }
}

module.exports = new UploadService();
