import { calculateStreaks } from '../lib/github.js';
import { getTheme, THEMES } from '../lib/themes.js';
import { renderStatsSvg, renderErrorSvg } from '../lib/renderSvg.js';

console.log('🧪 Starting GitHub Stats Microservice Test Suite...\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedTests++;
  }
}

// 1. Test Streak Calculation
console.log('1️⃣ Testing Streak Calculation Engine...');
{
  const days1 = [
    { date: '2026-08-14', contributionCount: 0 },
    { date: '2026-08-15', contributionCount: 3 },
    { date: '2026-08-16', contributionCount: 5 },
    { date: '2026-08-17', contributionCount: 2 },
    { date: '2026-08-18', contributionCount: 1 }, // today
  ];
  const s1 = calculateStreaks(days1);
  assert(s1.currentStreak === 4, `Active streak counting today: expected 4, got ${s1.currentStreak}`);
  assert(s1.longestStreak === 4, `Longest streak: expected 4, got ${s1.longestStreak}`);

  // Test when today has 0 contributions yet, but yesterday had contributions (streak still active)
  const days2 = [
    { date: '2026-08-14', contributionCount: 0 },
    { date: '2026-08-15', contributionCount: 3 },
    { date: '2026-08-16', contributionCount: 5 },
    { date: '2026-08-17', contributionCount: 2 },
    { date: '2026-08-18', contributionCount: 0 }, // today 0
  ];
  const s2 = calculateStreaks(days2);
  assert(s2.currentStreak === 3, `Active streak when today is 0: expected 3, got ${s2.currentStreak}`);

  // Test broken streak (yesterday 0, today 0)
  const days3 = [
    { date: '2026-08-15', contributionCount: 10 },
    { date: '2026-08-16', contributionCount: 0 },
    { date: '2026-08-17', contributionCount: 0 },
    { date: '2026-08-18', contributionCount: 0 },
  ];
  const s3 = calculateStreaks(days3);
  assert(s3.currentStreak === 0, `Broken streak: expected 0, got ${s3.currentStreak}`);
  assert(s3.longestStreak === 1, `Longest streak historical: expected 1, got ${s3.longestStreak}`);

  // Empty days
  const s4 = calculateStreaks([]);
  assert(s4.currentStreak === 0 && s4.longestStreak === 0, 'Empty days handled gracefully');
}

// 2. Test Theme Resolution
console.log('\n2️⃣ Testing Theme Engine...');
{
  const defaultTheme = getTheme({});
  assert(defaultTheme.bg === THEMES.dark.bg, 'Default theme is dark');

  const tokyoTheme = getTheme({ theme: 'tokyonight' });
  assert(tokyoTheme.bg === THEMES.tokyonight.bg, 'Resolves tokyonight theme');

  const customTheme = getTheme({ theme: 'dark', bg_color: '000000', title_color: 'ff00ff' });
  assert(customTheme.bg === '#000000', 'Custom bg_color override parsed');
  assert(customTheme.title === '#ff00ff', 'Custom title_color override parsed');
}

// 3. Test SVG Card Rendering
console.log('\n3️⃣ Testing SVG Card Generation...');
{
  const sampleStats = {
    name: 'Octocat User',
    username: 'octocat',
    totalContributions: 1420,
    totalCommits: 1105,
    publicCommits: 805,
    privateContributions: 300,
    totalPullRequests: 45,
    totalReviews: 20,
    totalIssues: 15,
    prsAndIssues: 80,
    currentStreak: 12,
    longestStreak: 45,
  };

  const theme = getTheme({ theme: 'dark' });
  const svg = renderStatsSvg(sampleStats, theme);

  assert(svg.includes('<svg width="495" height="200"'), 'SVG contains correct dimensions');
  assert(svg.includes('GitHub Stats: Octocat User (@octocat)'), 'SVG contains header with user info');
  assert(svg.includes('1,420'), 'SVG contains formatted total contributions');
  assert(svg.includes('1,105'), 'SVG contains formatted total commits');
  assert(svg.includes('12'), 'SVG contains current streak');
  assert(svg.includes('80'), 'SVG contains combined PRs and Issues');
  assert(svg.includes('@keyframes cardFadeIn'), 'SVG contains staggered fade-in animations');
  assert(svg.includes('@keyframes flamePulse'), 'SVG contains flame pulsing animation');
  assert(svg.includes('</svg>'), 'SVG is closed properly');

  // Test Error SVG
  const errorSvg = renderErrorSvg('User "nonexistent" not found', theme);
  assert(errorSvg.includes('User &quot;nonexistent&quot; not found'), 'Error SVG renders and escapes message');
}

console.log(`\n========================================`);
console.log(`Total tests passed: ${passedTests}`);
console.log(`Total tests failed: ${failedTests}`);
console.log(`========================================`);

if (failedTests > 0) {
  process.exit(1);
}
