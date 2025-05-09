// server/api/sendEmail.post.ts
import { sendEmail } from '../utils/mailer'; // correct the path as needed
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  const { to, subject, text } = body;

  if (!to || !subject || !text) {
    return { success: false, message: 'Missing fields' };
  }

  try {
    await sendEmail(to, subject, text);
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    return { success: false, message: 'Failed to send email.' };
  }
});
