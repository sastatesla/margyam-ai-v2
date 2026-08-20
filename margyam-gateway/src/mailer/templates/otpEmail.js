import { getBaseTemplate } from './baseTemplate.js';

export const getOtpEmail = ({ otp }) => {
  const content = `
    <div class="badge"><span class="badge-dot"></span>VERIFY YOUR EMAIL</div>
    <h1 style="font-family: 'Inter', Arial, sans-serif; color: #0F172A; font-size: 36px; font-weight: 800; margin: 0; line-height: 1.1; letter-spacing: -1px;">Your Verification</h1>
    <h1 style="font-family: 'Georgia', 'Times New Roman', serif; color: #FF5F00; font-size: 40px; font-style: italic; font-weight: 400; margin: 0 0 24px 0; line-height: 1.1;">Code</h1>
    <p style="font-size: 16px; color: #64748B; font-weight: 500; margin-bottom: 20px;">Use the verification code below to complete your sign up. Valid for 10 minutes.</p>
    <div style="background-color: #FFF2EB; border: 1px solid #FFD9C2; border-radius: 12px; padding: 24px; text-align: center; margin: 28px 0;">
      <span style="font-size: 42px; font-weight: 900; letter-spacing: 8px; color: #FF5F00;">${otp}</span>
    </div>
  `;
  return getBaseTemplate(content);
};
