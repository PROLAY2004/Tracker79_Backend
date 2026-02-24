import records from '../models/recordsModel.js';

export default class DashboardController {
  addData = async (req, res, next) => {
    try {
      const { date, total, investment, tax, gold, platform } = req.body;

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
      const page = parseInt(req.body.page) || 1;
      const limit = 5; // Fixed at 5 rows per page
      const skip = (page - 1) * limit;

      const query = {
        userId: req.user._id.toString(),
        isDeleted: false,
      };

      // 1. Get total count for pagination UI calculation
      const totalRecordsCount = await records.countDocuments(query);

      // 2. Fetch paginated records
      const allRecords = await records
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      // 3. Get totals (Note: Summing totals usually requires a separate aggregation
      // if you want the "Global Total" and not just the "Page Total")
      const stats = await records.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalGold: { $sum: '$gold' },
            totalInvestment: { $sum: '$total' },
            investment: { $sum: '$investment' },
            totalTax: { $sum: '$tax' },
          },
        },
      ]);

      const totalStats = stats[0] || {
        totalGold: 0,
        totalInvestment: 0,
        investment: 0,
        totalTax: 0,
      };

      res.status(200).json({
        message: 'Details fetched successfully',
        success: true,
        data: {
          records: allRecords,
          totalGold: totalStats.totalGold.toFixed(4),
          totalInvestment: totalStats.totalInvestment,
          investment: totalStats.investment,
          totalTax: totalStats.totalTax,
          totalPages: Math.ceil(totalRecordsCount / limit),
          currentPage: page,
        },
      });
    } catch (err) {
      next(err);
    }
  };
}
