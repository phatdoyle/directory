# Made by Punks

A trustless, community-owned directory of projects built by CryptoPunks holders.

## Philosophy

CryptoPunks belong to no one and everyone. This directory exists to celebrate the builders who keep the punk spirit alive.

**Made by Punks is not a company.** There is no team, no token, no roadmap. It's a public good maintained by the community, for the community.

- **Trustless** - All data lives in markdown files. No database, no backend, no single point of failure.
- **Permissionless** - Anyone can add their punk profile and projects via pull request.
- **Decentralized** - Fork it, remix it, make it your own. The code is MIT licensed.
- **Community-owned** - Maintainers are punk holders who volunteer their time.

This is lore that belongs to everyone.

## Project Structure

```
madebypunks/
├── content/
│   ├── pages/                    # Static pages (markdown)
│   │   └── add.md                # "Add Your Project" page content
│   └── punks/
│       └── [punkId]/             # One folder per punk (e.g., 2113/)
│           ├── index.md          # Punk profile & metadata
│           └── [project].md      # One file per project
├── public/
│   └── projects/                 # Project thumbnail images
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── add/                  # /add page
│   │   └── punks/
│   │       └── [id]/             # /punks/[id] page
│   │           └── [projectId]/  # /punks/[id]/[projectId] page
│   ├── components/               # React components
│   ├── data/
│   │   └── punks.ts              # Data loader (reads content/ at build time)
│   ├── lib/                      # Utilities & constants
│   └── types/                    # TypeScript types
└── README.md
```

## How It Works

1. All punk and project data is stored as **markdown files** in `content/punks/`
2. At build time, `src/data/punks.ts` reads all markdown files and parses the YAML frontmatter
3. Pages are statically generated for each punk and project
4. No database, no API, no runtime data fetching

## Add Your Punk Profile

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/madebypunks.git
cd madebypunks
```

### 2. Create Your Punk Folder

```bash
mkdir -p content/punks/YOUR_PUNK_ID
```

### 3. Add Your Profile (`index.md`)

```md
---
name: Your Name
twitter: your_handle
website: https://your-site.com
---

Write anything you want here. This is your space.

Share your story, your vision, whatever. Markdown is supported.
```

**Fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `name` | No | Display name |
| `twitter` | No | Twitter/X handle (without @) |
| `website` | No | Personal website URL |

### 4. Add Your Projects

Create a file for each project (e.g., `my-project.md`):

```md
---
name: My Project
description: A brief description of what it does.
thumbnail: /projects/my-project.png
url: https://my-project.com
launchDate: 2024-01-15
tags:
  - Tool
  - Art
twitter: project_handle
github: https://github.com/user/repo
discord: https://discord.gg/invite
---

Optional longer description in markdown.
```

**Fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Project name |
| `description` | Yes | Short description (1-2 sentences) |
| `url` | Yes | Project URL |
| `launchDate` | Yes | Launch date (YYYY-MM-DD) |
| `tags` | Yes | Array of tags |
| `thumbnail` | No | Path to thumbnail (e.g., `/projects/my-project.png`) |
| `twitter` | No | Project's Twitter handle |
| `github` | No | GitHub repository URL |
| `discord` | No | Discord invite URL |
| `hidden` | No | Set to `true` to hide from listings |

### 5. Add Thumbnail (Optional)

Place your project image in `public/projects/`:

```bash
public/projects/my-project.png
```

Recommended size: **1200x630px** (OG image dimensions).

### 6. Submit PR

```bash
git add .
git commit -m "Add Punk #1234 and projects"
git push origin main
```

Then open a pull request. A maintainer will review and merge.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Become a Maintainer

Want to help review PRs?

Open an issue titled **"Maintainer Request"** with:

- Your punk ID
- Your Twitter/X handle
- Why you want to help

Maintainers review contributions and keep spam out. No special privileges, just responsibility.

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS v4](https://tailwindcss.com/) - Styling
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - YAML frontmatter parsing
- [react-markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering

## Colors

Official CryptoPunks palette:

- **Punk Blue:** `#638696`
- **Punk Pink:** `#ff69b4`

## Deploy

Deploy your own instance on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gwendall/madebypunks)

## License

MIT - Do whatever you want with it.
