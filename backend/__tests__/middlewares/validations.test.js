const { createEventSchema, updateEventSchema } = require('../../src/validations/eventSchema');
const { registerSchema, loginSchema } = require('../../src/validations/userSchema');

const validData = {
  title_en: 'Concert',
  title_ar: 'حفلة',
  description_en: 'Music show',
  description_ar: 'عرض موسيقي',
  category_en: 'Music',
  category_ar: 'موسيقى',
  date: new Date(),
  venue_en: 'Cairo Stadium',
  venue_ar: 'استاد القاهرة',
  price: 100,
  created_by: 1
};

describe('Event Validation Schemas', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe('createEventSchema', () => {
    test('should validate valid data', () => {
      const result = createEventSchema.validate(validData);
      expect(result.error).toBeUndefined();
    });

    test('should fail when a required field is missing', () => {
      const { title_en, ...partialData } = validData;
      const result = createEventSchema.validate(partialData);
      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toMatch(/title_en/);
    });

    test('should fail when wrong data types are provided', () => {
      const badData = { ...validData, price: 'free', created_by: 'admin' };
      const result = createEventSchema.validate(badData);
      expect(result.error).toBeDefined();
      expect(result.error.details.length).toBeGreaterThan(0);
    });
  });

  describe('updateEventSchema', () => {
    test('should allow empty object (all optional)', () => {
      const result = updateEventSchema.validate({});
      expect(result.error).toBeUndefined();
    });

    test('should validate any subset of fields', () => {
      const partial = {
        title_en: 'Updated title',
        price: 250
      };
      const result = updateEventSchema.validate(partial);
      expect(result.error).toBeUndefined();
    });

    test('should fail with invalid types even if optional', () => {
      const invalid = { price: 'expensive' };
      const result = updateEventSchema.validate(invalid);
      expect(result.error).toBeDefined();
    });
  });
});

describe('Auth Validation Schemas', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerSchema', () => {
    test('valid user registration data should pass', () => {
      const result = registerSchema.validate({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePass123'
      });
      expect(result.error).toBeUndefined();
    });

    test('missing required field should fail', () => {
      const result = registerSchema.validate({
        email: 'john@example.com',
        password: 'securePass123'
      });
      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toMatch(/name/);
    });

    test('invalid email should fail', () => {
      const result = registerSchema.validate({
        name: 'John',
        email: 'invalid-email',
        password: 'securePass123'
      });
      expect(result.error).toBeDefined();
    });
  });

  describe('loginSchema', () => {
    test('valid login data should pass', () => {
      const result = loginSchema.validate({
        email: 'john@example.com',
        password: 'securePass123'
      });
      expect(result.error).toBeUndefined();
    });

    test('missing email should fail', () => {
      const result = loginSchema.validate({
        password: 'securePass123'
      });
      expect(result.error).toBeDefined();
    });

    test('missing password should fail', () => {
      const result = loginSchema.validate({
        email: 'john@example.com'
      });
      expect(result.error).toBeDefined();
    });
  });
});