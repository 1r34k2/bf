import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'nyan@ire4ka.online',
        pass: 'wHbxX2J88kQbkgzbCS5R'
    }
})