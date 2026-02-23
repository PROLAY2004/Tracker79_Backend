import express from 'express';

import DashboardController from '../controller/DashboardController.js';
import TokenValidation from '../validations/middleware/TokenValidation.js';
import recordValidator from '../validations/middleware/recordValidation.js';

const dashboard = new DashboardController();
const tokenValidator = new TokenValidation();
const router = express.Router();

router.post(
  '/dashboard',
  tokenValidator.accessTokenValidator,
  recordValidator,
  dashboard.addData
);

export default router;
