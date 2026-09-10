---
title: "Why Inner Flare exists"
date: 2026-09-09
description: "Reproductive rights are being rolled back, reproductive health data is being used against the people it describes, and reproductive health touches every human on earth. Here is why that means this app has to be private by construction, not by policy."
---

Inner Flare is a cycle tracker that never leaves your device. No account, no
server, no analytics. We've written elsewhere about the general privacy
architecture; this post is about the specific reason that architecture is
non-negotiable for this particular app, in this particular decade.

## Reproductive rights are not settled. They are being actively rolled back

For decades, a lot of people treated reproductive rights as a solved
problem: something to assume, not something to defend. That assumption no
longer holds. In the United States,
*[Dobbs v. Jackson Women's Health Organization](https://www.supremecourt.gov/opinions/21pdf/19-1392_6j37.pdf)*
(2022) ended a fifty-year constitutional protection and
handed the question back to individual states, many of which moved
immediately to ban or sharply restrict abortion. Since then, the legal
ground has kept shifting under related care: the
[Alabama Supreme Court's 2024 ruling](https://caselaw.findlaw.com/court/al-supreme-court/115829667.html)
that frozen embryos count as "children" under the state's
wrongful-death statute froze IVF services at clinics across the state
overnight, over a treatment nobody was arguing about a year earlier.
Contraception access, once treated as the uncontroversial baseline, is now
openly part of the same political fight.

We are not building Inner Flare to take a side in that fight. We are
building it because the fight is real, the rules are actively changing, and
software that assumes yesterday's legal settlement is stable is building on
sand. A tracking tool for reproductive health has to work under the
assumption that the legal status of reproductive care can change
underneath its users with very little warning, in either direction,
depending on where they live.

## Your data can be used against you, and it already has been

This is not a hypothetical risk. It is a documented pattern:

- After *Dobbs*, digital-security researchers and organizations like the
  [EFF publicly urged people to reconsider](https://www.eff.org/deeplinks/2022/06/should-you-really-delete-your-period-tracking-app)
  what period-tracking and fertility
  apps they used, because a subpoena for medical or app data can become
  part of a criminal case in states that now prosecute abortion.
- [In Nebraska in 2022](https://www.npr.org/2022/08/12/1117092169/nebraska-cops-used-facebook-messages-to-investigate-an-alleged-illegal-abortion),
  prosecutors obtained a teenager's private Facebook
  messages, compelled directly from Meta, and used them as evidence in a
  criminal case over a self-managed abortion. The lesson generalizes past
  any one company or app: if a record of your body exists on someone else's
  server, it can be compelled from that server, regardless of what the
  privacy policy promised.
- [Data brokers have been caught selling location data](https://www.vice.com/en/article/location-data-abortion-clinics-safegraph-planned-parenthood/)
  that could identify
  visits to reproductive health clinics, no subpoena required, just a
  purchase.
- The FTC has taken enforcement action against multiple period and fertility
  apps, including
  [Flo Health](https://www.ftc.gov/news-events/news/press-releases/2021/06/ftc-finalizes-order-flo-health-fertility-tracking-app-shared-sensitive-health-data-facebook-google),
  [GoodRx](https://www.ftc.gov/news-events/news/press-releases/2023/02/ftc-enforcement-action-bar-goodrx-sharing-consumers-sensitive-health-info-advertising),
  and [Premom](https://www.ftc.gov/news-events/news/press-releases/2023/05/ovulation-tracking-app-premom-will-be-barred-sharing-health-data-advertising-under-proposed-ftc),
  for sharing sensitive
  reproductive health data with advertising and analytics platforms after
  telling users that data would stay confidential.

None of these are edge cases. They are the ordinary, predictable result of
collecting sensitive reproductive health data anywhere a company, a
platform, or a government can eventually reach it. "We take your privacy
seriously" is not a defense against a subpoena. The only defense that
actually holds is not having the data to hand over in the first place.

## This is not a niche issue. It affects every human on earth

Reproductive health gets talked about as a women's issue, or a niche
health category. It is neither. Every single person alive exists because
of a reproductive process, and reproductive health shapes outcomes for
partners trying to conceive, for people managing endometriosis or PCOS
that has nothing to do with pregnancy, for parents planning a family, for
anyone whose hormonal health affects mood, energy, and long-term wellbeing,
and for the children and communities downstream of all of the above. You
do not have to be pregnant, trying to get pregnant, or even capable of
pregnancy for reproductive health policy and reproductive health data
practices to eventually touch your life. Treating this as a narrow,
optional category of health software is how it ends up under-built,
under-protected, and first on the chopping block when a company needs to
cut costs or monetize a data set. We think it deserves the opposite: the
same rigor, the same privacy guarantees, and the same seriousness as any
other health data, because it is exactly as consequential as any other
health data, for exactly as many people.

## So Inner Flare is built to have nothing to give away

Given all of that, "we promise not to misuse your data" was never going to
be a strong enough answer. The answer we built instead:

- **No server, ever.** Inner Flare has no backend. There is nothing to
  breach, nothing to subpoena, and no company standing between you and
  your own cycle data, because there is no company in that position at all.
- **Encrypted at rest, on-device only.** Your data lives in a local SQLite
  database, encrypted with SQLCipher, unlocked with your device's own
  biometrics through the platform secure key store (iOS Keychain / Android
  Keystore). It doesn't sync anywhere by default because there is nowhere
  for it to sync to.
- **No network permission, enforced, not just promised.** The offline-only
  claim isn't a line in a privacy policy; it's enforced by CI. The app
  doesn't request network access, and a lint check fails the build if a
  URL literal ever shows up in the source, the same pattern Health Flare
  uses.
- **No analytics, no third-party SDKs, no ad tech.** Nothing is bundled in
  to phone home on your behalf, and nothing profiles you for anyone else's
  benefit.
- **Export is a deliberate, visible act you control.** The only time data
  leaves your device is when you choose to export it, as a file you hand to
  your own share sheet. It never happens silently in the background.
- **Free and open source**, so none of this has to be taken on faith. The
  code is public at
  [github.com/Health-Flare/InnerFlare](https://github.com/Health-Flare/InnerFlare).
  If a claim on this page doesn't hold up, anyone can check it against the
  actual source, the same standard set out in the
  [Free Software Definition](https://www.gnu.org/philosophy/free-sw.html)
  and the [Open Source Definition](https://opensource.org/osd).

## The point

Rights that felt permanent are being rolled back. Data that felt private
has been used as evidence against the people it was collected from. And
the health this app tracks is not a side category, it runs through nearly
every family and every life on the planet in one form or another. Given
all three of those at once, the only design we were willing to ship is one
where there is simply nothing to take: no account to breach, no server to
subpoena, no company to pressure. Your cycle data stays on your device
because that is the only place it is actually safe.

If something here doesn't hold up, or you want to check any of it against
the code, [get in touch](mailto:hello@healthflare.org). We would rather
answer that question than have you take it on faith.
