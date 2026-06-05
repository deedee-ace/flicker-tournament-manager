# Flicker Cloud Sync Setup Guide

This guide will help you set up automatic cloud sync for your Flicker tournament data.

## Prerequisites

1. **Node.js** installed on your computer
2. **Cloudflare account** (free tier is sufficient)
3. **GitHub Personal Access Token** with repo access

## Step 1: Install Wrangler CLI

Wrangler is Cloudflare's command-line tool for managing workers.

```bash
npm install -g wrangler
```

## Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open a browser window. Click "Allow" to authorize Wrangler.

## Step 3: Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name like "Flicker Sync"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

## Step 4: Deploy the Worker

Navigate to the Flicker app folder:

```bash
cd "C:\Users\ryana\Documents\!!!!! SIDE PROJECTS\opencode\Flicker app"
```

Deploy the worker:

```bash
wrangler deploy
```

## Step 5: Add GitHub Token as Secret

```bash
wrangler secret put GITHUB_TOKEN
```

When prompted, paste your GitHub Personal Access Token and press Enter.

## Step 6: Verify Deployment

The worker should now be live at:
```
https://flicker-sync.deedeeshami.workers.dev
```

Test it by visiting:
```
https://flicker-sync.deedeeshami.workers.dev/data
```

You should see `[]` (empty array) or your tournament data.

## Step 7: Update GitHub Repo

Commit and push the updated files:

```bash
git add .
git commit -m "Add cloud sync functionality"
git push
```

## How It Works

1. **Auto-sync**: Every time you make changes, the app automatically syncs to the cloud after 2 seconds
2. **Load on startup**: When you open the app, it fetches the latest data from the cloud
3. **Conflict resolution**: Cloud data always wins on load (last write wins)
4. **Offline support**: If cloud sync fails, the app continues working with local data

## Sync Indicator

The app shows a sync status indicator in the top-right corner:
- 🟢 **Synced**: Data is synced with the cloud
- 🟡 **Syncing**: Currently uploading changes
- 🔴 **Sync Error**: Failed to sync (check console for details)
- ⚪ **Offline**: No cloud connection, using local data only

## Troubleshooting

### "Fetch failed" error
- Check that the worker is deployed: `wrangler tail` to see logs
- Verify the SYNC_URL in index.html matches your worker URL
- Check browser console for CORS errors

### "Push failed" error
- Verify your GitHub token is valid and has repo scope
- Check that the worker secret is set: `wrangler secret list`
- Ensure the repo exists and is accessible

### Data not syncing
- Check browser console for errors
- Verify the worker is responding: visit the /data endpoint
- Check Cloudflare dashboard for worker logs

## Security Notes

- Your GitHub token is stored securely as a Cloudflare secret
- The token is never exposed to the browser
- Only you can access the worker dashboard
- Data is transmitted over HTTPS

## Cost

Cloudflare Workers free tier includes:
- 100,000 requests per day
- More than enough for personal use

## Updating the Worker

If you modify `worker.js`, redeploy:

```bash
wrangler deploy
```

## Removing the Worker

To delete the worker:

```bash
wrangler delete
```

---

**Need help?** Check the Cloudflare Workers documentation: https://developers.cloudflare.com/workers/
