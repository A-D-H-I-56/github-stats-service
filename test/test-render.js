import { calculateStreaks } from '../lib/github.js';
import { getTheme, THEMES } from '../lib/themes.js';
import { renderStatsSvg, renderErrorSvg } from '../lib/renderSvg.js';
import { renderLanguagesSvg, renderLanguagesErrorSvg } from '../lib/renderLanguagesSvg.js';

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
    { date: '2026-08-18', contributionCount: 1 },
  ];
  const s1 = calculateStreaks(days1);
  assert(s1.currentStreak === 4, `Active streak counting today: expected 4, got ${s1.currentStreak}`);
  assert(s1.longestStreak === 4, `Longest streak: expected 4, got ${s1.longestStreak}`);

  const days2 = [
    { date: '2026-08-14', contributionCount: 0 },
    { date: '2026-08-15', contributionCount: 3 },
    { date: '2026-08-16', contributionCount: 5 },
    { date: '2026-08-17', contributionCount: 2 },
    { date: '2026-08-18', contributionCount: 0 },
  ];
  const s2 = calculateStreaks(days2);
  assert(s2.currentStreak === 3, `Active streak when today is 0: expected 3, got ${s2.currentStreak}`);

  const days3 = [
    { date: '2026-08-15', contributionCount: 10 },
    { date: '2026-08-16', contributionCount: 0 },
    { date: '2026-08-17', contributionCount: 0 },
    { date: '2026-08-18', contributionCount: 0 },
  ];
  const s3 = calculateStreaks(days3);
  assert(s3.currentStreak === 0, `Broken streak: expected 0, got ${s3.currentStreak}`);
  assert(s3.longestStreak === 1, `Longest streak historical: expected 1, got ${s3.longestStreak}`);

  const s4 = calculateStreaks([]);
  assert(s4.currentStreak === 0 && s4.longestStreak === 0, 'Empty days handled gracefully');
}

// 2. Test Theme Resolution
console.log('\n2️⃣ Testing Theme Engine...');
{
  const defaultTheme = getTheme({});
  assert(defaultTheme.bg === THEMES.dark.bg, 'Default theme is dark');

  const gatsbyTheme = getTheme({ theme: 'gatsby' });
  assert(gatsbyTheme.bg === THEMES.gatsby.bg, 'Resolves gatsby theme');

  const tokyoTheme = getTheme({ theme: 'tokyonight' });
  assert(tokyoTheme.bg === THEMES.tokyonight.bg, 'Resolves tokyonight theme');

  const customTheme = getTheme({ theme: 'dark', bg_color: '000000', title_color: 'ff00ff' });
  assert(customTheme.bg === '#000000', 'Custom bg_color override parsed');
  assert(customTheme.title === '#ff00ff', 'Custom title_color override parsed');
}

// 3. Test SVG Card Generation & XML Well-Formedness (Stats Card)
console.log('\n3️⃣ Testing GitHub Stats SVG Card & XML Compliance...');
{
  const sampleStats = {
    name: 'Octocat User',
    username: 'octocat',
    totalRepos: 32,
    publicRepos: 24,
    privateRepos: 8,
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

  const theme = getTheme({ theme: 'gatsby' });
  const svg = renderStatsSvg(sampleStats, theme);

  assert(svg.includes('<svg width="495" height="265"'), 'SVG contains correct dimensions');
  assert(svg.includes('GitHub Stats: Octocat User (@octocat)'), 'SVG contains header with user info');
  assert(svg.includes('TOTAL REPOSITORIES'), 'SVG contains Total Repositories tile');
  assert(svg.includes('32'), 'SVG contains total repository count');
  assert(svg.includes('24 Public / 8 Private'), 'SVG contains public / private repos breakdown');
  assert(svg.includes('1,420'), 'SVG contains formatted total contributions');
  assert(svg.includes('1,105'), 'SVG contains formatted total commits');
  assert(svg.includes('12'), 'SVG contains current streak');
  assert(svg.includes('80'), 'SVG contains combined PRs and Issues');
  assert(svg.includes('<![CDATA['), 'SVG style is safely wrapped in CDATA');
  assert(svg.includes('</svg>'), 'SVG is closed properly');

  const withoutCdata = svg.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');
  const unescapedAmpMatch = withoutCdata.match(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;)/g);
  assert(!unescapedAmpMatch, 'Zero unescaped XML entity references exist outside CDATA');

  const errorSvg = renderErrorSvg('User "nonexistent" not found', theme);
  assert(errorSvg.includes('User &quot;nonexistent&quot; not found'), 'Error SVG renders and escapes message');
}

// 4. Test Top Languages SVG Card & XML Compliance
console.log('\n4️⃣ Testing Top Languages SVG Card & XML Compliance...');
{
  const sampleLanguages = {
    name: 'Octocat User',
    username: 'octocat',
    languages: [
      { name: 'TypeScript', color: '#3178c6', size: 50000, percent: 50.0, formattedPercent: '50.0%' },
      { name: 'JavaScript', color: '#f1e05a', size: 30000, percent: 30.0, formattedPercent: '30.0%' },
      { name: 'Python', color: '#3572A5', size: 10000, percent: 10.0, formattedPercent: '10.0%' },
      { name: 'HTML', color: '#e34c26', size: 5000, percent: 5.0, formattedPercent: '5.0%' },
      { name: 'CSS', color: '#563d7c', size: 3000, percent: 3.0, formattedPercent: '3.0%' },
      { name: 'Shell', color: '#89e051', size: 2000, percent: 2.0, formattedPercent: '2.0%' },
    ],
    totalBytes: 100000,
  };

  const theme = getTheme({ theme: 'gatsby' });
  const langSvg = renderLanguagesSvg(sampleLanguages, theme);

  assert(langSvg.includes('<svg width="495" height="225"'), 'Top Languages SVG contains correct dimensions');
  assert(langSvg.includes('Top Languages: Octocat User (@octocat)'), 'Top Languages SVG contains header');
  assert(langSvg.includes('TypeScript'), 'Top Languages SVG includes TypeScript');
  assert(langSvg.includes('50.0%'), 'Top Languages SVG includes percentages');
  assert(langSvg.includes('clip-path="url(#progressBarClip)"'), 'Top Languages SVG includes progress bar');
  assert(langSvg.includes('<![CDATA['), 'Top Languages SVG style is safely wrapped in CDATA');
  assert(langSvg.includes('</svg>'), 'Top Languages SVG is closed properly');

  const withoutCdataLang = langSvg.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');
  const unescapedAmpLangMatch = withoutCdataLang.match(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;)/g);
  assert(!unescapedAmpLangMatch, 'Zero unescaped XML entity references in Languages SVG');

  const langErrSvg = renderLanguagesErrorSvg('User not found', theme);
  assert(langErrSvg.includes('Top Languages Error'), 'Languages error SVG renders correctly');
}

console.log(`\n========================================`);
console.log(`Total tests passed: ${passedTests}`);
console.log(`Total tests failed: ${failedTests}`);
console.log(`========================================`);

if (failedTests > 0) {
  process.exit(1);
}
