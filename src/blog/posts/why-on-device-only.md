---
title: "Why Health Flare has no accounts, and never will"
date: 2026-09-09
description: "The reasoning behind on-device storage and secure enclaves, not just the marketing line."
---

Most health-tracking apps ask for an account before you've logged a single
symptom. We think that's backwards for a tool meant to hold your family's
most sensitive information.

## The default we chose

Health Flare stores everything locally, encrypted using your device's secure
hardware — Android StrongBox or iOS Secure Enclave, depending on platform.
There's no sign-up flow because there's no server to sign up to. No account
means no password to leak, no database to breach, and no company standing
between you and your own data.

## What this actually costs us

Being honest about trade-offs: on-device-only storage means no built-in
cross-device sync, and no cloud backup unless you export and store that
export yourself. We think that's the right trade for a health journal — the
convenience of sync isn't worth the risk of a health-data breach.

## What it means for you

- Nothing is sent anywhere unless you deliberately export a report to share
  with a doctor.
- Uninstalling the app deletes the data with it — there's no copy sitting on
  a server somewhere.
- We can't see your data, which also means we can't recover it for you if
  you lose your device without a backup. That's a real limitation, and we'd
  rather you know it going in.

Privacy by design only means something if it holds up under scrutiny — so if
you have questions about how this works, or want to push on where it might
fall short, [get in touch](mailto:hello@healthflare.org).
