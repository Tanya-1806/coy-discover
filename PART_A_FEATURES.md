# Part A: Two core features Coy should have

Coy's core promise is that a crush stays secret unless it is mutual. Both features below grow the product without breaking that promise.

## Feature 1: Anonymous "Hints" (progressive clues about a crush)

**What it is.** When a user adds a crush who is not on Coy yet, or has not added them back, the user can unlock small, privacy-safe signals that keep them engaged. Examples: "your crush has opened the invite", "your crush has joined Coy", and later "your crush has added someone" (never who). Nothing identifies anyone, and nothing is revealed that could expose a one-sided crush.

**Why it is required.**
- Today, after adding a crush, the user's only feedback loop is silence. Silence feels the same as rejection, and users churn before the crush ever joins.
- Status hints give users a reason to come back, and they are the natural trigger for push notifications (re-engagement without spam).
- A user who sees "your crush joined" is far more likely to spend on extra slots, so it supports monetisation.

**Privacy edge cases to design for.**
- A hint like "someone added you" is itself information. Show it only to users who have added at least one crush, delay it, and never show a count that could identify one person.
- Never reveal that a crush declined or removed you.
- Rate-limit lookups so nobody can probe the hint endpoint to infer who added whom.

**Success metrics.** D7 retention for users with at least one pending crush, notification open rate, invite-to-signup conversion.

## Feature 2: Invite rewards with a trackable invite link

**What it is.** Each user gets a personal invite link. When a friend or crush signs up through it and completes phone and email verification, the inviter earns a free extra crush slot. The invite page shows the inviter's first name or nothing at all (the inviter chooses), never "X has a crush on you".

**Why it is required.**
- Coy is a network product: a crush can only match if they are on the app. The biggest growth bottleneck is getting crushes to sign up.
- Right now the paywall (extra slots) competes with the invite flow. Rewarding successful invites turns the slot limit from a wall into a growth loop: free users earn slots by bringing people, paying users still buy instantly.
- Verified signups (OTP plus email) in the reward condition protect against fake accounts farming slots.

**Edge cases.**
- Self-invites and duplicate phone numbers or emails must not earn rewards.
- Cap total earned slots per user to protect revenue.
- The invite landing page must not reveal who invited the visitor unless the inviter opted in, so a crush cannot be deduced from an invite.

**Success metrics.** Invites sent per user, invite-to-verified-signup rate, share of new users from invites, paid conversion of users who hit the slot limit.

---
*Note to self before submitting: add 2-3 lines from your own walkthrough of app.getcoy.com (OTP login, adding a crush, email verification, invite link, extra-slots screen) that show where the friction was. That is what the assignment is really checking.*
