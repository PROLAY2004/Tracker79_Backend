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
        message: 'Details Saved Successfully.',
        success: true,
      });
    } catch (err) {
      next(err);
    }
  };

  fetchData = async (req, res, next) => {
    try {
      const page = parseInt(req.body.page) || 1;
      const limit = 5;
      const skip = (page - 1) * limit;

      const query = {
        userId: req.user._id.toString(),
        isDeleted: false,
      };

      const totalRecordsCount = await records.countDocuments(query);
      const allRecords = await records
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

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
        message: 'Details fetched successfully.',
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

  deleteData = async (req, res, next) => {
    try {
      const updatedRecord = await records.findOneAndUpdate(
        { _id: req.body.recordId, isDeleted: false },
        { $set: { isDeleted: true } },
        { new: true }
      );

      if (!updatedRecord) {
        res.status(404);
        throw new Error('No records found');
      }

      res.status(200).json({
        message: 'Record Deleted Successfully.',
        success: true,
      });
    } catch (err) {
      next(err);
    }
  };

  editData = async (req, res, next) => {
    try {
      const updatedRecord = await records.findOneAndUpdate(
        { _id: req.body.recordId, isDeleted: false },
        {
          $set: {
            date: req.body.date,
            total: req.body.total,
            investment: req.body.investment,
            tax: req.body.tax,
            gold: req.body.gold,
          },
        },
        { new: true }
      );

      if (!updatedRecord) {
        res.status(404);
        throw new Error('No records found');
      }

      res.status(200).json({
        message: 'Record Updated Successfully.',
        success: true,
      });
    } catch (err) {
      next(err);
    }
  };

  sellData = (editData = async (req, res, next) => {
    try {
      const soldRecord = await records.findOneAndUpdate(
        { _id: req.body.recordId, isDeleted: false },
        {
          $set: {
            isSold: { $not: '$isSold' },
            soldAt: req.body.sellPrice,
          },
        },
        { new: true }
      );

      if (!soldRecord) {
        res.status(404);
        throw new Error('No records found');
      }

      res.status(200).json({
        message: 'Record Status Changed Successfully.',
        success: true,
      });
    } catch (err) {
      next(err);
    }
  });

  getGoldStats = async (req, res, next) => {
    try {
      const { filterType, page = 1, limit = 5, sellPrice } = req.body;

      // 1. Validation
      if (!sellPrice) {
        res.status(400);
        throw new Error('sellPrice is required');
      }

      const SELL_PRICE = parseFloat(sellPrice);
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      const allRecords = await records
        .find({
          userId: req.user._id,
          isDeleted: false,
          isSold: false,
        })
        .sort({ date: -1 });

      if (!allRecords || allRecords.length === 0) {
        res.status(400);
        throw new Error('Add atleast one record for statistics');
      }

      // 3. Grouping Logic
      const groupedMap = {};

      allRecords.forEach((r) => {
        const d = new Date(r.date);
        const key =
          filterType === 'monthly'
            ? `${monthNames[d.getMonth()]} ${d.getFullYear()}`
            : `${d.getFullYear()}`;

        if (!groupedMap[key]) {
          groupedMap[key] = {
            label: key,
            investment: 0,
            tax: 0,
            gold: 0,
            date: d,
          };
        }
        groupedMap[key].investment += r.investment;
        groupedMap[key].tax += r.tax;
        groupedMap[key].gold += r.gold;
      });

      // Convert Map to Array and Sort
      let processedData = Object.values(groupedMap).sort(
        (a, b) => b.date - a.date
      );

      // 4. Calculate Global Totals (using allRecords)
      const totalInvestment = allRecords.reduce((s, r) => s + r.investment, 0);
      const totalTax = allRecords.reduce((s, r) => s + r.tax, 0);
      const totalGold = allRecords.reduce((s, r) => s + r.gold, 0);
      const totalPaid = totalInvestment + totalTax;
      const currentValue = totalGold.toFixed(4) * SELL_PRICE;

      // 5. Pagination Logic (for grouped chart data)
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      const endIndex = startIndex + parseInt(limit);
      const paginatedItems = processedData.slice(startIndex, endIndex);

      // 6. Response
      res.status(200).json({
        success: true,
        message: 'Statistics Data fetched successfully.',
        data: {
          summary: {
            currentValue: currentValue.toFixed(2),
            totalPaid: totalPaid.toFixed(2),
            returnWithTax: (currentValue - totalPaid).toFixed(2),
            returnWithoutTax: (currentValue - totalInvestment).toFixed(2),
            avgReturn: totalPaid
              ? (((currentValue - totalPaid) / totalPaid) * 100).toFixed(2)
              : 0,
            totalInvestment: totalInvestment.toFixed(2),
            totalTax: totalTax.toFixed(2),
            sellPriceUsed: SELL_PRICE,
          },
          pagination: {
            totalItems: processedData.length,
            totalPages: Math.ceil(processedData.length / limit),
            currentPage: parseInt(page),
            itemsPerPage: parseInt(limit),
          },
          chartData: paginatedItems.map((item) => ({
            ...item,
            sellValue: (item.gold * SELL_PRICE).toFixed(2), // Pre-calculate for the line chart
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
