import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../prisma/client';
import { cors, runMiddleware } from '../../../utils/corsMiddleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors);
    const userId = Number(req.query.id);

    if (req.method === 'GET') {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        return res.json(user);
    } else if (req.method === 'PUT') {
        const { name, email } = req.body;
        
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name, email },
        });
        
        res.json(updatedUser);
    } else if (req.method === 'DELETE') {
        await prisma.user.delete({ where: { id: userId } });
        res.status(204).end();
    }
}
