import { createServer } from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import { redirectTo } from './utils/redirectToPath.js'
import { getContentType } from './utils/getContenttype.js'

const PORT = 8000;
const __dirname = import.meta.dirname;
const dataPath = path.join(__dirname, 'data', 'testimonials.json')

const server = createServer(async (req, res) => {
  try {
    if (req.url !== '/api'){
      const pathToResources = redirectTo(req, __dirname)
      const content = await fs.readFile(pathToResources)
      const contentType = getContentType(pathToResources)

      res.setHeader('Content-Type', contentType)
      res.end(content)
      return
    }else{
      if (req.url.startsWith('/api')){
        if (req.method === 'GET'){
          const data = await fs.readFile(dataPath, 'utf-8')
          res.setHeader('Content-Type', 'application/json')
          res.end(data)
          return
        }
        else if (req.method === 'POST') {
  try {
    let body = '';

    // Collect incoming data chunks
    for await (const chunk of req) {
      body += chunk;
    }
    const { testimonial } = JSON.parse(body);
    const fileData = await fs.readFile(dataPath, 'utf-8');
    const json = JSON.parse(fileData);
    json.testimonials.unshift(testimonial);
    await fs.writeFile(dataPath, JSON.stringify(json, null, 2));
    res.statusCode = 201; // 201 = Created
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Testimonial added successfully!' }));
  } catch (err) {
    console.error('Error processing POST:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Failed to save testimonial' }));
  }
  return;
}

      }
    }
  } catch (err) {
      console.log(err)
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain')
      res.end('404: File not found')
    }
  });

server.listen(PORT, () => console.log(`Connected to the port: ${PORT}`))
