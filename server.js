const express  = require('express');
const sqlite3  = require('sqlite3').verbose();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const path     = require('path');
const cors     = require('cors');

const app    = express();
const PORT   = 3000;
const SECRET = 'bxrrett_secret_2025';

// ── Init DB ──────────────────────────────────────────────────
const db = new sqlite3.Database(path.join(__dirname, 'bxrrett.db'));

// Promisify helpers
function run(sql, params = []) {
  return new Promise((res, rej) =>
    db.run(sql, params, function (err) { err ? rej(err) : res(this); })
  );
}
function get(sql, params = []) {
  return new Promise((res, rej) =>
    db.get(sql, params, (err, row) => err ? rej(err) : res(row))
  );
}
function all(sql, params = []) {
  return new Promise((res, rej) =>
    db.all(sql, params, (err, rows) => err ? rej(err) : res(rows))
  );
}

async function initDB() {
  await run(`CREATE TABLE IF NOT EXISTS members (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT    NOT NULL,
    role    TEXT    NOT NULL DEFAULT 'member',
    photo   TEXT,
    bio     TEXT,
    fb      TEXT,
    ig      TEXT,
    tt      TEXT,
    ord     INTEGER DEFAULT 999
  )`);

  await run(`CREATE TABLE IF NOT EXISTS admins (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT    UNIQUE NOT NULL,
    password TEXT    NOT NULL
  )`);

  // Seed default admin
  const adminRow = await get('SELECT COUNT(*) as c FROM admins');
  if (adminRow.c === 0) {
    const hash = bcrypt.hashSync('bxrrett1234', 10);
    await run('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', hash]);
    console.log('✅ Default admin created: admin / bxrrett1234');
  }

  // Seed members
  const memberRow = await get('SELECT COUNT(*) as c FROM members');
  if (memberRow.c === 0) {
    const seed = [
      { name:'Massimo Toya',       role:'leader', photo:'https://scontent.fbkk8-3.fna.fbcdn.net/v/t39.30808-6/492042802_122215173422205152_6101279449908198173_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=1d70fc&_nc_eui2=AeF3RjoIkJakd1xitR0nCiBVs-2TKJ2lsw6z7ZMonaWzDv7vD5VVAy3luNtJfk8FvWBnwSdoM7FXtgWhOSwxADd-&_nc_ohc=_-lxNjX1JfQQ7kNvwFOv85Z&_nc_oc=AdlQ5ESO2oo9eyXEu3DJVoSFKNmzu-yEsV4UMrzSG5OqqDDSnhhGnuVPqzE3VLMPEoJxX7-HO8Qe1nFk3cxoLo8h&_nc_zt=23&_nc_ht=scontent.fbkk8-3.fna&_nc_gid=YaaEdhO7e0WHEf048S-Bvw&_nc_ss=8&oh=00_AfxFG50FiX-o8U5DrPNwZrrWNxnvf7gIzpGtSQTZJV46wQ&oe=69BB6128', bio:'Founder & Leader of Bxrrett.', fb:'https://www.facebook.com/massimo.sukkasem', ig:null, tt:null, ord:1 },
      { name:'Sammie GalleryWalk', role:'leader', photo:null, bio:null, fb:null,    ig:null, tt:null, ord:2 },
      { name:'Zen Nosay',          role:'leader', photo:'https://scontent.fbkk12-4.fna.fbcdn.net/v/t39.30808-1/476442544_477705088729761_7688757342109322069_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=103&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeGJ8EF-tSBaesO53tSCIeSbi9HRvaC--XeL0dG9oL75d9f8F6E86uspYr75v--Cf5_VnmjaGda1bSfwESaoBXg3&_nc_ohc=VdnD90IN1_MQ7kNvwGVRqbM&_nc_oc=AdlEJR1OEoRELsXRdDueJ-DnnSaRD0wCxtYBoaP_3Riugvq7enFq049gn_IfiokFIJFF3vGRXSaWn_49O2hrBHEf&_nc_zt=24&_nc_ht=scontent.fbkk12-4.fna&_nc_gid=4Vrgu1MKMZSh_GrItd_i0A&_nc_ss=8&oh=00_Afwqyuuq4DjIfyauvHmoTkg1Y00uPINmNRkD0LAv4Wm7pQ&oe=69BC70E6', bio:null, fb:'https://www.facebook.com/zen.freaks', ig:null, tt:null, ord:3 },
      { name:'Jayz Lyfe',          role:'member', photo:null, bio:null, fb:'https://www.facebook.com/jayz.lyfestyle', ig:null, tt:null, ord:4 },
      { name:'Pegasus Lyfe',       role:'member', photo:null, bio:null, fb:'#', ig:null, tt:null, ord:5 },
      { name:'Pleum Lyfestyle',    role:'member', photo:null, bio:null, fb:'#', ig:null, tt:null, ord:6 },
      { name:'Justx Lyfestyle',    role:'member', photo:null, bio:null, fb:'#', ig:null, tt:null, ord:7 },
      { name:'Fatez Smith',        role:'member', photo:null, bio:null, fb:'#', ig:null, tt:null, ord:8 },
      { name:'Roll Bxrrett',       role:'member', photo:null, bio:null, fb:'https://www.facebook.com/rin.strainglean', ig:null, tt:null, ord:9 },
      { name:'Brisbane Bxrrett',   role:'member', photo:null, bio:null, fb:'#', ig:null, tt:null, ord:10 },
      { name:'Recon Lyfestyle',    role:'member', photo:null, bio:null, fb:'#', ig:null, tt:null, ord:11 },
    ];
    for (const m of seed) {
      await run(
        'INSERT INTO members (name,role,photo,bio,fb,ig,tt,ord) VALUES (?,?,?,?,?,?,?,?)',
        [m.name, m.role, m.photo||null, m.bio||null, m.fb||null, m.ig||null, m.tt||null, m.ord]
      );
    }
    console.log('✅ Members seeded');
  }
}

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── Auth middleware ─────────────────────────────────────────
function auth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.admin = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ═══════════════════════════════════════════════════════════
//  PUBLIC API
// ═══════════════════════════════════════════════════════════
app.get('/api/members', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM members ORDER BY ord ASC, id ASC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════════════════════
//  ADMIN API (protected)
// ═══════════════════════════════════════════════════════════
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await get('SELECT * FROM admins WHERE username = ?', [username]);
    if (!admin || !bcrypt.compareSync(password, admin.password))
      return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: admin.id, username: admin.username }, SECRET, { expiresIn: '8h' });
    res.json({ token, username: admin.username });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/admin/members', auth, async (req, res) => {
  try {
    const rows = await all('SELECT * FROM members ORDER BY ord ASC, id ASC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/admin/members', auth, async (req, res) => {
  const { name, role, photo, bio, fb, ig, tt, ord } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  try {
    const r = await run(
      'INSERT INTO members (name,role,photo,bio,fb,ig,tt,ord) VALUES (?,?,?,?,?,?,?,?)',
      [name, role||'member', photo||null, bio||null, fb||null, ig||null, tt||null, ord||999]
    );
    res.json({ id: r.lastID });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/members/:id', auth, async (req, res) => {
  const { name, role, photo, bio, fb, ig, tt, ord } = req.body;
  try {
    await run(
      'UPDATE members SET name=?,role=?,photo=?,bio=?,fb=?,ig=?,tt=?,ord=? WHERE id=?',
      [name, role, photo||null, bio||null, fb||null, ig||null, tt||null, ord||999, req.params.id]
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/members/:id', auth, async (req, res) => {
  try {
    await run('DELETE FROM members WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/password', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const admin = await get('SELECT * FROM admins WHERE id = ?', [req.admin.id]);
    if (!bcrypt.compareSync(oldPassword, admin.password))
      return res.status(401).json({ error: 'Wrong current password' });
    const hash = bcrypt.hashSync(newPassword, 10);
    await run('UPDATE admins SET password = ? WHERE id = ?', [hash, req.admin.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Start ───────────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Bxrrett server running at http://localhost:${PORT}`);
    console.log(`📋 Admin panel: http://localhost:${PORT}/admin.html`);
    console.log(`👤 Login: admin / bxrrett1234\n`);
  });
}).catch(err => {
  console.error('DB init error:', err);
  process.exit(1);
});
