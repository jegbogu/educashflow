import nodemailer from "nodemailer";

export async function sendResetEmail(to, link) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Password Reset Request",
    html: `
    <div style="padding:30px">
    <div style="background-color:#2b6cb0;color:#fff;padding:20px;text-align:center"><div class="adM">
          </div><h1 style="margin:0">Eduquizz Global Limited</h1>
        </div>
      <p>You requested a password reset.</p>
      <p>Click the link below to set a new password:</p>
      <a href="${link}">${link}</a>
      <p>This link will expire in <strong>15 minutes</strong>.</p>

      <div style="background-color:#f8f8f8;padding:15px;text-align:center;font-size:13px;color:#777">

      <p>If you did not make this change, please contact support immediately.</p>
          <p>© 2025 Eduquizz Global Limited. All rights reserved.</p>
          <p>Need help? <a href="mailto:jegbogu@gmail.com" style="color:#2b6cb0" target="_blank">Contact Support</a></p><div class="yj6qo"></div><div class="adL">
        </div></div>
        </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}
