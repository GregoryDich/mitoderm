'use server';
const nodemailer = require('nodemailer');

const emailUsername = process.env.NEXT_PUBLIC_EMAIL_USERNAME;
const emailPassword = process.env.NEXT_PUBLIC_EMAIL_PASSWORD;
const myEmail = process.env.NEXT_PUBLIC_PERSONAL_EMAIL;

export async function sendDataOnMail(formData: any) {
  const { name, email, phone } = {
    name: formData.name.value,
    email: formData.email.value,
    phone: formData.phone.value,
  };

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
      <p>Email: ${email} </p>
      <p>Phone number: ${phone} </p>
      `,
    });
    return mail;
  } catch (error) {
    return new Error('Something goes wrong');
  }
}
