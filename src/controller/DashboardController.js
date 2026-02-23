import records from '../models/recordsModel.js';

export default class DashboardController {
  addData = async (req, res, next) => {
    try {
      const { date, total, investment, tax, gold } = req.body;

      const record = new records({
        date,
        total,
        investment,
        tax,
        gold,
        userId: req.user._id,
      });

      await record.save();

      res.status(200).json({
        message: 'Details Saved Successfully',
        success: true,
      });
    } catch (err) {
      next(err);
    }
  };
}
