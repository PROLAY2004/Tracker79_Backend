import express from 'express';

import DashboardController from '../controller/DashboardController.js';
import recordValidator from '../validations/middleware/recordValidation.js';

const dashboard = new DashboardController();
const router = express.Router();

router.post('/dashboard', recordValidator, dashboard.addData);
router.post('/dashboard/get-data', dashboard.fetchData);
router.delete('/dashboard', dashboard.deleteData);
router.patch('/dashboard', recordValidator, dashboard.editData);
router.post('/stats', dashboard.getGoldStats);

export default router;
