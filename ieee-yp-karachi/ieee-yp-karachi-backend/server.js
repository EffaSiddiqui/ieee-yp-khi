/**
 * IEEE YP Karachi Section — Backend API
 * Node.js + Express | Vercel Serverless compatible
 *
 * ENDPOINTS:
 *   GET  /api/health              — Health check
 *   POST /api/propose-activity    — Submit event proposal
 *   GET  /api/proposals           — Admin: list all (requires x-api-key header)
 *   PATCH /api/proposals/:id      — Admin: update status
 *
 * SETUP (local):
 *   npm install
 *   cp .env.example .env   (fill in values)
 *   node server.js
 *
 * DEPLOY (Vercel):
 *   vercel deploy
 *   Set env vars in Vercel dashboard → Project Settings → Environment Variables
 *
 * NOTE: On Vercel free tier, file system is read-only.
 *   For persistence, set MONGODB_URI in .env and uncomment MongoDB section below.
 *   Without MongoDB, proposals are stored in-memory (lost on cold start) —
 *   email notifications still work.
 */

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const fs         = require('fs');
const path       = require('path');
const nodemailer = require('nodemailer');

const app  = express();
const PORT = process.env.PORT || 3001;

/* ── In-memory store (fallback when no DB / local file) ─── */
let inMemoryProposals = [];

/* ── File-based store (local dev only) ──────────────────── */
const DB_FILE  = path.join(__dirname, 'proposals.json');
const IS_LOCAL = !process.env.VERCEL;

function loadProposals() {
  if (!IS_LOCAL) return inMemoryProposals;
  if (!fs.existsSync(DB_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
  catch { return []; }
}

function saveProposals(data) {
  inMemoryProposals = data;
  if (!IS_LOCAL) return;
  try { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8'); }
  catch (e) { console.error('File write error:', e.message); }
}

/* ── Middleware ──────────────────────────────────────────── */
const allowedOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(',').map(s => s.trim())
  : ['*'];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error('CORS blocked'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

/* ── Email ───────────────────────────────────────────────── */
function createMailer() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function adminEmailHTML(p) {
  const rows = [
    ['Name',         p.name],
    ['Email',        `<a href="mailto:${p.email}" style="color:#00629B;">${p.email}</a>`],
    ['Organization', p.organization || '—'],
    ['Event Type',   p.eventType],
    ['Title',        p.title],
    ['Proposed Date',p.date || '—'],
    ['Venue',        p.venue || '—'],
    ['Audience',     p.audience || '—'],
  ].map(([k, v]) => `
    <tr>
      <td style="padding:8px 12px;font-weight:700;color:#1a2a4a;border-bottom:1px solid #e2e8f0;white-space:nowrap;">${k}</td>
      <td style="padding:8px 12px;color:#334155;border-bottom:1px solid #e2e8f0;">${v}</td>
    </tr>`).join('');

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#00629B;padding:24px;border-radius:8px 8px 0 0;">
        <h2 style="color:#fff;margin:0;font-size:1.2rem;">New Event Proposal — IEEE YP Karachi</h2>
      </div>
      <div style="background:#f8fafc;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;">
        <table style="width:100%;border-collapse:collapse;">${rows}</table>
        <div style="margin-top:20px;">
          <strong style="color:#1a2a4a;">Description:</strong>
          <p style="margin-top:8px;color:#334155;line-height:1.65;">${p.description}</p>
        </div>
        <p style="margin-top:20px;font-size:0.8rem;color:#94a3b8;">
          Submitted: ${new Date(p.submittedAt).toLocaleString('en-PK')}
        </p>
      </div>
    </div>`;
}

/* ── Validation ──────────────────────────────────────────── */
function validateProposal(body) {
  const { name, email, eventType, title, description } = body;
  if (!name?.trim() || !email?.trim() || !eventType?.trim() || !title?.trim() || !description?.trim()) {
    return 'Missing required fields: name, email, eventType, title, description.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Invalid email address.';
  }
  return null;
}

/* ── ROUTES ──────────────────────────────────────────────── */

// Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'IEEE YP Karachi API',
    env: IS_LOCAL ? 'local' : 'vercel',
    timestamp: new Date().toISOString(),
  });
});

// Submit proposal
app.post('/api/propose-activity', async (req, res) => {
  const err = validateProposal(req.body);
  if (err) return res.status(400).json({ success: false, message: err });

  const proposal = {
    id:           `${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
    name:         String(req.body.name).slice(0, 120).trim(),
    email:        String(req.body.email).slice(0, 200).trim(),
    organization: String(req.body.organization || '').slice(0, 200).trim(),
    eventType:    String(req.body.eventType).slice(0, 80).trim(),
    title:        String(req.body.title).slice(0, 200).trim(),
    date:         String(req.body.date || '').slice(0, 20),
    venue:        String(req.body.venue || '').slice(0, 200).trim(),
    audience:     String(req.body.audience || '').slice(0, 200).trim(),
    description:  String(req.body.description).slice(0, 2000).trim(),
    status:       'pending',
    submittedAt:  new Date().toISOString(),
  };

  // Save
  const proposals = loadProposals();
  proposals.push(proposal);
  saveProposals(proposals);

  // Email
  const mailer = createMailer();
  if (mailer) {
    try {
      // Notify committee
      if (process.env.NOTIFY_EMAIL) {
        await mailer.sendMail({
          from:    `"IEEE YP Karachi Website" <${process.env.SMTP_USER}>`,
          to:      process.env.NOTIFY_EMAIL,
          subject: `New Event Proposal: ${proposal.title}`,
          html:    adminEmailHTML(proposal),
        });
      }
      // Confirm to proposer
      await mailer.sendMail({
        from:    `"IEEE YP Karachi" <${process.env.SMTP_USER}>`,
        to:      proposal.email,
        subject: 'Proposal Received — IEEE YP Karachi Section',
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
            <div style="background:#00629B;padding:24px;border-radius:8px 8px 0 0;">
              <h2 style="color:#fff;margin:0;">Thank you, ${proposal.name}!</h2>
            </div>
            <div style="background:#f8fafc;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;">
              <p style="color:#334155;">Your event proposal <strong>"${proposal.title}"</strong> has been received.</p>
              <p style="color:#334155;margin-top:10px;">The IEEE YP Karachi Committee will review it and contact you within <strong>3–5 business days</strong>.</p>
              <p style="margin-top:20px;font-size:0.8rem;color:#94a3b8;">
                IEEE Young Professionals Karachi Section
              </p>
            </div>
          </div>`,
      });
    } catch (mailErr) {
      console.error('Email error (non-fatal):', mailErr.message);
    }
  }

  res.status(201).json({
    success: true,
    message: 'Proposal submitted. You will be contacted within 3–5 business days.',
    id: proposal.id,
  });
});

// List proposals (admin)
app.get('/api/proposals', (req, res) => {
  if (!process.env.ADMIN_API_KEY || req.headers['x-api-key'] !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }
  const proposals = loadProposals();
  res.json({ success: true, count: proposals.length, proposals });
});

// Update proposal status (admin)
app.patch('/api/proposals/:id', (req, res) => {
  if (!process.env.ADMIN_API_KEY || req.headers['x-api-key'] !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }
  const proposals = loadProposals();
  const idx = proposals.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Proposal not found.' });

  const allowed = ['pending', 'review', 'approved', 'rejected'];
  if (req.body.status && !allowed.includes(req.body.status)) {
    return res.status(400).json({ success: false, message: 'Invalid status.' });
  }
  proposals[idx] = { ...proposals[idx], ...req.body, id: proposals[idx].id, submittedAt: proposals[idx].submittedAt };
  saveProposals(proposals);
  res.json({ success: true, proposal: proposals[idx] });
});

/* ── Start ───────────────────────────────────────────────── */
if (IS_LOCAL) {
  inMemoryProposals = loadProposals();
  app.listen(PORT, () => {
    console.log(`\nIEEE YP Karachi API → http://localhost:${PORT}`);
    console.log(`  Health:     GET  /api/health`);
    console.log(`  Submit:     POST /api/propose-activity`);
    console.log(`  Admin list: GET  /api/proposals  (x-api-key required)`);
    console.log(`  Update:     PATCH /api/proposals/:id\n`);
  });
}

module.exports = app;
