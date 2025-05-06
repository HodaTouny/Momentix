const i18n = require('../../lib/i18n');
const validate = (schema) => {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          message: i18n.__('Error in request body: %s', error.details[0].message),
        });
      }  
      req.body = value;
      next();
    };
  };
  
  module.exports = validate;
  