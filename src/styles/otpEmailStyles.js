export default function otpStyles() {
  return `
        body {
        margin: 0;
        padding: 0;
        background-color: #f8f9fb;
        font-family: Arial, Helvetica, sans-serif;
        }

        .email-wrapper {
        width: 100%;
        padding: 40px 0;
        background-color: #f8f9fb;
        }

        .email-container {
        max-width: 480px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
        }

        .email-header {
        padding: 28px;
        background: #111827;
        color: #ffffff;
        text-align: center;
        }

        .email-header h1 {
        margin: 0;
        font-size: 22px;
        font-weight: bold;
        letter-spacing: -0.3px;
        }

        .email-body {
        padding: 32px;
        color: #1f2937;
        }

        .email-body h2 {
        font-size: 20px;
        margin-bottom: 12px;
        }

        .email-body p {
        font-size: 14px;
        line-height: 1.6;
        color: #4b5563;
        margin-bottom: 24px;
        }

        .otp-box {
        background: #f3f4f6;
        border-radius: 14px;
        padding: 18px;
        text-align: center;
        font-size: 28px;
        letter-spacing: 6px;
        font-weight: bold;
        color: #111827;
        margin-bottom: 24px;
        }

        .email-footer {
        padding: 22px 32px;
        background: #f9fafb;
        font-size: 12px;
        color: #6b7280;
        text-align: center;
        }

        .email-footer span {
        font-weight: bold;
        color: #111827;
        }
    `;
}
