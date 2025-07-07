
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const file = path.join(process.cwd(), 'public', 'index.html');
    const html = await fs.readFile(file, 'utf-8');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (err) {
    res.status(500).send('Internal server error');
  }
}
