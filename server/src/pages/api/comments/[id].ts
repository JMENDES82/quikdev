import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../../utils/sendEmail';
import { prisma } from '../../../../prisma/client';
import { cors, runMiddleware } from '../../../utils/corsMiddleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors);
    const commentId = Number(req.query.id);

    if (req.method === 'PUT') {
        const { description } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = (decoded as any).userId;
        
        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        
        if (comment?.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        
        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: { description },
        });
        
        res.json(updatedComment);
    } else if (req.method === 'DELETE') {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = (decoded as any).userId;
        
        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        
        if (comment?.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        
        await prisma.comment.update({
            where: { id: commentId },
            data: { isDeleted: true },
        });
        
        res.status(204).end();
    } else if (req.method === 'POST') {
        const { postId, description } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = (decoded as any).userId;

        const newComment = await prisma.comment.create({
            data: {
                userId,
                postId,
                description,
            },
        });

        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { user: true },  
        });

        if (post && post.user?.email) {
            const subject = 'Novo comentário no seu post';
            const text = `Você recebeu um novo comentário no seu post "${post.title}".`;
            await sendEmail(post.user.email, subject, text);
        }

        res.status(201).json(newComment);
    }
}
