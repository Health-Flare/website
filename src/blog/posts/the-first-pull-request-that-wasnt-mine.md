---
title: "The first pull request that wasn't mine"
date: 2026-11-01
description: "Health Flare merged its first pull request from someone outside the project. That was the point of building it in the open."
tags: ["open-source"]
---

Health Flare merged PR #218 this week: a per-profile height unit preference, cm or inches, the same way the app already handles temperature. There is nothing special about the feature itself, just an ordinary diff, but what's different this time is who wrote it, and it wasn't me.

The issue it closed was written like any other: what the feature should do, the exact pattern to copy, the files that needed to change. The PR that came back followed it closely, migration included, with a note in the body saying a local test couldn't run in the contributor's environment, instead of just claiming a clean pass. That's the behaviour I'd want from anyone on a team.

I found out by habit, not by alert. I'd never actually gotten CODEOWNERS routing to tell me anything, so I just stumbled into it while going through my usual pass of GitHub PRs. First reaction was plain surprise. The better feeling came a minute later, reading the diff: it slotted into the codebase like it had always belonged there.

The reason I think it worked: every feature here starts as a plain language spec in the public repo, `docs/features/*.feature`, before any code exists. A few days earlier I'd added AGENTS.md, an llms.txt, and a CODEOWNERS file, so a contributor landing cold has something to orient against instead of guessing at the shape of the codebase. This time, someone used it.

Health Flare started because keeping notes by hand, between a full time job and caring for family, wasn't working. It is still, mostly, one person's project. But "mostly" changed this week, and that's the actual milestone, not the feature itself. The app being legible enough for a stranger to read, trust, and extend correctly is worth more than any amount of polish I could have added alone.

It's free and open source, on Android and iOS: [healthflare.org](https://healthflare.org).
