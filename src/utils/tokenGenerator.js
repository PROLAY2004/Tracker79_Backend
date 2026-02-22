import jwt from 'jsonwebtoken';
import configuration from '../config/config.js';

export default async function genAuthToken(userId) {
  try {
    const access_token = jwt.sign({ userId }, configuration.ACCESS_SECRET, {
      expiresIn: configuration.ACCESS_EXPIRE,
    });
    const refresh_token = jwt.sign({ userId }, configuration.REFRESH_SECRET, {
      expiresIn: configuration.REFRESH_EXPIRE,
    });

    return {
      access_token,
      refresh_token,
    };
  } catch (err) {
    throw err;
  }
}
