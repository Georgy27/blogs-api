import nodemailer from "nodemailer";

export class EmailAdapter {
  async sendEmail(email: string, message: string) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    let result = await transporter.sendMail({
      from: `"Georgy" ${process.env.GMAIL_PASSWORD}`,
      to: email,
      subject: "Attachments",
      html: message,
    });
    return result;
  }
}
