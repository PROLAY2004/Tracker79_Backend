import configuration from '../../config/config.js';
import user from '../../models/userModel.js';
import verifyToken from '../../utils/tokenValidator.js';

export default class TokenValidation {
  accessTokenValidator = async (req, res, next) => {
    try {
      const decoded = verifyToken(req, configuration.ACCESS_SECRET);
      const appUser = await user.findOne({ _id: decoded.userId });

      if (!appUser) {
        res.status(404);
        throw new Error('User doesnot exists');
      }

      req.user = appUser;

      next();
    } catch (err) {
      if (err.message == 'jwt expired') {
        res.status(401);
      }

      next(err);
    }
  };

  refreshTokenValidator = async (req, res, next) => {
    try {
      const decoded = verifyToken(req, configuration.REFRESH_SECRET);
      const appUser = await user.findOne({ _id: decoded.userId });

      if (!appUser) {
        res.status(404);
        throw new Error('User doesnot exists');
      }

      req.user = appUser;

      next();
    } catch (err) {
      if (err.message == 'jwt expired') {
        res.status(401);
      }

      next(err);
    }
  };
}
