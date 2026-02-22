import otpStyles from '../styles/otpEmailStyles.js';

export default function otpTemplate(otp, method) {
  const subject = method === 'signup' ? 'Email Verification' : 'Password Reset';

  return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="UTF-8">
            <title>Verify your email</title>
            <style>
            ${otpStyles()}
            </style>
            </head>

            <body>
                <div class="email-wrapper">
                    <div class="email-container">
                        <div class="email-header">
                            <h1>Tracker79</h1>
                        </div>

                        <!-- Body -->
                        <div class="email-body">
                            <h2>${subject}</h2>
                            <p>
                            Use the verification code below to complete your ${method === 'signup' ? 'sign up' : 'password reset'}.
                            This code is valid for the next <strong>5 minutes</strong>.
                            </p>

                            <div class="otp-box">
                            ${otp}
                            </div>

                            <p>
                            If you didn’t request this code, you can safely ignore this email.
                            </p>
                        </div>

                        <div class="email-footer">
                            © 2026 <span>Tracker79</span>. All rights reserved.
                        </div>
                    </div>
                </div>
            </body>
        </html>
  `;
}
