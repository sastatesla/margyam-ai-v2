import { getBaseTemplate } from './baseTemplate.js';

export const getAdminSignupNotificationEmail = ({ name, email }) => {
  const content = `
    <div class="badge"><span class="badge-dot" style="background-color: #22C55E;"></span>NEW SIGNUP</div>
    <h1 style="font-family: 'Inter', Arial, sans-serif; color: #0F172A; font-size: 32px; font-weight: 800; margin: 0;">New User</h1>
    <h1 style="font-family: 'Georgia', serif; color: #FF5F00; font-size: 34px; font-style: italic; margin: 0 0 24px 0;">Has joined Margyam.</h1>
    <p style="font-size: 16px; color: #64748B;">
      <strong>Name:</strong> ${name}<br/>
      <strong>Email:</strong> ${email}
    </p>
  `;
  return getBaseTemplate(content);
};
