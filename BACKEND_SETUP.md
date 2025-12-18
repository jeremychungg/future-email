# Backend Setup - Send Real Emails

To actually send emails, you need to deploy the backend. Here are your options:

## Option 1: Deploy Backend to Netlify (Easiest)

### Step 1: Create a new Netlify site for the backend

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect the same GitHub repo: `jeremychungg/future-email`
4. Configure build settings:
   - **Build command**: Leave empty
   - **Publish directory**: `build`
5. Click "Deploy site"

### Step 2: Add Environment Variables to Netlify

In your Netlify site settings → Environment variables, add:

- `EMAIL_USER`: Your Gmail address (e.g., `yourname@gmail.com`)
- `EMAIL_PASS`: Your Gmail App Password (NOT your regular password)
  - Get one here: https://myaccount.google.com/apppasswords
  - Select "Mail" and "Other (Custom name)"
  - Use the 16-character password it generates

### Step 3: Update GitHub Pages App

After deploying to Netlify, get your Netlify site URL (e.g., `https://your-site.netlify.app`)

Then update your GitHub Pages deployment:

1. Create a file `.env.production.local` in your project:
```bash
REACT_APP_API_URL=https://your-site.netlify.app
```

2. Rebuild and redeploy:
```bash
npm run deploy
```

Done! Your GitHub Pages app will now send emails through your Netlify backend.

---

## Option 2: Use Vercel (Alternative)

1. Go to https://vercel.com
2. Import your GitHub repo
3. Add environment variables: `EMAIL_USER` and `EMAIL_PASS`
4. Deploy
5. Update `.env.production.local` with your Vercel URL
6. Redeploy to GitHub Pages

---

## Option 3: Self-Host Backend

If you have a server, you can run the backend separately:

```bash
npm install
node netlify/functions/schedule-email.js
```

Set up as an Express server and deploy to any Node.js hosting platform.

---

## Testing

After setup, when you submit a form:
- **Under 5 minutes**: Email sends immediately
- **Over 5 minutes**: Shows scheduled confirmation (needs scheduling service)

For true scheduling (any future time), you'll need to add:
- Netlify Scheduled Functions
- AWS EventBridge + Lambda
- Or a service like Zapier/Make.com
