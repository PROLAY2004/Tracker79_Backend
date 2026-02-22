import express from 'express';

import AuthController from '../controller/AuthController.js';
import UserValidation from '../validations/middleware/UserValidation.js';

const validationRequest = new UserValidation();
const auth = new AuthController();

const router = express.Router();

router.post('/signup', validationRequest.signupRequest, auth.signup); // take name, email, password
router.post('/signup/resend-otp', auth.resendSignupOtp); // take email
router.patch('/signup', validationRequest.signupVerifyRequest, auth.signupVerify); // take otp and email

router.post('/signin', validationRequest.signinRequest, auth.signin); // take email and password

// router.post('/forgot-password', auth.forgot); // take only email
// router.get(
//   '/forgot-password',
//   tokenValidator.authTokenValidator,
//   auth.resetVerify
// );
// router.patch(
//   '/forgot-password',
//   tokenValidator.authTokenValidator,
//   auth.resetPassword
// );

// router.get('/refresh', tokenValidator.refreshTokenValidator, auth.refresh);

export default router;
