# 🚀 Quick Deployment Guide

## Deploy to GitHub Pages (3 steps)

### 1. Update Your Repository Info

Edit `package.json` line 5 and change:
```json
"homepage": "https://YOUR_USERNAME.github.io/future-email"
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 2. Push to GitHub

If you haven't already:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/future-email.git
git branch -M main
git push -u origin main
```

### 3. Deploy

```bash
npm run deploy
```

Done! Visit `https://YOUR_USERNAME.github.io/future-email` in a few minutes.

---

## What This Does

- Builds your React app
- Creates a `gh-pages` branch
- Pushes the build to that branch
- GitHub automatically serves it

## Demo Mode Notice

The app runs in demo mode on GitHub Pages (no real emails sent). To send actual emails:
1. Keep the `netlify/` folder code
2. Deploy backend separately (Netlify, Vercel, Railway, etc.)
3. Update `src/App.js` to point to your backend API
