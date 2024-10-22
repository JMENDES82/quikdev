import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cors, runMiddleware } from '../../../utils/corsMiddleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await runMiddleware(req, res, cors);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        return res.status(200).json({ userId: user.id, token });
    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ message: 'Erro no servidor' });
    }
}
