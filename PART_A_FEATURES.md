# Part A: Coy Experience and Suggested Core Features

## My experience of the app

I explored Coy end to end: phone OTP login, adding a crush, email verification, the invite link and the extra-slots screen. The experience was smooth and intuitive, and the flow is easy to follow for a first-time user.

Its strongest aspect is its privacy model. A crush remains completely hidden until the other person adds the user back, so users face no embarrassment or discomfort if feelings are not reciprocated. This is the core promise that builds user trust. The extra-slots model also gives Coy a clear and natural way to earn revenue while the free experience stays useful, so the product works well for both users and the company.

## Feature 1: Anonymous Hints

**What it is.** Users receive privacy-safe status signals about a crush, such as "your crush has opened the invite" or "your crush has joined Coy". These signals never identify anyone or reveal one-sided interest.

**Why it is required.**
- After adding a crush, the user currently gets no feedback. Silence feels like rejection and leads to drop-off.
- Hints give users a reason to return and create natural moments for push notifications.
- A user who sees that a crush has joined is more likely to buy extra slots, so it supports revenue.

**Privacy considerations.** A hint must never reveal that someone added the user, that a crush declined, or any count that could identify one person. Hint requests should be rate-limited so they cannot be used to probe who added whom.

**Success metrics.** Day-7 retention for users with a pending crush, notification open rate, and invite-to-signup conversion.

## Feature 2: Invite Rewards

**What it is.** Each user has a personal invite link. When an invited person completes phone and email verification, the inviter earns a free extra crush slot.

**Why it is required.**
- A match is only possible if the crush is on Coy, so growth depends on invitations.
- Rewarding verified invites turns the slot limit into a growth loop rather than a barrier, while paying users can still buy slots instantly.
- Requiring verification prevents fake-account abuse.

**Privacy considerations.** The invite page must not reveal who invited the visitor unless the inviter opts in. Self-invites and duplicate phone numbers or emails must not earn rewards, and the number of earned slots should be capped.

**Success metrics.** Invites sent per user, invite-to-verified-signup rate, share of new users from invites, and paid conversion among users who reach the slot limit.
