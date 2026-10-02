---
title: "Show your sources: what App Review taught us about Inner Flare's estimates"
seoTitle: "Show your sources: citing Inner Flare's estimates"
date: 2026-10-01
description: "Apple rejected Inner Flare for showing health information without citations. Fixing it meant finding out that one of our own assumptions was weaker than our code comments claimed."
tags: ["transparency", "app-store", "evidence", "product-design"]
---

Apple rejected Inner Flare under App Store Guideline 1.4.1, Safety: Physical
Harm. The note was short. The app shows health information, it doesn't say
where that information comes from, and it needs citations that are easy for
the user to find.

It was a fair rejection. The app had a "not a medical device" statement and
caveats on every estimate, but no sources. A disclaimer tells you how far to
trust a number. A citation lets you check it yourself. We had the first and
not the second.

## Most of the app needed no citation

The first step was an audit: every place the app makes a claim that isn't
just your own data played back to you.

That list was shorter than expected. Average cycle length, variability, days
since your last period, the gauges, the trend charts and the cycle history
table are all arithmetic on the dates you log. Nobody needs a journal article
to trust a mean. What those need is a plain description of the calculation,
and they now have one.

Everything that does need a source came from four constants in one file:

- the fertile window is the five days before ovulation plus the day itself
- ovulation happens 14 days before the next period
- a period lasts about 5 days
- cycles that differ by more than 7 days are irregular

Four numbers, all general claims about how menstrual cycles work, built into
every prediction the app makes.

## One of our assumptions was weaker than we'd written down

The code comment above the 14 day constant called it "the standard clinical
estimate". That's what most cycle trackers assume, and the
[American College of Obstetricians and Gynecologists](https://www.acog.org/womens-health/faqs/fertility-awareness-based-methods-of-family-planning)
does say ovulation happens about 14 days before the next period in an average
28 day cycle.

Reading the primary research changed how much weight that number can carry.
In [Wilcox and colleagues' 2000 BMJ study](https://www.bmj.com/content/321/7271/1259),
which tracked ovulation with daily hormone measurements, women with 28 day
cycles ovulated exactly 14 days before their next period in only 10% of those
cycles. The gap ranged from 7 to 19 days. A
[2019 analysis of more than 600,000 cycles](https://www.nature.com/articles/s41746-019-0152-7)
found a mean of 12.4 days. The BMJ authors' conclusion is the line worth
quoting: "the timing of their fertile window can be highly unpredictable,
even if their cycles are usually regular."

So 14 days is an average, not a clinical constant. Citing it without the
range would have meant pointing at a source that argues against our own
wording. The fertile window caveat used to say "An estimate, not a reliable
method of contraception." It now says what the estimate assumes and how much
that assumption varies:

> Assumes ovulation about 14 days before your next period. In reality this
> varies from about 7 to 19 days, so treat this as a rough guide, not
> contraception.

The other three held up better. The five day fertile window comes from
[Wilcox's 1995 NEJM study](https://www.nejm.org/doi/full/10.1056/NEJM199512073332301),
which found conception only from intercourse in a six day window ending on
ovulation day. The 7 day irregularity threshold is the strict end of the 7 to
9 day range used by
[ACOG](https://www.acog.org/womens-health/faqs/abnormal-uterine-bleeding) and
[FIGO](https://pmc.ncbi.nlm.nih.gov/articles/PMC10952771/), where the limit
depends on age. Inner Flare applies 7 days to everyone and now says so.

## What changed in the app

There's a new screen, "How estimates work". For each estimate it says how the
calculation works, what the research says about the assumption behind it
(including the range, not just the headline number), and the full citation.
Citations are written out in full, so they're readable offline. Tapping one
opens the original publication in your browser.

<figure class="post-figure">
  <img src="/assets/inner-flare/how-estimates-work.webp" width="424" height="849" loading="lazy" decoding="async"
    alt="The How estimates work screen. A short introduction says every estimate is calculated from the dates you log, published sources are listed for general assumptions, and these are estimates, not medical advice. Below it, cards for average cycle length and variability, and for predicted next period, each explain the calculation and list their sources as tappable citations.">
  <figcaption>The new "How estimates work" screen. Each citation opens the original publication.</figcaption>
</figure>

You can reach it four ways: an info button on Insights, a "How is this
calculated?" link under each prediction, the Calendar legend, and Settings
under About. It doesn't depend on having logged anything, because the time to
decide whether to trust an estimate is before you rely on it.

We link to the primary sources, not to a summary on our own site. The trust
belongs to ACOG, the BMJ, the NEJM and the researchers who did the work, not
to us. If we've misread something, you can see that for yourself.

## Offline still means offline

Inner Flare has no internet permission, and CI fails the build if a URL shows
up anywhere in the source without a written justification. Seven new URLs
needed exactly that. They all live in one file with a comment explaining why,
and a link only opens when you tap it, handed to your system browser. The app
never fetches anything itself.

The citations are also tested. A unit test fails if any estimate loses its
source, if a link isn't https, or if a source points at our own domain
instead of the original. The project rules now say that changing an
assumption or its wording means updating its citation in the same change.

## The point

Inner Flare's pitch has always been that predictions are plain statistics you
can check, not an opaque model you have to trust. Until this week that was
true of the arithmetic and not of the assumptions underneath it. App Review
caught the gap. Fixing it properly also fixed a claim in our own code that
the research didn't support.

The full list of sources is in the app, and in
[the source code](https://github.com/Health-Flare/InnerFlare/blob/main/lib/core/citations/medical_sources.dart).
If you think we've misread any of them, [tell us](mailto:hello@healthflare.org).
