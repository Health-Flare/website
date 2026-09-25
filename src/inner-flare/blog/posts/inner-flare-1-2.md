---
title: "Inner Flare 1.2: charts that admit what they don't know"
# Set to the real release day before publishing.
date: 2026-10-01
description: "Inner Flare 1.2 turns the dashboard into one grid you arrange and resize, adds gauge and trend cards scaled to your own cycles, and adds a plain cycle table for appointments. Still no account, no cloud, no internet permission."
tags: ["release", "product"]
# Held back until release day: remove these two lines to publish.
permalink: false
eleventyExcludeFromCollections: true
---

Inner Flare 1.2 is out on the App Store and Google Play. It's a free update,
like every update, and it's mostly about one thing: reading your own data
at a glance, without the app pretending to know more than it does.

## One dashboard, arranged your way

Quick stats, Calendar, and Insights used to sit in separate sections. They
now share one grid, and nothing in it is more important than anything else
unless you make it so.

Drag cards into any order. Open **Customize dashboard** and drag a card's
corner in the live preview to make it wider or taller; the rest of the grid
makes room as you go. Hide anything you never look at. If your dashboard
creeps past six cards, the app suggests a tidy-up and names any duplicates.
It never rearranges anything on its own.

## Gauge and trend cards, scaled to you

Two new card types, from **Customize dashboard → Add a card**:

- A **gauge** showing days since your last period, or estimated days until
  your next one. It fills against your own average cycle length, not a
  textbook 28 days.
- A **trend chart** of your previous cycle lengths, as bars or a line, with
  your average marked and your latest cycle highlighted.

The part we care most about is what these cards won't do. If you've logged
fewer than two complete cycles, or your recent cycles vary by more than a
week, the gauge shows a rough range and labels it as one. The trend chart
won't draw a trend out of a single cycle. It tells you it needs more
history instead.

A cycle tracker that always has a confident answer is not being accurate.
It is guessing, and not telling you.

You'll also see symptom frequency, flow intensity, and cycle length
variability in the card list, marked "Coming soon". They aren't tracked
yet, and they're greyed out until they are.

## A plain table for your next appointment

Tap a cycle length chart and you get a table: each cycle's start date, its
length, and how much it changed from the one before, newest first. It's
built for the moment someone asks "how regular are your cycles?" and you'd
rather read the answer than estimate it.

It shows what you logged. It doesn't interpret it, diagnose anything, or
recommend anything. That's the doctor's job, and your call.

## Said plainly, on first launch

The first time you unlock the app, it now tells you three things before
anything else: it isn't a medical or diagnostic device, your logs stay on
your phone unless you choose to export them, and there's no account to
create. You can re-read it any time under **Settings → Privacy and
disclaimer**.

That screen links to our privacy policy. Tapping it opens your browser.
Inner Flare itself still has no internet permission and fetches nothing.

## Smaller things

- **Auto-lock** has its own page in Settings, with the same options as
  before, from "Immediately" to "Never".
- **Charts update right away.** Previously, dashboard charts could show old
  numbers after you logged a day or imported a backup until you left and
  came back. Fixed.

## What didn't change

No account. No cloud. No ads, no analytics, no tracking. Your data is
encrypted on your phone and unlocked with your face, fingerprint, or
passcode. The [code is public](https://github.com/Health-Flare/InnerFlare),
and the full release notes are on
[GitHub](https://github.com/Health-Flare/InnerFlare/releases/tag/v1.2.0).
