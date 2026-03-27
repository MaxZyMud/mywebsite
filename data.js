// ============================================================
//  data.js — Shared constants for members.js and admin.html
// ============================================================

const STORAGE_KEY  = 'bxrrett_members';  // localStorage key
const ADMINS_KEY   = 'bxrrett_admins';
const SESSION_KEY  = 'bxrrett_session';

const DEFAULT_MEMBERS = [
  { id:1,  name:'Massimo Toya',       role:'leader', photo:null, bio:'Founder & Leader of Bxrrett.', fb:'https://www.facebook.com/massimo.sukkasem', ig:null, tt:null, ord:1 },
  { id:2,  name:'Sammie GalleryWalk', role:'leader', photo:null, bio:null, fb:null, ig:null, tt:null, ord:2 },
  { id:3,  name:'Zen Nosay',          role:'leader', photo:null, bio:null, fb:'https://www.facebook.com/zen.freaks', ig:null, tt:null, ord:3 },
  { id:4,  name:'Jayz Lyfe',          role:'member', photo:null, bio:null, fb:'https://www.facebook.com/jayz.lyfestyle', ig:null, tt:null, ord:4 },
  { id:5,  name:'Pegasus Lyfe',       role:'member', photo:null, bio:null, fb:null, ig:null, tt:null, ord:5 },
  { id:6,  name:'Pleum Lyfestyle',    role:'member', photo:null, bio:null, fb:null, ig:null, tt:null, ord:6 },
  { id:7,  name:'Justx Lyfestyle',    role:'member', photo:null, bio:null, fb:null, ig:null, tt:null, ord:7 },
  { id:8,  name:'Fatez Smith',        role:'member', photo:null, bio:null, fb:null, ig:null, tt:null, ord:8 },
  { id:9,  name:'Roll Bxrrett',       role:'member', photo:null, bio:null, fb:'https://www.facebook.com/rin.strainglean', ig:null, tt:null, ord:9 },
  { id:10, name:'Brisbane Bxrrett',   role:'member', photo:null, bio:null, fb:null, ig:null, tt:null, ord:10 },
  { id:11, name:'Recon Lyfestyle',    role:'member', photo:null, bio:null, fb:null, ig:null, tt:null, ord:11 },
];

// Shared member storage helpers
function getMembers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MEMBERS));
  return DEFAULT_MEMBERS.map(m => ({...m}));
}

function saveMembers(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function nextMemberId(arr) {
  return arr.length ? Math.max(...arr.map(m => m.id)) + 1 : 1;
}

// Shared admin storage helpers
function getAdmins() {
  try {
    const raw = localStorage.getItem(ADMINS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) return arr;
    }
  } catch(e) {}
  // Migrate old single-auth format
  try {
    const old = localStorage.getItem('bxrrett_admin');
    if (old) {
      const o = JSON.parse(old);
      if (o && o.password) {
        const migrated = [{ loginId: o.loginId || 'bxr-admin-001', username: o.username || 'admin', password: o.password, primary: true }];
        localStorage.setItem(ADMINS_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }
  } catch(e) {}
  const def = [{ loginId: 'bxr-admin-001', username: 'admin', password: 'bxrrett1234', primary: true }];
  localStorage.setItem(ADMINS_KEY, JSON.stringify(def));
  return def;
}

function saveAdmins(arr) { localStorage.setItem(ADMINS_KEY, JSON.stringify(arr)); }

function findAdmin(username, password) {
  return getAdmins().find(a => a.username === username && a.password === password) || null;
}
