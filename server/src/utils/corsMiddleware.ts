import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

const cors = Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    origin: 'http://localhost:3001',  
    credentials: true,
});

export function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export { cors };
