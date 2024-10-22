import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../prisma/client';
import { cors, runMiddleware } from '../../utils/corsMiddleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors);
    const posts = await prisma.post.findMany({
        include: {
            _count: {
                select: {
                    comments: true,
                },
            },
        },
    });

    const report = posts.map((post: { title: any; _count: { comments: any; }; views: any; likes: any; dislikes: any; }) => ({
        title: post.title,
        comments: post._count.comments,
        views: post.views,
        likes: post.likes,
        dislikes: post.dislikes,
    }));

    res.json(report);
}
