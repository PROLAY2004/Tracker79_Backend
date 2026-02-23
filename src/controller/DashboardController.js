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

  fetchData = async (req, res, next) => {
    try {
      let totalGold = 0;
      let totalInvestment = 0;
      let investment = 0;

      const allRecords = await records
        .find({
          userId: req.user._id,
          isDeleted: false,
        })
        .sort({ createdAt: -1 });

      for (const record of allRecords) {
        totalGold += record.gold;
        totalInvestment += record.total;
        investment += record.investment;
      }

      res.status(200).json({
        message: 'Details fetched successfully',
        success: true,
        data: {
          records: allRecords,
          totalGold,
          totalInvestment,
          investment,
        },
      });
    } catch (err) {
      next(err);
    }
  };
}
