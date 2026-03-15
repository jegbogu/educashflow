
import nodemailer from "nodemailer";
export default async function handler(req, res){
  if(req.method !=='POST'){
   return res.status(404).json({message:'Method not allowed'})
  }
  try {
    const{userData} = req.body

  

  if(userData.email.includes('noemail')){
     return  res.status(404).json({message:'You have to first update your account, click on the notification bell, then click on Update Now'})
  }

    // Create a nodemailer transporter from env
function createTransporter() {
  // Prefer explicit SMTP (works on most hosts), fallback to Gmail "service"
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  // Fallback (Gmail service). For Gmail, ensure you use an App Password.
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}
sendActivationEmail(userData.email, userData.id, userData.fullname)
// Send activation email; swallow/throw errors to let handler decide behavior
async function sendActivationEmail(email, userId, fullname ) {
  const transporter = createTransporter();

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const activationLink = `${baseUrl}/api/activate/${userId}`;

  await transporter.sendMail({
    from: `"Eduquizz Global Limited" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Activate your Eduquizz Global Limited Account",
    text: `
Welcome to Eduquizz Global Limited!

Thank you for registering. To activate your account, click the link below:

${activationLink}

If you did not create this account, please ignore this email.

----------------------
Eduquizz Global Limited Team
${new Date().getFullYear()} © All rights reserved.
Support: ${process.env.EMAIL_USER}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2b6cb0; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">Eduquizz Global Limited</h1>
        </div>
        <div style="padding: 30px; color: #333;">
          <h2 style="color: #2b6cb0; margin-top: 0;">Welcome, ${fullname || "User"}!</h2>
          <p style="font-size: 15px; line-height: 1.6;">
            Thank you for registering with <b>Eduquizz Global Limited</b>. To activate your account and get started, 
            please click the button below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${activationLink}" target="_blank" 
              style="background-color: #2b6cb0; color: #fff; text-decoration: none; 
                     padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block;">
              Activate My Account
            </a>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #555;">
            If you did not create this account, you can safely ignore this email.
          </p>
        </div>
        <div style="background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 13px; color: #777;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Eduquizz Global Limited. All rights reserved.</p>
          <p style="margin: 5px 0;">Need help? <a href="mailto:${process.env.EMAIL_USER}" style="color: #2b6cb0; text-decoration: none;">Contact Support</a></p>
        </div>
      </div>
    `,
  });
}
return  res.status(200).json({message:`Check your email: ${userData.email}, to activate your account`})
  } catch (error) {
    console.error(error)
    return  res.status(500).json({message:'Internal Server Error'})
  }
  
}
