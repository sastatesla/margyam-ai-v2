import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtpout.secureserver.net",
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || "namaste@margyam.in",
    pass: process.env.SMTP_PASS || "margyam@ai",
  },
  connectionTimeout: 15000,
  socketTimeout: 15000,
  tls: { rejectUnauthorized: false },
});

export const sendEmail = async ({ to, subject, html }) => {
  let lastError;
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const info = await transporter.sendMail({
        from: '"Margyam" <namaste@margyam.in>',
        to,
        subject,
        html,
      });
      return info;
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  throw lastError;
};
