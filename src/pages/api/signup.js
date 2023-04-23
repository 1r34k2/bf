// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { prisma } from '../../../lib/prisma'
import {transporter} from '../../../lib/nodemailer'
import { RandomHash } from 'random-hash'
import { randomBytes } from 'crypto'
export default async function handler(req, res) {
    const {method} = req
    const generateHash = new RandomHash({
        length: 20,
        charset: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_',
        rng: randomBytes
    });
    switch (method) {
        case 'POST':
            const hash = generateHash()
            const {username, password, email} = req.body
            const user = await prisma.user.create({
                data: {
                    username,
                    password,
                    email,
                    hash
                }
            }).then(user => {
                const info = transporter.sendMail({
                    from: '"Nyan" <nyan@ire4ka.online>',
                    to: email,
                    subject: 'Account Verification',
                    text: 'Hi, please click on the link below to verify your account.',
                    html: '<a href="http://ire4ka.online/verify?token=' + hash + '">http://ire4ka.online/verify?token=' + hash + '</a>'
                  })
                res.status(201).json(user)
            }).catch(error => {
                console.log(error)
                res.status(500).json({
                    message: error.message
                
                })
            })
            break
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
            break
    }
}


