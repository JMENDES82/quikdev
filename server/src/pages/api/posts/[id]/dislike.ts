import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../prisma/client';
import { cors, runMiddleware } from '../../../../utils/corsMiddleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors);
    const postId = Number(req.query.id);

    if (req.method === 'POST') {
        try {
            const updatedPost = await prisma.post.update({
                where: { id: postId },
                data: {
                    dislikes: {
                        increment: 1, 
                    },
                },
            });

            return res.status(200).json(updatedPost);
        } catch (error) {
            console.error('Erro ao atualizar descurtidas:', error);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
    } else {
        return res.status(405).json({ message: 'Método não permitido' });
    }
}
