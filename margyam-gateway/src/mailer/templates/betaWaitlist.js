import { getBaseTemplate } from './baseTemplate.js';

export const getBetaWaitlistEmail = ({ name }) => {
  const content = `
    <div class="badge"><span class="badge-dot"></span>WELCOME TO MARGYAM</div>
    <h1 style="font-family: 'Inter', Arial, sans-serif; color: #0F172A; font-size: 42px; font-weight: 800; margin: 0;">Namaste, ${name}</h1>
    <h1 style="font-family: 'Georgia', serif; color: #FF5F00; font-size: 44px; font-style: italic; margin: 0 0 24px 0;">You're on the list.</h1>
    <p style="font-size: 16px; color: #64748B;">Thank you for requesting access! We will email you an exclusive login link as soon as your access is ready.</p>
  `;
  return getBaseTemplate(content);
};
