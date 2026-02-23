import bcrypt from 'bcrypt';

import user from '../models/userModel.js';
import otp from '../models/otpModel.js';
import sendOtp from '../utils/otpGenerator.js';
import genAuthToken from '../utils/tokenGenerator.js';

export default class AuthController {
  signup = async (req, res, next) => {
    try {
      const isUser = await user.findOne({ email: req.body.email });
      req.body.password = await bcrypt.hash(req.body.password, 10);

      if (isUser && isUser.isVerified) {
        res.status(400);

        throw new Error('Email already registered.');
      }

      await user.findOneAndUpdate(
        { email: req.body.email },
        { $set: req.body },
        { upsert: true, new: true, runValidators: true }
      );

      await sendOtp(req.body.email, 'signup');

      res.status(200).json({
        message: 'Verification OTP sent to email.',
        success: true,
      });
    } catch (err) {
      next(err);
    }
  };

  resendSignupOtp = async (req, res, next) => {
    try {
      const email = req.body.email;

      if (!email) {
        res.status(400);
        throw new Error('Please Enter a email');
      }

      await sendOtp(email, 'signup');

      res.status(200).json({
        message: 'Verification OTP resent to email.',
        success: true,
      });
    } catch (err) {
      next(err);
    }
  };

  signupVerify = async (req, res, next) => {
    try {
      const { userOtp, email } = req.body;

      const latestOtp = await otp
        .findOne({ email, type: 'signup' })
        .sort({ createdAt: -1 });

      if (!latestOtp) {
        res.status(404);
        throw new Error('OTP not found, Please request for new OTP');
      }

      if (latestOtp.otp !== userOtp) {
        res.status(400);
        throw new Error('Invalid OTP Entered');
      }

      if (Date.now() - latestOtp.createdAt.getTime() > 5 * 60 * 1000) {
        res.status(400);
        throw new Error('OTP Expired, Please request for new OTP');
      }

      await user.findOneAndUpdate(
        { email },
        { isVerified: true },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        message: 'User Registered Successfully.',
        success: true,
      });
    } catch (err) {
      next(err);
    }
  };

  signin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const userinfo = await user.findOne({ email });

      if (!userinfo) {
        res.status(404);
        throw new Error(`User does not exists`);
      }

      if (!userinfo.isVerified) {
        res.status(400);
        throw new Error(`Email Verification Pending`);
      }

      const isMatched = await bcrypt.compare(password, userinfo.password);

      if (!isMatched) {
        res.status(401);
        throw new Error('Password is incorrect');
      }

      const tokens = await genAuthToken(userinfo._id);

      res.status(200).json({
        message: 'User logged in successfully.',
        success: true,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });
    } catch (err) {
      next(err);
    }
  };

  reset = async (req, res, next) => {
    try {
      const email = req.body.email;

      if (!email) {
        res.status(400);
        throw new Error('Please Enter a email');
      }

      const existingUser = await user.findOne({ email });

      if (!existingUser) {
        res.status(404);

        throw new Error('User doesnot exists');
      } else if (!existingUser.isVerified) {
        res.status(400);

        throw new Error('User verification pending');
      }

      await sendOtp(email, 'reset');

      res.status(200).json({
        message: 'Password reset OTP sent to email.',
        success: true,
      });
    } catch (err) {
      next(err);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { email, userOtp, newPassword } = req.body;
      const password = await bcrypt.hash(newPassword, 10);

      const latestOtp = await otp
        .findOne({ email, type: 'reset' })
        .sort({ createdAt: -1 });

      if (!latestOtp) {
        res.status(404);
        throw new Error('OTP not found, Please request for new OTP');
      }

      if (latestOtp.otp !== userOtp) {
        res.status(400);
        throw new Error('Invalid OTP Entered');
      }

      if (Date.now() - latestOtp.createdAt.getTime() > 5 * 60 * 1000) {
        res.status(400);
        throw new Error('OTP Expired, Please request for new OTP');
      }

      await user.findOneAndUpdate(
        { email },
        { password },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        message: 'Password Updated Successfully.',
        success: true,
      });
    } catch (err) {
      next(err);
    }
  };

  refresh = async (req, res, next) => {
    try {
      const tokens = await genAuthToken(req.user._id);

      res.status(200).json({
        message: 'New tokens Provided',
        success: true,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });
    } catch (err) {
      next(err);
    }
  };
}
