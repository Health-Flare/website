---
title: "What's new in Health Flare 1.9.1"
date: 2026-10-04
description: "Quick Log got smarter about what you type, and more careful about what it saves. Plus flares, fluids, peak flow, body locations, and opt-in cycle and bowel tracking."
tags: ["release", "product"]
---

Most of 1.9.1 is about Quick Log, the text box behind the + button on the
Dashboard. You type what happened in plain words and it works out what kind
of entry that is. In earlier versions it worked that out by grabbing the
first keyword it recognised. That was fast, and it was wrong often enough to
be annoying. This release fixes how it reads, and makes it more honest about
what it's going to save.

## It reads the whole entry now

Quick Log used to stop at the first word it knew, so a dose that happened to
mention a condition could be filed as a condition note. Now it weighs the
whole entry before it suggests anything, and a named medication dose is
treated as a dose.

<figure>
  <img src="/assets/blog/1-9-1/symptom.webp" width="640" height="290" loading="lazy" decoding="async"
    alt="Quick Log with the text: Bad flare today, knees and wrists both swollen. Below it, the button reads Quick Add: Symptom.">
  <figcaption>The suggested type and the button label come from the whole sentence, not the first keyword.</figcaption>
</figure>

It also only offers a quick save when the values it found can actually be
stored. If it can't save your text as a structured record, the button says
"Add to Journal" instead, so what the button says matches what happens.

<figure>
  <img src="/assets/blog/1-9-1/journal.webp" width="640" height="290" loading="lazy" decoding="async"
    alt="Quick Log with the text: Took 400mg ibuprofen for the pain. Ibuprofen is not one of this profile's medications, so the button reads Add to Journal.">
  <figcaption>When the detected type can't be saved, the button says so.</figcaption>
</figure>

## Short notes stay short

A one-word entry like "Tired" is now kept as a plain note. It used to get
guessed into a record. Some days a word is all you have, and the app
shouldn't turn it into something you didn't say.

Along the same lines, the daily check-in's wellbeing score can now be left
unset. A mood note never invents a score, and an existing score is never
replaced by a guess. Opening Quick Log and closing it with nothing typed no
longer touches your data at all.

## More things Quick Log can record

- **Flares.** "Flare started today, pain 7/10" starts a flare. You can end
  one the same way.
- **Fluids.** "Drank two litres of water this afternoon" logs fluid intake.
- **Peak flow and step count.** Both can now be saved as vitals. A reading
  like "420 L/min" is a peak flow, not 420 litres of fluid. That was a real
  bug, and it's fixed.
- **Mood and cycle notes** go onto today's check-in.
- **Bowel and bladder events**, but only after you turn that on.

<figure>
  <img src="/assets/blog/1-9-1/flare.webp" width="640" height="290" loading="lazy" decoding="async"
    alt="Quick Log with the text: Flare started today, pain 7/10. The button reads Quick Add: Flare.">
  <figcaption>Starting a flare from one line of text.</figcaption>
</figure>

<figure>
  <img src="/assets/blog/1-9-1/peak-flow.webp" width="640" height="290" loading="lazy" decoding="async"
    alt="Quick Log with the text: Peak flow was 420 L/min this morning. The button reads Quick Add: Vital.">
  <figcaption>Peak flow is a vital now, and "L/min" no longer reads as litres.</figcaption>
</figure>

## Cycle and bowel tracking are off until you turn them on

Profile edit has two new switches: cycle tracking and bowel tracking. Both
start off. Not everyone wants either, and a health app shouldn't assume. If
you're tracking for a child or another family member, each profile has its
own setting.

## Body locations on symptoms

Symptom entries can now store where it hurts. The symptom form has a
location picker, and Quick Log picks up locations from your text ("lower
back" wins over "back").

## Small changes you'll notice

The Dashboard + button opens Quick Log. The Tracking, Meds, Meals, and
Journal screens keep their own add button, so a symptom you log from
Tracking is saved as a symptom, not a journal note.

Restore and import now reject a file that isn't a Health Flare database
before trying to open it.

## Get it

1.9.1 is on the [App Store](https://apps.apple.com/app/health-flare/id6803123766)
and [Google Play](https://play.google.com/store/apps/details?id=org.healthflare.app.healthflare&hl=en).
The full list of changes is in the
[changelog](https://github.com/Health-Flare/app/blob/main/CHANGELOG.md). If
Quick Log reads something of yours wrong, [tell us](mailto:hello@healthflare.org)
what you typed and what it guessed. Those examples are how it gets better.
