// server/utils/mailer.ts
import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'emailmsgsender@gmail.com',
      pass: 'ukmc yobm ygpt jlaa',
    },
  });

  
  const mailOptions = {
    from: 'emailmsgsender@gmail.com',
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>${text}</p>

        <br><br>

        <div>
          <p>Thank you & Best Regards,</p>
          
          
         
          
            

          
        </div>
      </div>
    `,
   
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};