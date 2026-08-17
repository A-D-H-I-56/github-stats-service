/**
 * GitHub GraphQL API client for language statistics.
 */

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

const LANGUAGES_QUERY = `
  query userLanguages($username: String!) {
    user(login: $username) {
      name
      login
      repositories(ownerAffiliations: [OWNER], isFork: false, first: 100, orderBy: {field: PUSHED_AT, direction: DESC}) {
        nodes {
          name
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Fallback colors for known programming languages if GitHub returns null.
 */
const DEFAULT_LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Other: '#8b949e',
};

/**
 * Fetches and calculates top language statistics for a GitHub user.
 *
 * @param {string} username - GitHub username
 * @param {number} [limit=6] - Number of top languages to return
 * @param {string} [token] - GitHub Personal Access Token (defaults to process.env.GH_TOKEN)
 * @returns {Promise<object>}
 */
export async function fetchGitHubLanguages(username, limit = 6, token = process.env.GH_TOKEN) {
  if (!username) {
    throw new Error('Username is required');
  }

  if (!token) {
    throw new Error('Missing GH_TOKEN environment variable. Please configure a GitHub Personal Access Token.');
  }

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token.trim()}`,
      'Content-Type': 'application/json',
      'User-Agent': 'GitHub-Stats-SVG-Microservice',
    },
    body: JSON.stringify({
      query: LANGUAGES_QUERY,
      variables: { username },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API HTTP error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    const message = result.errors[0]?.message || 'GraphQL Query Error';
    if (message.toLowerCase().includes('could not resolve to a user')) {
      throw new Error(`User "${username}" was not found on GitHub.`);
    }
    throw new Error(`GitHub GraphQL error: ${message}`);
  }

  const user = result.data?.user;
  if (!user) {
    throw new Error(`User "${username}" was not found on GitHub.`);
  }

  const repos = user.repositories?.nodes || [];
  const languageMap = new Map();
  let totalBytes = 0;

  for (const repo of repos) {
    if (!repo.languages?.edges) continue;

    for (const edge of repo.languages.edges) {
      const { size, node } = edge;
      if (!node || !node.name || !size) continue;

      const langName = node.name;
      const langColor = node.color || DEFAULT_LANGUAGE_COLORS[langName] || DEFAULT_LANGUAGE_COLORS.Other;

      totalBytes += size;

      if (languageMap.has(langName)) {
        const existing = languageMap.get(langName);
        existing.size += size;
      } else {
        languageMap.set(langName, {
          name: langName,
          color: langColor,
          size,
        });
      }
    }
  }

  if (totalBytes === 0) {
    return {
      username: user.login,
      name: user.name || user.login,
      languages: [],
      totalBytes: 0,
    };
  }

  // Sort by byte size descending
  const sorted = Array.from(languageMap.values()).sort((a, b) => b.size - a.size);

  const topLanguages = sorted.slice(0, limit).map((lang) => {
    const percent = (lang.size / totalBytes) * 100;
    return {
      ...lang,
      percent: Number(percent.toFixed(1)),
      formattedPercent: `${percent.toFixed(1)}%`,
    };
  });

  return {
    username: user.login,
    name: user.name || user.login,
    languages: topLanguages,
    totalBytes,
  };
}
