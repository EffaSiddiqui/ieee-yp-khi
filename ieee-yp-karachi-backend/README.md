# IEEE YP Karachi — Backend API

## Credentials

| Field    | Value                |
|----------|----------------------|
| Username | `admin`              |
| Password | `IEEEyp@Karachi2026` |

---

## Local Development

```bash
npm install
node server.js
# API runs at http://localhost:3001
```

---

## Deploy to Vercel (Free)

### Step 1 — Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2 — Deploy
```bash
cd ieee-yp-backend
vercel
# Follow prompts → select "No" for overriding settings
```

### Step 3 — Set Environment Variables in Vercel Dashboard
Go to: vercel.com → Your Project → Settings → Environment Variables

Add these:
```
ADMIN_API_KEY    = IEEEyp@Karachi2026
FRONTEND_ORIGIN  = https://your-frontend-url.vercel.app
```

Optional (for email notifications):
```
SMTP_HOST  = smtp.gmail.com
SMTP_PORT  = 587
SMTP_USER  = your-gmail@gmail.com
SMTP_PASS  = your-app-password
NOTIFY_EMAIL = yp.karachi@ieee.org
```

### Step 4 — Update Frontend
After backend deploys, copy its URL (e.g. `https://ieee-yp-backend.vercel.app`)
and paste it in `admin.html` login screen → "Backend API URL" field.

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/health | None | Health check |
| POST | /api/propose-activity | None | Submit proposal |
| GET | /api/proposals | x-api-key header | List all proposals |
| PATCH | /api/proposals/:id | x-api-key header | Update status |

---

## Note on Data Storage

- **Local dev**: proposals saved to `proposals.json` file
- **Vercel**: file system is read-only, proposals stored in memory only (lost on restart)
- **Recommended for production**: Add MongoDB Atlas (free tier) or Vercel KV
