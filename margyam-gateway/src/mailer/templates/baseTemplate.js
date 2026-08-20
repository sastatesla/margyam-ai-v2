export const getBaseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #FDFBFC; color: #1A1612; line-height: 1.6; }
    .wrapper { padding: 40px 0; background-color: #FDFBFC; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { padding: 0 20px 40px 20px; text-align: left; }
    .logo-container { display: inline-block; background-color: #ffffff; border: 1px solid rgba(0,0,0,0.05); border-radius: 10px; padding: 6px; margin-right: 6px; }
    .logo-icon { height: 28px; width: 28px; display: block; border-radius: 6px; }
    .logo-text { height: 48px; display: inline-block; }
    .content { padding: 0 20px 40px 20px; }
    .footer { padding: 40px 20px; color: #64748B; }
    .footer-desc { font-size: 13px; font-style: italic; margin-bottom: 20px; }
    .footer-links { border-top: 1px solid rgba(0,0,0,0.05); padding-top: 20px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.4em; color: #94A3B8; }
    .badge { display: inline-block; background-color: #FFF2EB; color: #FF5F00; border: 1px solid #FFD9C2; border-radius: 50px; padding: 6px 16px; font-size: 10px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 24px; }
    .badge-dot { display: inline-block; width: 6px; height: 6px; background-color: #FF5F00; border-radius: 50%; margin-right: 6px; vertical-align: middle; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="https://margyam.in/" style="text-decoration: none; display: inline-block;">
          <div class="logo-container">
            <img src="https://margyam.in/favicon.jpg" alt="Margyam Icon" class="logo-icon" />
          </div>
          <img src="https://margyam.in/assets/TextLogo-BIQPsXIy.png" alt="Margyam AI" class="logo-text" />
        </a>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p class="footer-desc">Margyam-AI is an AI-powered predictive intelligence platform built on Astro Science and Indic wisdom systems.</p>
        <p style="font-size: 12px; margin-bottom: 20px;">Need help? <a href="mailto:namaste@margyam.in" style="color: #FF5F00; text-decoration: none;">namaste@margyam.in</a></p>
        <div class="footer-links">
          © ${new Date().getFullYear()} MARGYAM AI
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;
