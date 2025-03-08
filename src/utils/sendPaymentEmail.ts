'use server';
const nodemailer = require('nodemailer');

const emailUsername = process.env.NEXT_PUBLIC_EMAIL_USERNAME;
const emailPassword = process.env.NEXT_PUBLIC_EMAIL_PASSWORD;
const myEmail = process.env.NEXT_PUBLIC_ILONA_EMAIL;

export async function sendPaymentEmail(formData: any) {
  const { name, email, phone, amount, idNumber } = formData;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: emailUsername,
      pass: emailPassword,
    },
  });
  try {
    const mail = await transporter.sendMail({
      from: emailUsername,
      to: myEmail,
      subject: `New form submit from ${name}`,
      html: `
      <p>Name: ${name} </p>
       <p>ID Number: ${idNumber} </p>
      <p>Email: ${email} </p>
      <p>Phone number: ${phone} </p>
      <p>Payment: ${amount} </p>
      `,
    });
    return mail;
  } catch (error) {
    return new Error('Something goes wrong');
  }
}
