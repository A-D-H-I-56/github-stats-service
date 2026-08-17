/**
 * High-End Animated SaaS Dashboard SVG Card Renderer for GitHub Stats.
 * Optimized for crisp high-DPI GitHub profile READMEs and GitHub Camo Image Proxy.
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
 * Renders the high-end animated GitHub Stats SVG card.
 *
 * @param {object} stats
 * @param {object} theme
 * @returns {string} Complete SVG string
 */
export function renderStatsSvg(stats, theme) {
  const {
    username,
    name,
    totalRepos = 0,
    publicRepos = 0,
    privateRepos = 0,
    totalContributions = 0,
    totalCommits = 0,
    currentStreak = 0,
    longestStreak = 0,
    prsAndIssues = 0,
    totalPullRequests = 0,
    totalIssues = 0,
    totalReviews = 0,
  } = stats;

  const displayName = escapeXml(name ? `${name} (@${username})` : username);
  const borderStroke = theme.hideBorder ? 'none' : theme.border;

  return `
<svg width="495" height="275" viewBox="0 0 495 275" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GitHub Stats for ${escapeXml(username)}">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}" stop-opacity="1" />
      <stop offset="100%" stop-color="${theme.bg}" stop-opacity="0.95" />
    </linearGradient>

    <linearGradient id="tileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.badgeBg}" stop-opacity="0.9" />
      <stop offset="100%" stop-color="${theme.badgeBg}" stop-opacity="0.5" />
    </linearGradient>

    <linearGradient id="dividerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${theme.title}" stop-opacity="0.8" />
      <stop offset="50%" stop-color="${theme.accent}" stop-opacity="0.9" />
      <stop offset="100%" stop-color="${theme.border}" stop-opacity="0.3" />
    </linearGradient>

    <!-- Radial Glows for Icons -->
    <radialGradient id="iconGlowPrimary" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${theme.icon}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="${theme.icon}" stop-opacity="0.05" />
    </radialGradient>

    <radialGradient id="iconGlowAccent" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.35" />
      <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0.05" />
    </radialGradient>

    <!-- Native SVG CSS Styles and Animations inside CDATA -->
    <style><![CDATA[
      .header-title {
        font: 700 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        fill: ${theme.title};
        letter-spacing: -0.2px;
      }
      .header-badge {
        font: 700 9.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        fill: ${theme.accent};
        letter-spacing: 0.8px;
      }
      .stat-label {
        font: 600 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        fill: ${theme.subtext};
        letter-spacing: 0.6px;
      }
      .stat-val {
        font: 800 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        fill: ${theme.text};
        letter-spacing: -0.5px;
      }
      .stat-sub {
        font: 500 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        fill: ${theme.subtext};
      }
      .unit {
        font: 600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        fill: ${theme.accent};
      }

      /* Staggered Fade-in Animations (pure opacity to preserve SVG transform matrix) */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      /* Flame and Icon Breathing Pulse */
      @keyframes flamePulse {
        0%, 100% {
          opacity: 0.85;
          filter: drop-shadow(0 0 2px ${theme.accent}60);
        }
        50% {
          opacity: 1;
          filter: drop-shadow(0 0 6px ${theme.accent});
        }
      }

      /* Live indicator dot pulse */
      @keyframes pulseDot {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }

      .stagger-1 { animation: fadeIn 0.4s ease-out 0.05s both; }
      .stagger-2 { animation: fadeIn 0.4s ease-out 0.12s both; }
      .stagger-3 { animation: fadeIn 0.4s ease-out 0.19s both; }
      .stagger-4 { animation: fadeIn 0.4s ease-out 0.26s both; }
      .stagger-5 { animation: fadeIn 0.4s ease-out 0.33s both; }

      .pulse-flame {
        animation: flamePulse 2s ease-in-out infinite;
      }
      .pulse-live {
        animation: pulseDot 2s ease-in-out infinite;
      }
    ]]></style>
  </defs>

  <!-- Outer Glassmorphic Container -->
  <rect x="0.5" y="0.5" rx="16" width="494" height="274" fill="url(#bgGrad)" stroke="${borderStroke}" stroke-width="1.2" />
  
  <!-- Header Bar -->
  <g transform="translate(24, 26)">
    <!-- GitHub Mark Vector -->
    <g transform="translate(0, -2)">
      <circle cx="11" cy="11" r="11" fill="url(#iconGlowPrimary)" />
      <path fill="${theme.icon}" fill-rule="evenodd" clip-rule="evenodd" d="M11 4C7.13 4 4 7.13 4 11C4 14.1 6 16.71 8.79 17.64C9.14 17.7 9.27 17.49 9.27 17.31C9.27 17.14 9.26 16.59 9.26 16C7.5 16.33 7.05 15.58 6.91 15.18C6.83 14.98 6.49 14.36 6.19 14.2C5.95 14.07 5.6 13.74 6.18 13.73C6.73 13.72 7.12 14.24 7.25 14.45C7.88 15.51 8.89 15.21 9.29 15.03C9.35 14.57 9.54 14.26 9.74 14.09C8.18 13.91 6.55 13.31 6.55 10.63C6.55 9.87 6.82 9.24 7.27 8.75C7.2 8.57 6.96 7.85 7.34 6.89C7.34 6.89 7.93 6.71 9.27 7.61C9.83 7.45 10.42 7.37 11.02 7.37C11.62 7.37 12.21 7.45 12.77 7.61C14.11 6.7 14.7 6.89 14.7 6.89C15.08 7.85 14.84 8.57 14.77 8.75C15.22 9.24 15.49 9.86 15.49 10.63C15.49 13.32 13.85 13.91 12.29 14.09C12.54 14.31 12.76 14.73 12.76 15.38C12.76 16.32 12.75 17.07 12.75 17.31C12.75 17.49 12.88 17.71 13.23 17.64C16 16.71 18 14.09 18 11C18 7.13 14.87 4 11 4Z"/>
    </g>

    <!-- Header Title -->
    <text x="30" y="14" class="header-title">GitHub Stats: ${displayName}</text>

    <!-- Pro / Live Pill Badge -->
    <g transform="translate(389, 0)">
      <rect width="58" height="19" rx="9.5" fill="${theme.badgeBg}" stroke="${theme.border}" stroke-opacity="0.8" stroke-width="1" />
      <circle cx="10" cy="9.5" r="3" fill="${theme.accent}" class="pulse-live" />
      <text x="18" y="13" class="header-badge">ACTIVE</text>
    </g>
  </g>

  <!-- Subtle Divider Line -->
  <g transform="translate(24, 48)">
    <line x1="0" y1="0" x2="447" y2="0" stroke="url(#dividerGrad)" stroke-width="1.2" stroke-opacity="0.8" />
  </g>

  <!-- Row 1 Left: Total Contributions -->
  <g transform="translate(24, 60)" class="stagger-1">
    <rect width="216" height="58" rx="10" fill="url(#tileGrad)" stroke="${borderStroke}" stroke-opacity="0.6" stroke-width="1"/>
    
    <!-- Icon Circle -->
    <g transform="translate(12, 13)">
      <circle cx="16" cy="16" r="16" fill="url(#iconGlowPrimary)" />
      <!-- Star/Spark Vector -->
      <path fill="${theme.icon}" d="M16 8.5L17.8 13.2L22.8 13.6L19 17L20.2 22L16 19.4L11.8 22L13 17L9.2 13.6L14.2 13.2L16 8.5Z" />
    </g>

    <text x="52" y="23" class="stat-label">TOTAL CONTRIBUTIONS</text>
    <text x="52" y="45" class="stat-val">${formatNumber(totalContributions)}</text>
  </g>

  <!-- Row 1 Right: Total Commits -->
  <g transform="translate(255, 60)" class="stagger-2">
    <rect width="216" height="58" rx="10" fill="url(#tileGrad)" stroke="${borderStroke}" stroke-opacity="0.6" stroke-width="1"/>
    
    <!-- Icon Circle -->
    <g transform="translate(12, 13)">
      <circle cx="16" cy="16" r="16" fill="url(#iconGlowAccent)" />
      <!-- Git Commit Vector -->
      <path fill="${theme.accent}" fill-rule="evenodd" d="M16 10a4 4 0 0 0-3.87 3H8a1 1 0 1 0 0 2h4.13A4 4 0 0 0 20 15h4a1 1 0 1 0 0-2h-4.13A4 4 0 0 0 16 10zm-2 4a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
    </g>

    <text x="52" y="23" class="stat-label">TOTAL COMMITS</text>
    <text x="52" y="45" class="stat-val">${formatNumber(totalCommits)}</text>
  </g>

  <!-- Row 2 Left: Total Repositories (Public and Private) -->
  <g transform="translate(24, 126)" class="stagger-3">
    <rect width="216" height="58" rx="10" fill="url(#tileGrad)" stroke="${borderStroke}" stroke-opacity="0.6" stroke-width="1"/>
    
    <!-- Icon Circle with Repo Book -->
    <g transform="translate(12, 13)">
      <circle cx="16" cy="16" r="16" fill="url(#iconGlowPrimary)" />
      <!-- GitHub Repo Book Vector -->
      <path fill="${theme.icon}" fill-rule="evenodd" d="M11 9.5a1.5 1.5 0 0 1 1.5-1.5h8a1.5 1.5 0 0 1 1.5 1.5v12a1 1 0 0 1-1 1h-8.5a1.5 1.5 0 0 0-1.5 1.5v-13zm-1 1a1.5 1.5 0 0 0-1.5-1.5h-8A1.5 1.5 0 0 0-.5 10.5v12a1 1 0 0 0 1 1H9a1.5 1.5 0 0 1 1.5 1.5v-14z" transform="scale(0.72) translate(11, 4)"/>
    </g>

    <text x="52" y="23" class="stat-label">TOTAL REPOSITORIES</text>
    <text x="52" y="45" class="stat-val">${formatNumber(totalRepos)}</text>
    <text x="96" y="45" class="stat-sub">(${formatNumber(publicRepos)} Public / ${formatNumber(privateRepos)} Private)</text>
  </g>

  <!-- Row 2 Right: Current Streak -->
  <g transform="translate(255, 126)" class="stagger-4">
    <rect width="216" height="58" rx="10" fill="url(#tileGrad)" stroke="${borderStroke}" stroke-opacity="0.6" stroke-width="1"/>
    
    <!-- Icon Circle with Pulsing Flame -->
    <g transform="translate(12, 13)">
      <circle cx="16" cy="16" r="16" fill="url(#iconGlowAccent)" />
      <g class="pulse-flame">
        <!-- Crisp Flame Vector -->
        <path fill="${theme.accent}" fill-rule="evenodd" d="M17.5 9.2c.3 1.1-.2 2.2-1 2.9-.5.4-1.2.8-1.2 1.6 0 .8.6 1.4 1.4 1.4.3 0 .7-.1 1-.4 1 1.1 1.6 2.6 1.6 4.2 0 3.6-3 6.5-6.6 6.5S6.1 22.5 6.1 18.9c0-3.1 2.2-5.8 5.3-6.4.3 1.1 1.2 2 2.5 2 .3 0 .6-.1.9-.3.1-1.5 1.2-2.7 2.7-5z"/>
      </g>
    </g>

    <text x="52" y="23" class="stat-label">CURRENT STREAK</text>
    <text x="52" y="45" class="stat-val">${currentStreak} <tspan class="unit">days</tspan></text>
    <text x="146" y="45" class="stat-sub">(Best: ${longestStreak}d)</text>
  </g>

  <!-- Row 3: Pull Requests and Issues (Full Width Tile) -->
  <g transform="translate(24, 192)" class="stagger-5">
    <rect width="447" height="60" rx="10" fill="url(#tileGrad)" stroke="${borderStroke}" stroke-opacity="0.6" stroke-width="1"/>
    
    <!-- Icon Circle -->
    <g transform="translate(12, 14)">
      <circle cx="16" cy="16" r="16" fill="url(#iconGlowPrimary)" />
      <!-- Git PR and Issue Merge Vector -->
      <path fill="${theme.icon}" fill-rule="evenodd" d="M11 9.5A2.5 2.5 0 1 0 8.5 12v6.1a2.5 2.5 0 1 0 2 0V15a2 2 0 0 1 2-2h5.1a2.5 2.5 0 1 0 0-2H12.5A4 4 0 0 0 10.5 13.5V12A2.5 2.5 0 0 0 11 9.5zm10 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
    </g>

    <text x="52" y="24" class="stat-label">PRS &amp; ISSUES CONTRIBUTED</text>
    <text x="52" y="46" class="stat-val">${formatNumber(prsAndIssues)}</text>
    <text x="122" y="46" class="stat-sub">(${formatNumber(totalPullRequests)} Pull Requests · ${formatNumber(totalIssues)} Issues · ${formatNumber(totalReviews)} Reviews)</text>
  </g>
</svg>
`.trim();
}

/**
 * Renders a beautifully styled, animated Error SVG card.
 *
 * @param {string} message - Error message to display
 * @param {object} theme - Theme configuration
 * @returns {string} Error SVG string
 */
export function renderErrorSvg(message, theme) {
  const safeMessage = escapeXml(message || 'An unexpected error occurred');
  const borderStroke = theme.hideBorder ? 'none' : theme.border;

  return `
<svg width="495" height="275" viewBox="0 0 495 275" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Error: ${safeMessage}">
  <defs>
    <linearGradient id="errBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}" stop-opacity="1" />
      <stop offset="100%" stop-color="${theme.bg}" stop-opacity="0.92" />
    </linearGradient>

    <style><![CDATA[
      .error-title {
        font: 700 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        fill: #f43f5e;
      }
      .error-msg {
        font: 500 12px ui-monospace, "SF Mono", Menlo, Consolas, monospace;
        fill: ${theme.text};
      }
      .error-sub {
        font: 400 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        fill: ${theme.subtext};
      }
      @keyframes errPulse {
        0%, 100% { opacity: 0.9; }
        50% { opacity: 0.4; }
      }
      .pulse-dot {
        animation: errPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    ]]></style>
  </defs>

  <!-- Background Box -->
  <rect x="0.5" y="0.5" rx="16" width="494" height="274" fill="url(#errBgGrad)" stroke="${borderStroke}" stroke-width="1.2" />
  
  <!-- Header -->
  <g transform="translate(24, 28)">
    <circle cx="12" cy="12" r="12" fill="#f43f5e" fill-opacity="0.15" />
    <circle cx="12" cy="12" r="5" fill="#f43f5e" class="pulse-dot" />
    <text x="32" y="16" class="error-title">GitHub Stats Error</text>
  </g>

  <!-- Error Detail Tile -->
  <g transform="translate(24, 75)">
    <rect width="447" height="95" rx="10" fill="${theme.badgeBg}" stroke="${borderStroke}" stroke-opacity="0.7" stroke-width="1" />
    <text x="18" y="34" class="error-msg">${safeMessage}</text>
    <text x="18" y="62" class="error-sub">Please verify your username or check your GH_TOKEN on Vercel.</text>
  </g>

  <text x="24" y="242" class="error-sub">Tip: Pass ?username=your_github_handle</text>
</svg>
`.trim();
}
