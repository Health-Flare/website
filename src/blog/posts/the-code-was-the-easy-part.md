---
title: "The code was the easy part: what building Health Flare taught us about the quiet battles around us"
date: 2026-09-21
description: "On discovering that the real difficulty in building a health app was never the code, but reckoning with how much invisible labor chronic illness demands from the people living it every day."
tags:
  - posts             # keep first: this is the collection tag Eleventy builds the blog list from
  - chronic-illness
  - patient-experience
  - product-design
  - healthtech
layout: layouts/post.njk
permalink: "/blog/{{ page.fileSlug }}/"
---

<!-- Note: as with the template, if your site sets tags/layout for the
     whole Blogs folder via a directory data file, delete the tags/layout/
     permalink lines above and let that file stay the source of truth. -->

When you set out to build a digital health platform, your initial reality is defined by technical challenges. You spend weeks debating the optimal tech stack, architecting secure data pipelines for longitudinal biometric tracking, fine-tuning release scripts, and navigating the opaque guidelines of mobile app store review boards. It is easy to convince yourself that shipping performant, reliable code is the central obstacle between your product and the world.
Then the application goes live, real people begin using it, and the data ceases to be an abstraction.

## The weight people carry

The most profound and unexpected realization of this entire journey has not been how to setup a listing on an app store or manage rapid deployment pipelines. What has come to light - with stark, humbling clarity - is the sheer magnitude of what people are carrying every single day. Almost everyone is fighting, managing, or overcoming something.

Once you open an interface designed to capture the daily reality of health, the invisible weight of human illness comes into sharp focus. The range of challenges is overwhelming: systemic cancer treatments, major depression, generalized anxiety, chronic hypertension, debilitating osteoarthritis, unpredictable eczema flare-ups, and the bone-deep, unrelenting exhaustion that links them together. Public health surveillance from the Centers for Disease Control and Prevention confirms what we've observed across conversations with **people**: [six in ten](https://stacks.cdc.gov/view/cdc/61396) American adults live with at least one chronic illness, and four in ten manage two or more conditions simultaneously. 
Illness is not an exceptional circumstance; for hundreds of millions of people, it is the daily background reality of existence.
What is most striking is that the physical biology of disease is often only half the struggle. What remains hidden is the exhausting, full-time labour required simply to navigate life as a patient.

## The unseen labour of being a patient

Long before an individual logs an entry in an app, they have travelled what medical researchers call the "burden of treatment" and the "diagnostic odyssey". In the autoimmune community, for example, [patients spend an average of nearly five years](https://www.benaroyaresearch.org/blog/diagnosing-autoimmune-diseases) and consult five different clinicians just to secure an accurate diagnosis, repeatedly enduring the psychological sting of having their physical symptoms dismissed as stress or anxiety. Patients routinely describe an exhausting logistical obstacle course: waiting months for specialist appointments, fighting insurance companies over medication approvals (yes, even in Canada), balancing the high cost of prescriptions against basic household groceries, and struggling to coordinate care across fragmented hospital systems.
Health services researchers have quantified this reality: individuals managing multiple [chronic conditions spend between 2.5 and 3.5 hours every day](https://pmc.ncbi.nlm.nih.gov/articles/PMC1466884/) on health-related activities alone - organizing pills, administering therapies, coordinating care, tracking vitals, and travelling to clinics. Chronic illness constitutes an unpaid, high-stakes second job, performed under conditions of physical vulnerability and cognitive depletion.

## What this means for how we build

Building Health Flare forced us to confront a vital design principle: our software cannot become another chore on an already overflowing plate. If a health app simply demands more time, more manual logging, and more cognitive overhead from a user who is already running on empty, it fails the very people it was built to support. Our technological responsibility is not just to build software that functions smoothly, but to practice what medicine calls Minimally Disruptive Care: designing tools that respect the user's finite time and capacity, ease the administrative burden of being sick, and provide meaningful clarity when life feels overwhelming.
