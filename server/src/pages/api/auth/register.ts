import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../prisma/client';
import { cors, runMiddleware } from '../../../utils/corsMiddleware';
import bcrypt from 'bcryptjs'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);  

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword, 
            },
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
}
