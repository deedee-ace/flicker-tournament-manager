// Cloudflare Worker for Flicker tournament data sync
// This worker securely commits data to GitHub without exposing the token

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    
    try {
      // GET /data - Fetch current tournament data
      if (request.method === 'GET' && url.pathname === '/data') {
        const response = await fetch(
          'https://api.github.com/repos/deedee-ace/flicker-tournament-manager/contents/data.json',
          {
            headers: {
              'Authorization': `token ${env.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'Flicker-Tournament-Manager',
            },
          }
        );

        if (response.status === 404) {
          // File doesn't exist yet, return empty array
          return new Response(JSON.stringify([]), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        const content = atob(data.content);
        
        return new Response(content, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // POST /data - Update tournament data
      if (request.method === 'POST' && url.pathname === '/data') {
        const tournaments = await request.json();

        // Get current file SHA (needed for updates)
        const getResponse = await fetch(
          'https://api.github.com/repos/deedee-ace/flicker-tournament-manager/contents/data.json',
          {
            headers: {
              'Authorization': `token ${env.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'Flicker-Tournament-Manager',
            },
          }
        );

        let sha = null;
        if (getResponse.ok) {
          const currentData = await getResponse.json();
          sha = currentData.sha;
        }

        // Prepare commit
        const content = btoa(JSON.stringify(tournaments, null, 2));
        const body = {
          message: 'Update tournament data',
          content: content,
          sha: sha,
        };

        // Commit to GitHub
        const commitResponse = await fetch(
          'https://api.github.com/repos/deedee-ace/flicker-tournament-manager/contents/data.json',
          {
            method: 'PUT',
            headers: {
              'Authorization': `token ${env.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
              'User-Agent': 'Flicker-Tournament-Manager',
            },
            body: JSON.stringify(body),
          }
        );

        if (!commitResponse.ok) {
          const error = await commitResponse.text();
          throw new Error(`Failed to commit: ${error}`);
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
