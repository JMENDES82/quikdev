import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const sendEmail = async (to: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT), 
        secure: false, // Usa SSL (true para a porta 465)
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
        },
    } as SMTPTransport.Options);

    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to, 
        subject, 
        text, 
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail enviado com sucesso');
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
};
