# HealthFlare <img src="https://github.com/Health-Flare/app/blob/main/assets/images/HealthFlare%20Icon%20Light-256.png" width="48" height="48">

**A privacy-first health tracking app for children with complex or chronic conditions.**

HealthFlare helps families track symptoms, identify triggers, and share meaningful data with healthcare providers — without sending a single byte of personal information to a server.

---

## Why HealthFlare?

Managing a child's chronic health condition means logging symptoms across months, juggling appointments, and trying to spot patterns that are nearly impossible to see in isolation. Most tracking tools either require cloud accounts, lack the nuance for complex conditions, or are too clinical to fit into a family's daily routine.

HealthFlare was built from personal experience to solve this problem; designed to be genuinely useful, deeply private, and approachable for parents who aren't data scientists.

---

## Core Principles

**Privacy by design.** All data lives on-device, encrypted using platform secure enclaves (Android StrongBox / iOS Secure Enclave). There are no accounts, no servers, and no analytics. Your family's health data is yours.

**Pattern recognition, not just logging.** HealthFlare goes beyond journaling. The app identifies temporal and relational patterns — symptom cycles, clustering, treatment efficacy — to surface insights that are hard to spot manually.

**Built for real families.** The interface is designed to be fast for daily use and gentle enough for hard days. Progressive disclosure keeps the experience unobtrusive for experienced users while guiding newcomers.

**Designed to help providers help you.** Share condition summaries with doctors using granular anonymization controls — you decide what gets shared and in what form.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | Flutter (iOS & Android) |
| Storage | On-device encrypted local database |
| Key management | Android Keystore / iOS Secure Enclave |
| Design | Fraunces + DM Sans, warm amber/coral palette |

---

## Working on this website locally

This repository (the marketing site and blog) is a static site built with
[Eleventy](https://www.11ty.dev/). The hand-written marketing pages
(`src/index.html`, `src/privacy.html`, `src/inner-flare/index.html`,
`src/inner-flare/privacy.html`) are copied through untouched; `src/blog/`
and `src/inner-flare/blog/` are templated.

Requires Node.js 18 or later.

```bash
# Install dependencies
npm install

# Build the site once, output goes to dist/
npm run build

# Build and start a live-reloading dev server (http://localhost:8080)
npm run dev

# Build and serve the built output the same way CI does (http://localhost:3000)
npm run serve
```

Before committing a change, review it the same way CI will check it:

```bash
# Validate the built HTML
npm run lint:html

# Validate inline CSS (only runs if .css files exist)
npm run lint:css

# Run the Cucumber/Playwright end-to-end suite against a served build
npm run build
npx serve dist -l 3000 &
BASE_URL=http://localhost:3000 npm run test:ci
```

### Adding a blog post

Add a new Markdown file under `src/blog/posts/`, for example:

```bash
cat > src/blog/posts/my-new-post.md <<'EOF'
---
title: "Post title"
date: 2026-01-01
description: "One or two sentence summary shown on the blog index."
---

Post body in Markdown.
EOF

npm run dev
```

The file's `layout`, `permalink` (`/blog/<filename>/`), and `posts` tag are
set automatically by `src/blog/posts/posts.json`, so a post only needs
`title`, `date`, and `description` in its front matter. Preview it at
`http://localhost:8080/blog/` before committing.

Inner Flare has its own blog, nested at `/inner-flare/blog/`, using the same
pattern with Inner Flare's own brand tokens and layouts
(`src/_includes/layouts/inner-flare-base.njk` /
`inner-flare-post.njk`). Add posts under `src/inner-flare/blog/posts/`; the
front matter defaults (layout, permalink, `inner-flare-posts` tag) come
from `src/inner-flare/blog/posts/posts.json`, so a post only needs `title`,
`date`, and `description`. Preview it at `http://localhost:8080/inner-flare/blog/`.

---

## Status

> ✅ **Live on the App Store and Google Play.**

HealthFlare is available now for [iOS](https://apps.apple.com/app/health-flare/id6803123766) and [Android](https://play.google.com/store/apps/details?id=org.healthflare.app.healthflare&hl=en). If you're a parent, caregiver, or healthcare provider with feedback, reach out via the contact below.

---

## Get Involved

This project is driven by a single human and carefully crafted AI support with a specific mission. We're not looking to move fast, we're looking to get it right.
As the first user with a personal attachment, I have every desire to be clean, and clear about what the application does and how it does it.

- **Download / feedback:** [healthflare.org](https://healthflare.org)
- **Security concerns:** Please disclose responsibly via the contact on our website
- **General inquiries:** Open a discussion in the relevant repository

---

*Built by [AutomatedBytes](https://Automatedbytes.com) — small team, meaningful software.*

