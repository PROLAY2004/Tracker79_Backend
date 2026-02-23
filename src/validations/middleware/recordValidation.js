import recordSchema from '../schema/recordSchema.js';
import { ValidationError } from 'yup';

const recordValidator = async (req, res, next) => {
  try {
    await recordSchema.validate(req.body, {
      abortEarly: false, // return all validation errors
      stripUnknown: true, // remove unexpected fields
    });

    next();
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400);
      next(new Error(err.errors.join(', ')));
    }

    next(err);
  }
};

export default recordValidator;
