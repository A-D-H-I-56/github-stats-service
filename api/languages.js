import { fetchGitHubLanguages } from '../lib/languages.js';
import { getTheme } from '../lib/themes.js';
import { renderLanguagesSvg, renderLanguagesErrorSvg } from '../lib/renderLanguagesSvg.js';

/**
 * Vercel Serverless Function entrypoint for Top Languages card.
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
      const svg = renderLanguagesErrorSvg('Missing "username" query parameter in URL.', theme);
      return res.status(400).send(svg);
    }

    const limit = Math.min(10, Math.max(1, parseInt(query.limit, 10) || 6));
    const data = await fetchGitHubLanguages(username.trim(), limit);
    const svg = renderLanguagesSvg(data, theme, query);

    const maxAge = Math.max(0, parseInt(query.cache_seconds, 10) || 300);
    const sMaxAge = Math.max(maxAge, 600);

    // Cache-Control: 5 minutes browser cache / 10 minutes CDN Edge with stale-while-revalidate
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', `public, max-age=${maxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=86400`);

    return res.status(200).send(svg);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=120');

    const svg = renderLanguagesErrorSvg(errorMessage, theme);
    return res.status(200).send(svg);
  }
}
