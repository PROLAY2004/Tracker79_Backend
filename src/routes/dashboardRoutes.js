import express from 'express';

import DashboardController from '../controller/DashboardController.js';
import recordValidator from '../validations/middleware/recordValidation.js';

const dashboard = new DashboardController();
const router = express.Router();

router.post('/dashboard', recordValidator, dashboard.addData);
router.post('/dashboard/get-data', dashboard.fetchData);

export default router;
