
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const html = await fs.readFile(path.join(process.cwd(), 'public', 'index.html'), 'utf-8');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (e) {
    res.status(404).send('Not Found');
  }
}
