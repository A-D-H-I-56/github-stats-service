/**
 * GitHub GraphQL API client and stats aggregator.
 */

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

const STATS_QUERY = `
  query userInfo($username: String!) {
    user(login: $username) {
      name
      login
      publicRepos: repositories(privacy: PUBLIC, affiliations: [OWNER]) {
        totalCount
      }
      privateRepos: repositories(privacy: PRIVATE, affiliations: [OWNER]) {
        totalCount
      }
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

/**
 * Calculates current and longest contribution streaks from contribution days.
 *
 * @param {Array<{ contributionCount: number, date: string }>} days
 * @returns {{ currentStreak: number, longestStreak: number }}
 */
export function calculateStreaks(days) {
  if (!days || days.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate longest streak across all days
  for (let i = 0; i < days.length; i++) {
    if (days[i].contributionCount > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Calculate current streak
  // Look backward from the most recent day
  let currentStreak = 0;
  const lastIndex = days.length - 1;

  if (lastIndex >= 0) {
    const todayContribution = days[lastIndex].contributionCount;

    if (todayContribution > 0) {
      // User has contributed today, count backwards
      for (let i = lastIndex; i >= 0; i--) {
        if (days[i].contributionCount > 0) {
          currentStreak++;
        } else {
          break;
        }
      }
    } else {
      // Today has 0 contributions so far.
      // If yesterday had contributions, the streak is still alive!
      const yesterdayIndex = lastIndex - 1;
      if (yesterdayIndex >= 0 && days[yesterdayIndex].contributionCount > 0) {
        for (let i = yesterdayIndex; i >= 0; i--) {
          if (days[i].contributionCount > 0) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }
  }

  return { currentStreak, longestStreak };
}

/**
 * Fetches user contribution statistics and repository counts from GitHub GraphQL API.
 *
 * @param {string} username - GitHub username to query
 * @param {string} [token] - GitHub Personal Access Token (defaults to process.env.GH_TOKEN)
 * @returns {Promise<object>}
 */
export async function fetchGitHubStats(username, token = process.env.GH_TOKEN) {
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
      query: STATS_QUERY,
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

  const publicRepos = user.publicRepos?.totalCount || 0;
  const privateRepos = user.privateRepos?.totalCount || 0;
  const totalRepos = publicRepos + privateRepos;

  const contributions = user.contributionsCollection || {};
  const calendar = contributions.contributionCalendar;

  // Flatten days from weeks
  const days = [];
  if (calendar?.weeks) {
    for (const week of calendar.weeks) {
      if (week.contributionDays) {
        days.push(...week.contributionDays);
      }
    }
  }

  const { currentStreak, longestStreak } = calculateStreaks(days);

  const publicCommits = contributions.totalCommitContributions || 0;
  const privateContributions = contributions.restrictedContributionsCount || 0;
  const totalCommits = publicCommits + privateContributions;

  const totalPullRequests = contributions.totalPullRequestContributions || 0;
  const totalReviews = contributions.totalPullRequestReviewContributions || 0;
  const totalIssues = contributions.totalIssueContributions || 0;
  const prsAndIssues = totalPullRequests + totalReviews + totalIssues;

  // Total contributions (public calendar + restricted private)
  const calendarTotal = calendar?.totalContributions || 0;
  const totalContributions = calendarTotal + privateContributions;

  return {
    name: user.name || user.login,
    username: user.login,
    totalRepos,
    publicRepos,
    privateRepos,
    totalContributions,
    totalCommits,
    publicCommits,
    privateContributions,
    totalPullRequests,
    totalReviews,
    totalIssues,
    prsAndIssues,
    currentStreak,
    longestStreak,
  };
}
