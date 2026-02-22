import SendEmailService from '../services/SendEmailService.js';
import otp from '../models/otpModel.js';

const emailService = new SendEmailService();

export default async function sendOtp(email, method) {
  try {
    const newOtp = Math.floor(100000 + Math.random() * 900000);
    
    const latestOtp = await otp
      .findOne({ email, type: method })
      .sort({ createdAt: -1 });
    const remainingTime = Date.now() - latestOtp.createdAt.getTime();

    if (remainingTime < 5 * 60 * 1000) {
      const minutes = Math.ceil((5 * 60 * 1000 - remainingTime) / (1000 * 60));
      throw new Error(`Try again after ${minutes} minutes`);
    }

    await otp.create({
      otp: newOtp,
      email,
      type: method,
    });

    await emailService.otpMailer(email, newOtp, method);
  } catch (error) {
    throw error;
  }
}
