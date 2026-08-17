# 🚀 GitHub Stats SVG Serverless Microservice

A lightweight, zero-dependency Node.js serverless microservice ready to deploy on **Vercel**. It queries the GitHub GraphQL API to fetch your **complete** contribution statistics—including **private contributions** and **contribution streaks**—and renders a compact, high-resolution SVG card for your GitHub profile README.

---

## ✨ Features

- ⚡ **Zero Runtime Dependencies**: Built with native Node.js ES Modules & `fetch`.
- 🔒 **Private Contributions Included**: Uses `restrictedContributionsCount` + `totalCommitContributions` to reflect all your work.
- 🔥 **Accurate Streak Calculation**: Calculates both your **current streak** and **longest streak** from the GitHub calendar.
- 🎨 **Multiple Curated Themes**: GitHub Dark (default), Radical, Tokyo Night, Dracula, Nord, Catppuccin, Cyberpunk, Monokai, and Light.
- 🛠 **Customizable Palette**: Override background, text, title, accent, icon, and border colors dynamically via URL query params.
- ⚡ **Smart Edge Caching**: Configured with `Cache-Control: public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400` to prevent rate-limits while keeping stats fresh.
- 🛡 **Graceful Error SVGs**: Renders visual SVG error cards instead of broken images if an API or token error occurs.

---

## 📸 Markdown Usage Example

Once deployed, add this line to your GitHub profile `README.md`:

```markdown
![GitHub Stats](https://your-vercel-domain.vercel.app/api/stats?username=YOUR_GITHUB_USERNAME&theme=dark)
```

Or with HTML:

```html
<img src="https://your-vercel-domain.vercel.app/api/stats?username=YOUR_GITHUB_USERNAME&theme=tokyonight" alt="GitHub Stats" />
```

---

## 🛠️ Step-by-Step Setup & Deployment

### Step 1: Create a GitHub Personal Access Token (PAT)

To read private contributions and contribution calendars via the GraphQL API, you need a **GitHub Classic Personal Access Token**:

1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)](https://github.com/settings/tokens).
2. Click **Generate new token** (choose **Generate new token (classic)**).
3. Give it a descriptive note (e.g. `Vercel GitHub Stats Microservice`).
4. Select the following scopes:
   - ✅ **`repo`** (Full control of private repositories - required to access private contribution statistics)
   - ✅ **`read:user`** (Read all user profile data)
   - ✅ **`user:email`** (Read user email addresses - optional)
5. Click **Generate token** at the bottom of the page and **copy the token immediately** (it begins with `ghp_`).

> ℹ️ *Note: Also make sure in your GitHub profile settings that "Private contributions" is checked if you want GitHub to expose private counts in your calendar.*

---

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Web Dashboard (Recommended)

1. Push this repository to your GitHub account.
2. Go to [vercel.com](https://vercel.com) and click **Add New... → Project**.
3. Import your `Github_Stats` repository.
4. In the **Environment Variables** section, add:
   - **Key**: `GH_TOKEN`
   - **Value**: *(Paste your `ghp_...` token from Step 1)*
5. Click **Deploy**.

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI globally if you haven't:
   ```bash
   npm i -g vercel
   ```
2. Link & Deploy:
   ```bash
   vercel
   ```
3. Add the environment variable:
   ```bash
   vercel env add GH_TOKEN
   ```
   *(Select `Production`, `Preview`, and `Development`, then paste your token)*
4. Redeploy to apply the environment variable:
   ```bash
   vercel --prod
   ```

---

## 🎨 Themes & Customization

### Available Themes (`theme=...`)

| Theme Name | Preview Description |
| :--- | :--- |
| `dark` *(default)* | GitHub Official Dark palette (`#0d1117`, `#58a6ff`, `#3fb950`) |
| `radical` | Deep purple with neon pink & cyan accents |
| `tokyonight` | Tokyo Night theme (`#1a1b26`, `#70a5fd`, `#38bdae`) |
| `dracula` | Iconic Dracula vampire palette (`#282a36`, `#ff79c6`, `#50fa7b`) |
| `nord` | Arctic, north-bluish palette (`#2e3440`, `#88c0d0`, `#a3be8c`) |
| `catppuccin` | Catppuccin Mocha palette (`#1e1e2e`, `#cba6f7`, `#a6e3a1`) |
| `cyberpunk` | Neon cyberpunk contrast (`#0c0e14`, `#00f0ff`, `#ffe600`) |
| `monokai` | Classic Monokai palette (`#272822`, `#eb1f6a`, `#a6e22e`) |
| `light` | Crisp GitHub light theme |

### Query Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `username` | `string` | *(Required)* | GitHub username to fetch stats for |
| `theme` | `string` | `dark` | One of the built-in themes listed above |
| `hide_border`| `boolean`| `false` | Set to `true` or `1` to remove card outline border |
| `bg_color` | `hex` | *theme default* | Custom card background color (e.g. `bg_color=000000`) |
| `title_color`| `hex` | *theme default* | Custom title font color |
| `text_color` | `hex` | *theme default* | Custom stat value text color |
| `subtext_color` | `hex` | *theme default* | Custom labels text color |
| `accent_color`| `hex` | *theme default* | Custom highlight/commit icon color |
| `icon_color` | `hex` | *theme default* | Custom header & stat icon color |
| `badge_bg` | `hex` | *theme default* | Custom metric card background color |

### Custom Styling Example

```markdown
![Custom Stats](https://your-vercel-domain.vercel.app/api/stats?username=torvalds&bg_color=121212&title_color=ff0055&text_color=ffffff&accent_color=00ffcc)
```

---

## 💻 Local Development & Testing

1. Clone this repository:
   ```bash
   git clone <repo-url>
   cd Github_Stats
   ```

2. Create a `.env` file (or `.env.local`):
   ```env
   GH_TOKEN=ghp_your_personal_access_token_here
   ```

3. Run the local SVG test generator:
   ```bash
   npm test
   ```

4. Start Vercel local dev server:
   ```bash
   vercel dev
   ```
   Visit `http://localhost:3000/api/stats?username=YOUR_USERNAME` in your browser.

---

## 📁 Project Architecture

```
├── api/
│   └── stats.js          # Vercel Serverless Function entry point
├── lib/
│   ├── github.js         # GitHub GraphQL caller & streak calculator
│   ├── themes.js         # Theme palettes and query parameter parser
│   └── renderSvg.js      # SVG card markup generator & error fallback
├── package.json          # Node.js configuration (ES Modules, zero dependencies)
├── vercel.json           # Vercel deployment routes and CORS headers
└── README.md             # Complete documentation
```

---

## 📄 License

MIT License. Feel free to use and customize for your own GitHub profile!
