import {prisma} from '../../../lib/prisma'
import { RandomHash } from 'random-hash'
import { randomBytes } from 'crypto'

export default async function handler(req, res) {
    const {method} = req
    switch (method) {
        case 'POST':
            const {authToken,key} = req.body
            await prisma.user.updateMany({
                where: {
                    authToken
                },
                data:{
                    key
                }
            }).then(async () => {
                res.status(201).json(authToken)
            }).catch(error => {
                res.status(500).json({
                    message: error.message
                })
            })
            break
        default:
            res.setHeader('Allow', ['POST'])
            break
    }
}