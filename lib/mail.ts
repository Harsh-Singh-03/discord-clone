import nodemailer from 'nodemailer'

export const sendEmail = async (email: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST!,
      service: process.env.SERVICE!,
      port: 587,
      secure: true,
      auth: {
        user: process.env.USER!,
        pass: process.env.PASS!,
      },
    });

    await transporter.sendMail({
      from: process.env.USER!,
      to: email,
      subject: subject,
      html: text,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};
