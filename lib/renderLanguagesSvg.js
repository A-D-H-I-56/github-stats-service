/**
 * High-End Animated SaaS Dashboard SVG Card Renderer for GitHub Top Languages.
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
 * Renders the high-end animated Top Languages SVG card.
 *
 * @param {object} data - Languages data object
 * @param {object} theme - Theme configuration
 * @param {object} [options={}] - Optional configurations (e.g., hide_progress)
 * @returns {string} Complete SVG string
 */
export function renderLanguagesSvg(data, theme, options = {}) {
  const {
    username,
    name,
    languages = [],
  } = data;

  const displayName = escapeXml(name ? `${name} (@${username})` : username);
  const borderStroke = theme.hideBorder ? 'none' : theme.border;
  const hideProgress = options.hide_progress === 'true' || options.hide_progress === '1';

  // Calculate segmented progress bar widths (total available width = 447px)
  const totalBarWidth = 447;
  let currentX = 0;
  const barSegments = languages.map((lang) => {
    const width = Math.max(3, (lang.percent / 100) * totalBarWidth);
    const segment = {
      x: currentX,
      width,
      color: lang.color,
      name: escapeXml(lang.name),
    };
    currentX += width;
    return segment;
  });

  // Card Dimensions matching Stats card exactly
  const cardHeight = 275;

  return `
<svg width="495" height="${cardHeight}" viewBox="0 0 495 ${cardHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Top Languages for ${escapeXml(username)}">
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

    <radialGradient id="iconGlowPrimary" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${theme.icon}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="${theme.icon}" stop-opacity="0.05" />
    </radialGradient>

    <clipPath id="progressBarClip">
      <rect width="447" height="10" rx="5" />
    </clipPath>

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
      .lang-name {
        font: 600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        fill: ${theme.text};
      }
      .lang-pct {
        font: 700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        fill: ${theme.accent};
      }

      /* Staggered Fade-in Animations */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      /* Bar expansion animation */
      @keyframes barReveal {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      /* Pulse dot animation */
      @keyframes pulseDot {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }

      .stagger-bar {
        animation: barReveal 0.4s ease-out 0.05s both;
      }
      .stagger-1 { animation: fadeIn 0.4s ease-out 0.10s both; }
      .stagger-2 { animation: fadeIn 0.4s ease-out 0.16s both; }
      .stagger-3 { animation: fadeIn 0.4s ease-out 0.22s both; }
      .stagger-4 { animation: fadeIn 0.4s ease-out 0.28s both; }
      .stagger-5 { animation: fadeIn 0.4s ease-out 0.34s both; }
      .stagger-6 { animation: fadeIn 0.4s ease-out 0.40s both; }

      .pulse-live {
        animation: pulseDot 2s ease-in-out infinite;
      }
    ]]></style>
  </defs>

  <!-- Outer Glassmorphic Container -->
  <rect x="0.5" y="0.5" rx="16" width="494" height="${cardHeight - 1}" fill="url(#bgGrad)" stroke="${borderStroke}" stroke-width="1.2" />
  
  <!-- Header Bar -->
  <g transform="translate(24, 26)">
    <!-- Code / Terminal Vector Icon -->
    <g transform="translate(0, -2)">
      <circle cx="11" cy="11" r="11" fill="url(#iconGlowPrimary)" />
      <path fill="${theme.icon}" fill-rule="evenodd" clip-rule="evenodd" d="M5 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6zm2-.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5H7zm1.146 3.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L9.793 11 8.146 9.354a.5.5 0 0 1 0-.708zM11.5 13.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
    </g>

    <!-- Header Title -->
    <text x="30" y="14" class="header-title">Top Languages: ${displayName}</text>

    <!-- Pill Badge -->
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

  ${
    !hideProgress && languages.length > 0
      ? `
  <!-- Multi-Color Segmented Progress Bar -->
  <g transform="translate(24, 60)" class="stagger-bar">
    <g clip-path="url(#progressBarClip)">
      <rect width="447" height="10" fill="${theme.badgeBg}" />
      ${barSegments
        .map(
          (seg) =>
            `<rect x="${seg.x}" y="0" width="${seg.width}" height="10" fill="${seg.color}" />`
        )
        .join('\n      ')}
    </g>
  </g>
  `
      : ''
  }

  <!-- Language Grid List (Spacious 2 Columns of up to 3 Rows) -->
  <g transform="translate(24, ${hideProgress ? 60 : 84})">
    ${languages
      .map((lang, index) => {
        const col = index % 2; // 0 for left, 1 for right
        const row = Math.floor(index / 2);
        const x = col === 0 ? 0 : 231;
        const y = row * 56;
        const staggerClass = `stagger-${index + 1}`;

        return `
    <g transform="translate(${x}, ${y})" class="${staggerClass}">
      <rect width="216" height="48" rx="10" fill="url(#tileGrad)" stroke="${borderStroke}" stroke-opacity="0.6" stroke-width="1"/>
      <!-- Language Color Bullet -->
      <circle cx="18" cy="24" r="5.5" fill="${lang.color}" />
      <text x="32" y="29" class="lang-name">${escapeXml(lang.name)}</text>
      <text x="200" y="29" text-anchor="end" class="lang-pct">${lang.formattedPercent}</text>
    </g>`;
      })
      .join('\n')}
  </g>
</svg>
`.trim();
}

/**
 * Renders an animated Error SVG card for Top Languages.
 *
 * @param {string} message - Error message
 * @param {object} theme - Theme configuration
 * @returns {string} Error SVG string
 */
export function renderLanguagesErrorSvg(message, theme) {
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
    <text x="32" y="16" class="error-title">Top Languages Error</text>
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
