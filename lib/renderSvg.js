/**
 * SVG Card Renderer for GitHub Stats.
 * Outputs a compact 495x195 SVG card optimized for GitHub READMEs.
 */

/**
 * Escapes XML/HTML entities to prevent XSS and XML parsing errors.
 *
 * @param {string} str
 * @returns {string}
 */
function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Formats a number with comma separators.
 *
 * @param {number} num
 * @returns {string}
 */
function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString('en-US');
}

/**
 * Renders the main GitHub Stats SVG card.
 *
 * @param {object} stats
 * @param {object} theme
 * @returns {string} Complete SVG string
 */
export function renderStatsSvg(stats, theme) {
  const {
    username,
    name,
    totalContributions,
    totalCommits,
    currentStreak,
    longestStreak,
    prsAndIssues,
    totalPullRequests,
    totalIssues,
    totalReviews,
  } = stats;

  const displayName = escapeXml(name ? `${name} (@${username})` : username);
  const borderAttr = theme.hideBorder ? 'none' : theme.border;

  return `
<svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GitHub Stats for ${escapeXml(username)}">
  <defs>
    <style>
      .header {
        font: 600 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        fill: ${theme.title};
      }
      .label {
        font: 500 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        fill: ${theme.subtext};
      }
      .value {
        font: 700 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        fill: ${theme.text};
      }
      .subvalue {
        font: 500 10px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        fill: ${theme.subtext};
      }
      .card-item {
        transition: all 0.3s ease;
      }
      .stat-icon {
        fill: ${theme.icon};
      }
      .accent-icon {
        fill: ${theme.accent};
      }
    </style>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}" stop-opacity="1" />
      <stop offset="100%" stop-color="${theme.bg}" stop-opacity="0.95" />
    </linearGradient>
  </defs>

  <!-- Background Card -->
  <rect x="0.5" y="0.5" rx="10" height="194" width="494" fill="url(#cardGrad)" stroke="${borderAttr}" stroke-opacity="1" />

  <!-- Header: GitHub Icon + Title -->
  <g transform="translate(24, 28)">
    <!-- GitHub Mark SVG -->
    <path class="stat-icon" fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(1.1) translate(0, -3)"/>
    <text x="26" y="10" class="header">GitHub Stats: ${displayName}</text>
  </g>

  <!-- Metric 1: Total Contributions (Top-Left) -->
  <g transform="translate(24, 52)" class="card-item">
    <rect width="216" height="56" rx="6" fill="${theme.badgeBg}" stroke="${borderAttr}" stroke-opacity="0.6"/>
    <!-- Spark / Star Icon -->
    <g transform="translate(14, 14)">
      <circle cx="14" cy="14" r="14" fill="${theme.icon}" fill-opacity="0.12"/>
      <path class="stat-icon" d="M14 6L16.2 11.4L22 12.2L17.8 16.3L18.8 22L14 19.5L9.2 22L10.2 16.3L6 12.2L11.8 11.4L14 6Z" transform="scale(0.85) translate(2.5, 2.5)"/>
    </g>
    <text x="52" y="24" class="label">TOTAL CONTRIBUTIONS</text>
    <text x="52" y="44" class="value">${formatNumber(totalContributions)}</text>
  </g>

  <!-- Metric 2: Total Commits (Top-Right) -->
  <g transform="translate(255, 52)" class="card-item">
    <rect width="216" height="56" rx="6" fill="${theme.badgeBg}" stroke="${borderAttr}" stroke-opacity="0.6"/>
    <!-- Git Commit Icon -->
    <g transform="translate(14, 14)">
      <circle cx="14" cy="14" r="14" fill="${theme.accent}" fill-opacity="0.12"/>
      <path class="accent-icon" fill-rule="evenodd" d="M14 9a5 5 0 0 0-4.9 4H5a1 1 0 1 0 0 2h4.1a5 5 0 0 0 9.8 0H23a1 1 0 1 0 0-2h-4.1A5 5 0 0 0 14 9zm-3 5a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"/>
    </g>
    <text x="52" y="24" class="label">TOTAL COMMITS</text>
    <text x="52" y="44" class="value">${formatNumber(totalCommits)}</text>
  </g>

  <!-- Metric 3: Current Streak (Bottom-Left) -->
  <g transform="translate(24, 118)" class="card-item">
    <rect width="216" height="56" rx="6" fill="${theme.badgeBg}" stroke="${borderAttr}" stroke-opacity="0.6"/>
    <!-- Flame Icon -->
    <g transform="translate(14, 14)">
      <circle cx="14" cy="14" r="14" fill="${theme.accent}" fill-opacity="0.12"/>
      <path class="accent-icon" fill-rule="evenodd" d="M15.5 6.5c.3 1.2-.2 2.5-1.1 3.3-.6.5-1.4.9-1.4 1.8 0 .9.7 1.6 1.6 1.6.4 0 .8-.1 1.1-.4 1.1 1.3 1.8 3 1.8 4.8 0 4.1-3.4 7.4-7.5 7.4S2.5 21.6 2.5 17.5c0-3.5 2.5-6.6 6-7.3.3 1.3 1.4 2.3 2.8 2.3.4 0 .7-.1 1-.3.1-1.7 1.4-3.1 3.2-5.7z" transform="scale(0.85) translate(3, 1)"/>
    </g>
    <text x="52" y="24" class="label">CURRENT STREAK</text>
    <text x="52" y="44" class="value">${currentStreak} <tspan style="font-size: 13px; font-weight: 500;">days</tspan></text>
    <text x="140" y="44" class="subvalue">(Best: ${longestStreak}d)</text>
  </g>

  <!-- Metric 4: PRs & Issues (Bottom-Right) -->
  <g transform="translate(255, 118)" class="card-item">
    <rect width="216" height="56" rx="6" fill="${theme.badgeBg}" stroke="${borderAttr}" stroke-opacity="0.6"/>
    <!-- Git Pull Request / Issue Icon -->
    <g transform="translate(14, 14)">
      <circle cx="14" cy="14" r="14" fill="${theme.icon}" fill-opacity="0.12"/>
      <path class="stat-icon" fill-rule="evenodd" d="M7 3.5A2.5 2.5 0 1 0 4.5 6v10.1a2.5 2.5 0 1 0 2 0V11a3 3 0 0 1 3-3h6.1a2.5 2.5 0 1 0 0-2H9.5A5.002 5.002 0 0 0 6.5 9.5V6A2.5 2.5 0 0 0 7 3.5zm12 11.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" transform="scale(0.85) translate(3, 3)"/>
    </g>
    <text x="52" y="24" class="label">PRS &amp; ISSUES</text>
    <text x="52" y="44" class="value">${formatNumber(prsAndIssues)}</text>
    <text x="125" y="44" class="subvalue">(${formatNumber(totalPullRequests)} PRs / ${formatNumber(totalIssues)} Iss)</text>
  </g>
</svg>
`.trim();
}

/**
 * Renders a beautifully styled Error SVG card.
 *
 * @param {string} message - Error message to display
 * @param {object} theme - Theme configuration
 * @returns {string} Error SVG string
 */
export function renderErrorSvg(message, theme) {
  const safeMessage = escapeXml(message || 'An unexpected error occurred');
  const borderAttr = theme.hideBorder ? 'none' : theme.border;

  return `
<svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Error: ${safeMessage}">
  <defs>
    <style>
      .error-title {
        font: 600 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        fill: #ff6b6b;
      }
      .error-msg {
        font: 400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
        fill: ${theme.text};
      }
      .error-sub {
        font: 400 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        fill: ${theme.subtext};
      }
    </style>
  </defs>
  <rect x="0.5" y="0.5" rx="10" height="194" width="494" fill="${theme.bg}" stroke="${borderAttr}" stroke-opacity="1" />
  
  <g transform="translate(24, 32)">
    <!-- Warning Icon -->
    <circle cx="12" cy="12" r="12" fill="#ff6b6b" fill-opacity="0.2"/>
    <path fill="#ff6b6b" d="M12 7v6m0 3v.01" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round"/>
    <text x="32" y="16" class="error-title">GitHub Stats Error</text>
  </g>

  <g transform="translate(24, 75)">
    <rect width="447" height="65" rx="6" fill="${theme.badgeBg}" stroke="${borderAttr}" stroke-opacity="0.6"/>
    <text x="14" y="26" class="error-msg">${safeMessage}</text>
    <text x="14" y="48" class="error-sub">Please check query parameters or verify your GH_TOKEN on Vercel.</text>
  </g>

  <text x="24" y="168" class="error-sub">Tip: Pass ?username=your_github_handle</text>
</svg>
`.trim();
}
