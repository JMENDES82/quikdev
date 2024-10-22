import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../prisma/client';
import { cors, runMiddleware } from '../../../utils/corsMiddleware';
import { parseForm } from '../../../utils/parseForm';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors);

    if (req.method === 'GET') {
        const posts = await prisma.post.findMany({
            include: {
                comments: true
            }
        });
        return res.json(posts);
    } else if (req.method === 'POST') {
        try {
            const { fields, files }: any = await parseForm(req);
            const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
            const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;

            
            let imageUrl = null;
            console.log('files:', files.image[0].newFilename);
            if (files && files.image && files.image[0].filepath && files.image[0].newFilename) {
                const oldPath = files.image[0].filepath;
                const fileName = files.image[0].newFilename;


                
                const uploadDir = path.join(process.cwd(), 'public/uploads');

                
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                const newPath = path.join(uploadDir, fileName);

                fs.renameSync(oldPath, newPath);

                imageUrl = `${req.headers.host}/uploads/${fileName}`;
            }

            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            const userId = (decoded as any).userId;

            const newPost = await prisma.post.create({
                data: {
                    title,
                    description,
                    imageUrl,
                    userId,
                    editHistory: '',
                },
            });

            res.status(201).json(newPost);
        } catch (error) {
            console.error('Erro ao criar postagem:', error);
            res.status(500).json({ message: 'Erro no servidor' });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}
