export default class DashboardController {
  addData = async (req, res, next) => {
    try {
      const appUser = req.user;

      res.status(200).json({
        message: '',
        success: true,
      });
    } catch (err) {
      next(err);
    }
  };
}
