import { fetchGitHubStats } from '../lib/github.js';
import { getTheme } from '../lib/themes.js';
import { renderStatsSvg, renderErrorSvg } from '../lib/renderSvg.js';

/**
 * Vercel Serverless Function entrypoint.
 *
 * @param {import('@vercel/node').VercelRequest | any} req
 * @param {import('@vercel/node').VercelResponse | any} res
 */
export default async function handler(req, res) {
  const query = req.query || {};
  const { username } = query;
  const theme = getTheme(query);

  try {
    if (!username || typeof username !== 'string' || !username.trim()) {
      res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      const svg = renderErrorSvg('Missing "username" query parameter in URL.', theme);
      return res.status(400).send(svg);
    }

    const stats = await fetchGitHubStats(username.trim());
    const svg = renderStatsSvg(stats, theme);

    // Cache-Control: 30 minutes in browser, 1 hour on Vercel Edge CDN, 24 hours stale-while-revalidate
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400');
    
    return res.status(200).send(svg);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    // Short cache on error to avoid long-term caching of transient issues
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=120');

    const svg = renderErrorSvg(errorMessage, theme);
    return res.status(200).send(svg);
  }
}
