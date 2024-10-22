import formidable from 'formidable';
import { NextApiRequest } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export const parseForm = async (req: NextApiRequest) => {
  const form = formidable({ multiples: false, uploadDir: './public/uploads', keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};
