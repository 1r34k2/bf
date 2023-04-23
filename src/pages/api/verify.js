import {prisma} from '../../../lib/prisma'

export default async function handler(req, res) {
    const {method} = req
    switch (method) {
        case 'POST':
            const {token} = req.body
            await prisma.user.updateMany({
                where: {
                    hash: token
                },
                data:{
                    verified: true
                }
            }).then(async () => {
                res.status(201).json(true)
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