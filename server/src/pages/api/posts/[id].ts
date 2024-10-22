import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../prisma/client';
import { cors, runMiddleware } from '../../../utils/corsMiddleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors);
    const postId = Number(req.query.id);

    if (req.method === 'GET') {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { comments: true },
        });

        if (post?.editHistory) {
            post.editHistory = JSON.parse(post.editHistory);
        }

        return res.json(post);
    } else if (req.method === 'PUT') {
        const { title, description, imageUrl } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = (decoded as any).userId;
        
        const post = await prisma.post.findUnique({ where: { id: postId } });
        
        if (post?.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        
        const currentEditHistory = post?.editHistory ? JSON.parse(post.editHistory) : [];
        const newEditHistory = [
            ...currentEditHistory,
            {
                date: new Date().toISOString(),
                action: 'Post atualizado',
            }
        ];

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: {
                title,
                description,
                imageUrl,
                editHistory: JSON.stringify(newEditHistory),  
            },
        });
        
        res.json(updatedPost);
    } else if (req.method === 'DELETE') {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = (decoded as any).userId;

        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (post?.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        try {
        
            await prisma.comment.deleteMany({
                where: { postId: postId }
            });

            await prisma.post.delete({
                where: { id: postId },
            });

            res.status(204).end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao excluir o post' });
        }
    }
}
