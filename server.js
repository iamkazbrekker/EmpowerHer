import { createServer } from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import { redirectTo } from './utils/redirectToPath.js';
import { getContentType } from './utils/getContenttype.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { createHash, randomBytes } from 'node:crypto';
import { parse } from 'node:url';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8000;
const dataPath = path.join(__dirname, 'data', 'testimonials.json');
const dbPath = path.join(__dirname, 'empowerher.db');

<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
      }
    }
  } catch (err) {
      console.log(err)
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain')
      res.end('404: File not found')
    }
=======
=======
>>>>>>> Stashed changes
// ---------- SQLite Setup ----------
let db;
(async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      unlocked_upto INTEGER DEFAULT 1,
      dob TEXT,
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now'))
    );
  `);
})();

// ---------- Utility Functions ----------
function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

function sendJSON(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  return Object.fromEntries(
    header
      .split(';')
      .filter(Boolean)
      .map(c => c.trim().split('=').map(decodeURIComponent))
  );
}

function setCookie(res, name, value) {
  res.setHeader('Set-Cookie', `${name}=${encodeURIComponent(value)}; HttpOnly; Path=/`);
}

// Simple in-memory sessions
const sessions = new Map();
function createSession(userId) {
  const token = randomBytes(16).toString('hex');
  sessions.set(token, userId);
  return token;
}
function getUserIdFromSession(req) {
  const cookies = parseCookies(req);
  const token = cookies.session;
  return sessions.get(token);
}

// ---------- Server ----------
const server = createServer(async (req, res) => {
  try {
    const { pathname } = parse(req.url, true);

    // ---------------- AUTH ROUTES ----------------

    // SIGNUP
    if (pathname === '/api/signup' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const { name, email, password } = JSON.parse(body);
      if (!name || !email || !password)
        return sendJSON(res, 400, { error: 'Missing fields' });

      const hashed = hashPassword(password);
      try {
        await db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [
          name.trim(),
          email.trim().toLowerCase(),
          hashed
        ]);
        return sendJSON(res, 201, { message: 'Signup successful' });
      } catch (err) {
        if (err.message.includes('UNIQUE'))
          return sendJSON(res, 409, { error: 'Email already registered' });
        return sendJSON(res, 500, { error: 'Database error' });
      }
    }

    // LOGIN
    if (pathname === '/api/login' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const { email, password } = JSON.parse(body);
      if (!email || !password)
        return sendJSON(res, 400, { error: 'Missing credentials' });

      const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email.trim().toLowerCase()]);
      if (!user) return sendJSON(res, 401, { error: 'Invalid credentials' });

      const hashed = hashPassword(password);
      if (hashed !== user.password)
        return sendJSON(res, 401, { error: 'Invalid credentials' });

      const token = createSession(user.id);
      setCookie(res, 'session', token);
      return sendJSON(res, 200, {
        message: 'Login successful',
        user: { name: user.name, email: user.email, unlocked_upto: user.unlocked_upto }
      });
    }

    // LOGOUT
    if (pathname === '/api/logout' && req.method === 'POST') {
      const cookies = parseCookies(req);
      if (cookies.session) sessions.delete(cookies.session);
      res.setHeader('Set-Cookie', 'session=; Max-Age=0; Path=/');
      return sendJSON(res, 200, { message: 'Logged out' });
    }

    // GET USER
    if (pathname === '/api/user' && req.method === 'GET') {
      const userId = getUserIdFromSession(req);
      if (!userId) return sendJSON(res, 401, { error: 'Unauthorized' });
      const user = await db.get(`SELECT id, name, email, unlocked_upto, dob FROM users WHERE id = ?`, [userId]);
      return sendJSON(res, 200, { user });
    }

    // UPDATE PROFILE
    if (pathname === '/api/profile' && req.method === 'PUT') {
      const userId = getUserIdFromSession(req);
      if (!userId) return sendJSON(res, 401, { error: 'Unauthorized' });

      let body = '';
      for await (const chunk of req) body += chunk;
      const { name, dob, password } = JSON.parse(body);
      const fields = [];
      const params = [];

      if (name) {
        fields.push('name = ?');
        params.push(name);
      }
      if (dob) {
        fields.push('dob = ?');
        params.push(dob);
      }
      if (password) {
        fields.push('password = ?');
        params.push(hashPassword(password));
      }

      if (fields.length === 0)
        return sendJSON(res, 400, { error: 'No changes provided' });

      params.push(userId);
      await db.run(`UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, params);
      return sendJSON(res, 200, { message: 'Profile updated' });
    }

    // GET UNLOCKED
    if (pathname === '/api/unlocked' && req.method === 'GET') {
      const userId = getUserIdFromSession(req);
      if (!userId) return sendJSON(res, 401, { error: 'Unauthorized' });
      const { unlocked_upto } = await db.get(`SELECT unlocked_upto FROM users WHERE id = ?`, [userId]);
      return sendJSON(res, 200, { unlocked_upto });
    }

    // UPDATE UNLOCKED
    if (pathname === '/api/unlocked' && req.method === 'POST') {
      const userId = getUserIdFromSession(req);
      if (!userId) return sendJSON(res, 401, { error: 'Unauthorized' });

      let body = '';
      for await (const chunk of req) body += chunk;
      const { unlocked_upto } = JSON.parse(body);

      if (!Number.isInteger(unlocked_upto))
        return sendJSON(res, 400, { error: 'Invalid value' });

      await db.run(`UPDATE users SET unlocked_upto = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [unlocked_upto, userId]);
      return sendJSON(res, 200, { message: 'Progress updated' });
    }

    // ---------------- TESTIMONIAL API ----------------
    if (pathname === '/api/testimonials' && req.method === 'GET') {
      try {
        await fs.mkdir(path.dirname(dataPath), { recursive: true });
        let data;
        try {
          data = await fs.readFile(dataPath, 'utf-8');
        } catch {
          await fs.writeFile(dataPath, JSON.stringify({ testimonials: [] }, null, 2));
          data = JSON.stringify({ testimonials: [] });
        }
        return sendJSON(res, 200, JSON.parse(data));
      } catch (err) {
        console.error('Error reading testimonials:', err);
        return sendJSON(res, 500, { error: 'Failed to read testimonials' });
      }
    }

    if (pathname === '/api/testimonials' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const { testimonial } = JSON.parse(body);

      if (!testimonial || typeof testimonial !== 'string')
        return sendJSON(res, 400, { error: 'Invalid testimonial content' });

      try {
        await fs.mkdir(path.dirname(dataPath), { recursive: true });
        let json = { testimonials: [] };

        try {
          const fileData = await fs.readFile(dataPath, 'utf-8');
          json = JSON.parse(fileData);
          if (!Array.isArray(json.testimonials)) json.testimonials = [];
        } catch {
          console.log('Creating new testimonials.json file...');
        }

        json.testimonials.unshift(testimonial);
        await fs.writeFile(dataPath, JSON.stringify(json, null, 2));
        return sendJSON(res, 201, { message: 'Testimonial added successfully!' });
      } catch (err) {
        console.error('Error processing POST:', err);
        return sendJSON(res, 500, { error: 'Failed to save testimonial', details: err.message });
      }
    }

    // ---------------- STATIC FILES ----------------
    if (pathname.startsWith('/api/')) {
      return sendJSON(res, 404, { error: 'API endpoint not found' });
    }

    try {
      const pathToResources = redirectTo(req, __dirname);
      const content = await fs.readFile(pathToResources);
      const contentType = getContentType(pathToResources);
      res.setHeader('Content-Type', contentType);
      res.end(content);
    } catch {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('404: File not found');
    }
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

server.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
