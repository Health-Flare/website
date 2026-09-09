---
title: "Why Health Flare is free, offline, and not for sale"
date: 2026-09-09
description: "Why this project is free and open source software, why it stays offline and private by default, why we're using AI to build it, and why it will never track you."
---

Health Flare is free software. It runs entirely on your device. No account,
no server, no analytics. Here is why, in plain terms.

## Free and open source, not just free of charge

"Free software" does not mean "software with no price tag." It means
software whose source code is public, so anyone can read it, check what it
actually does, change it, and redistribute it. That distinction matters a
lot for a health app. You should not have to take a company's word for what
happens to your data. You should be able to check.

If you have not spent time in the free and open source world, the two
reference documents worth reading are the
[Free Software Definition](https://www.gnu.org/philosophy/free-sw.html) from
the Free Software Foundation and the
[Open Source Definition](https://opensource.org/osd) from the Open Source
Initiative. They differ in emphasis (freedom versus practical development
process) but agree on the basics: the code is open, you can inspect it, and
you are not locked out of your own tools.

Health Flare's code lives at
[github.com/Health-Flare](https://github.com/Health-Flare), including the
[mobile app itself](https://github.com/Health-Flare/app). You do not need
our permission to read it, and you do not need to trust our marketing copy
over the code.

## Offline first, because your health data does not belong on someone else's server

Chronic illness data is some of the most sensitive information a person can
generate: symptom patterns, medications, triggers, the private detail of how
a body behaves on a bad day. That kind of data attracts breach risk, resale
to data brokers, and use against the very people it describes, in
underwriting, employment, or worse.

The usual answer from most software is "we secure it well." We think the
better answer is "it never leaves your device in the first place." Health
Flare stores everything locally, encrypted with your device's own secure
hardware (Android StrongBox or iOS Secure Enclave, depending on platform).
There is no login because there is no account to log into. If data never
leaves your device, there is no server to breach, no database to subpoena,
and no company standing between you and your own health record.

## Why we are using AI to build this, and the tension we are not pretending away

Health Flare is built by a small team using AI-assisted development. We are
not going to dress that up as uncomplicated. There are real, unresolved
questions around how AI models are trained, what they cost to run, and what
they displace. We do not think those questions are settled, and we are not
claiming ours is the definitive answer to them.

Here is the reasoning we are actually working from. Calm, private, genuinely
useful tools for managing chronic illness should have existed years ago.
The technology to build them offline, on-device, without ads or
subscriptions or data harvesting, has existed for a long time. Mostly, it
was not built that way, because the economics of venture-funded software
reward the opposite: accounts, engagement metrics, and data to sell. A
small team without that funding, building this kind of software from
scratch by hand, on a normal timeline, is a multi-year undertaking that most
people in our position could not sustain.

AI-assisted development changes that arithmetic. It lets a small team close
a real gap in a realistic amount of time, without waiting on an industry
that has had the resources to build this for a long time and largely chose
not to. That is the justification we are using, not a claim that the
tradeoffs disappear because the cause is good. Every line of code that ships
is still reviewed and owned by a person, and we would rather be honest about
using the tool than pretend the whole thing was written by hand for the sake
of appearances.

## Building the tool people actually need

Health Flare started from a personal, specific problem: tracking a child's
chronic condition across months, trying to see patterns that are close to
invisible when you are living inside them day to day. Most existing tools
either require an account and a cloud backend, are built for clinicians
rather than families, or bury the useful parts behind a subscription.

We think a tool like this should not be a luxury, and it should not be a
means of collecting health data under the guise of helping you manage it.
It should just work, stay out of your way on hard days, and belong to the
person using it.

## No tracking. No cloud. Full stop.

To be specific about what "non-tracking" and "not cloud based" actually mean
in Health Flare, rather than leaving it as a slogan:

- No analytics or telemetry of any kind, not even anonymized usage counts.
- No third-party SDKs. Nothing is bundled in to phone home on our behalf.
- No accounts, no login, no server-side profile of you anywhere.
- Fonts and other assets are bundled with the app and this site, not pulled
  from a third-party CDN that could log the request.
- The only time data leaves your device is when you deliberately export a
  report to share with a doctor. That is a manual, visible action you take,
  not something that happens in the background.

If something here does not hold up, or you want to check any of it against
the actual code, [get in touch](mailto:hello@healthflare.org). We would
rather answer that question than have you take it on faith.
