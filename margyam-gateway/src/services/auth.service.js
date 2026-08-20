import prisma from '../configs/db.js';
import bcrypt from 'bcrypt';
import { ApiError, ProcessHelpers } from '../common/index.js';
import { sendEmail } from '../mailer/emailServer.js';
import { getOtpEmail } from '../mailer/templates/otpEmail.js';
import { getForgotPasswordEmail } from '../mailer/templates/forgotPasswordEmail.js';
import { getAdminSignupNotificationEmail } from '../mailer/templates/adminSignupNotification.js';
import { getBetaWaitlistEmail } from '../mailer/templates/betaWaitlist.js';

const TEST_ACCOUNTS = [
  { email: 'test@margyam.in', otp: '123456' },
  { email: 'admin@margyam.in', otp: '123456' },
];

class AuthService {
  /**
   * Send OTP via email (or mobile SMS)
   */
  async sendOtp({ email, mobile }) {
    const targetEmail = email ? email.toLowerCase().trim() : null;
    
    if (targetEmail) {
      const testAccount = TEST_ACCOUNTS.find((t) => t.email.toLowerCase() === targetEmail);
      if (testAccount) {
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await prisma.otpVerification.upsert({
          where: { email: targetEmail },
          update: { otp: testAccount.otp, expiresAt, createdAt: new Date() },
          create: { email: targetEmail, otp: testAccount.otp, expiresAt },
        });
        return { message: 'Verification code sent (Test Account bypass)' };
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await prisma.otpVerification.upsert({
        where: { email: targetEmail },
        update: { otp, expiresAt, createdAt: new Date() },
        create: { email: targetEmail, otp, expiresAt },
      });

      await sendEmail({
        to: targetEmail,
        subject: 'Your Verification Code - Margyam',
        html: getOtpEmail({ otp }),
      });

      return { message: 'Verification code sent to your email.' };
    }

    if (mobile) {
      const otp = ProcessHelpers.generateOTP(6);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.otpSession.upsert({
        where: { mobile },
        update: { otp, expiresAt },
        create: { mobile, otp, expiresAt },
      });

      return { message: 'OTP sent to mobile number.' };
    }

    throw ApiError.BadRequest('Email or mobile number is required.');
  }

  /**
   * Signup user with email, password, and OTP
   */
  async register({ fullName, email, password, otp, deviceId, referralCode }) {
    if (!email || !password || !otp) {
      throw ApiError.BadRequest('Email, password, and OTP are required');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const testAccount = TEST_ACCOUNTS.find((t) => t.email.toLowerCase() === normalizedEmail);
    const isBypass = testAccount && testAccount.otp === otp;

    if (!isBypass) {
      const otpRecord = await prisma.otpVerification.findUnique({
        where: { email: normalizedEmail },
      });

      if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
        throw ApiError.BadRequest('Invalid or expired OTP');
      }

      await prisma.otpVerification.delete({ where: { email: normalizedEmail } });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      throw ApiError.AlreadyExists('User with this email already exists');
    }

    const hashedPassword = await ProcessHelpers.hashPassword(password);
    const userReferralCode = ProcessHelpers.generateAlphanumeric(6).toUpperCase();

    const user = await prisma.user.create({
      data: {
        fullName,
        email: normalizedEmail,
        password: hashedPassword,
        referralCode: userReferralCode,
        deviceId,
        role: 'USER',
      },
    });

    // Fire-and-forget background notification emails
    sendEmail({
      to: 'namaste@margyam.in',
      subject: 'New User Registration - Margyam',
      html: getAdminSignupNotificationEmail({ name: fullName || 'User', email: normalizedEmail }),
    }).catch(() => {});

    sendEmail({
      to: normalizedEmail,
      subject: "Swagatam! You're on the list - Margyam",
      html: getBetaWaitlistEmail({ name: fullName || 'User' }),
    }).catch(() => {});

    const token = ProcessHelpers.signToken({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret');
    return { user, token };
  }

  /**
   * Login with email and password OR mobile and OTP
   */
  async login({ email, password, mobile, otp }) {
    if (email && password) {
      const normalizedEmail = email.toLowerCase().trim();
      const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (!user) throw ApiError.NotFound('Invalid credentials');

      const isMatch = await ProcessHelpers.compareHash(password, user.password);
      if (!isMatch) throw ApiError.Unauthorized('Invalid credentials');

      const token = ProcessHelpers.signToken({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret');
      return { user, token };
    }

    if (mobile && otp) {
      const session = await prisma.otpSession.findUnique({ where: { mobile } });
      if (!session || session.otp !== otp || session.expiresAt < new Date()) {
        throw ApiError.Unauthorized('Invalid or expired OTP');
      }

      let user = await prisma.user.findUnique({ where: { mobile } });
      if (!user) {
        user = await prisma.user.create({
          data: { mobile, role: 'USER', referralCode: ProcessHelpers.generateAlphanumeric(6).toUpperCase() },
        });
      }

      const token = ProcessHelpers.signToken({ userId: user.id, mobile: user.mobile, role: user.role }, process.env.JWT_SECRET || 'secret');
      return { user, token };
    }

    throw ApiError.BadRequest('Provide email & password OR mobile & OTP');
  }

  /**
   * Guest device authentication
   */
  async deviceAuth({ deviceId }) {
    if (!deviceId) throw ApiError.BadRequest('Device ID is required');

    let user = await prisma.user.findFirst({ where: { deviceId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          deviceId,
          role: 'USER',
          referralCode: ProcessHelpers.generateAlphanumeric(6).toUpperCase(),
        },
      });
    }

    const token = ProcessHelpers.signToken({ userId: user.id, deviceId: user.deviceId, role: user.role }, process.env.JWT_SECRET || 'secret');
    return { user, token };
  }

  /**
   * Forgot password OTP request
   */
  async forgotPassword({ email }) {
    if (!email) throw ApiError.BadRequest('Email is required');
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) throw ApiError.NotFound('User with this email does not exist');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpVerification.upsert({
      where: { email: normalizedEmail },
      update: { otp, expiresAt },
      create: { email: normalizedEmail, otp, expiresAt },
    });

    await sendEmail({
      to: normalizedEmail,
      subject: 'Reset Password OTP - Margyam',
      html: getForgotPasswordEmail({ otp }),
    });

    return { message: 'Password reset OTP sent to your email.' };
  }

  /**
   * Reset password with OTP
   */
  async resetPassword({ email, otp, newPassword }) {
    if (!email || !otp || !newPassword) {
      throw ApiError.BadRequest('Email, OTP, and new password are required');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpRecord = await prisma.otpVerification.findUnique({ where: { email: normalizedEmail } });

    if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
      throw ApiError.BadRequest('Invalid or expired OTP');
    }

    const hashedPassword = await ProcessHelpers.hashPassword(newPassword);

    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { password: hashedPassword },
    });

    await prisma.otpVerification.delete({ where: { email: normalizedEmail } });

    return { message: 'Password reset successfully' };
  }
}

export default new AuthService();
