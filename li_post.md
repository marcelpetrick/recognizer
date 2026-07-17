# Recognizer: LinkedIn story material

## The original thought, cleaned up

I love board games and turn-based games. We played a physical symbol-matching
game with the kids, and its basic rule stayed with me: two cards, several
symbols, and always exactly one symbol that appears on both.

At first glance, it is only pattern matching and visual recognition under time
pressure. The symbols are rotated, scaled, and rearranged, so the eyes know
what to look for while the brain still needs a moment to find it. The rule is
easy to understand and surprisingly hard to master.

The more interesting question sits behind the cards: which set of symbols and
cards has to be constructed so that _every_ pair of cards shares exactly one
symbol? That is the kind of mathematical puzzle I love—the same attraction I
find in Project Euler problems.

Then came the product idea: take a game usually played together and make a
useful “game for one” out of it. Add a timer, a personal high score, and short,
medium, and long challenges. The opponent is no longer the person across the
table. It is your previous run.

I also wanted a compact reason to explore the current browser stack. The result
became a TypeScript/React game built with Vite, installable as a PWA, hosted on
GitHub Pages, and automatically rebuilt and deployed from GitHub Actions. It is
a small project, but it is treated as proper software.

The personal part matters as much as the technology: I love showing my children
that an idea from the family table does not have to remain an idea. It can be
understood, reduced to rules, built, tested, and shared with anyone who has a
browser.

## What the repository actually supports

These are safe, concrete facts to use in posts:

- The game contains 57 symbols and 57 cards, with 8 symbols on each card.
- Every symbol occurs on exactly 8 cards.
- Every two distinct cards share exactly one symbol.
- The construction is a finite projective plane of order 7. Cards correspond
  to lines; symbols correspond to points.
- There are 1,596 distinct card pairs, and an automated test checks the
  exactly-one-match property for all of them.
- A run uses 10, 20, or 50 cards, which means 9, 19, or 49 matching decisions.
- Card membership stays fixed, while placement, size, and rotation vary. The
  current rotation range is up to 55 degrees in either direction.
- The single-player timer uses a monotonic clock. Changing the system clock
  during a run cannot rewind the score.
- Rankings and preferences are local to the browser. There is no account,
  backend, global leaderboard, or cheat-resistant competition.
- The game supports English, German, and Croatian.
- It is responsive, touch-friendly, installable, and usable offline after its
  assets have been cached.
- The browser stack is React 19, TypeScript 6, Vite 8, CSS, Local Storage, the
  Web Audio API, and a service worker/PWA manifest.
- The quality stack includes Prettier, ESLint, TypeScript checks, 45 Vitest
  unit/component tests, Playwright browser tests for desktop and mobile, and an
  automated axe accessibility scan.
- A push to `master` starts two separate GitHub Actions workflows: the complete
  CI quality workflow and the GitHub Pages build/deploy workflow.
- Dependabot checks npm packages and GitHub Actions weekly.

Accuracy note: deployment is automatic, but the Pages workflow currently runs
separately from CI. Do not say that production deployment waits for every CI
quality gate to pass. A precise formulation is: “Each push triggers the quality
pipeline and a separate build-and-deploy workflow.”

## Voice calibration

The useful traits from Marcel's public writing are:

- Begin with the concrete impulse: an old tool, a spare-time experiment, a
  family moment, or a curiosity about a technology.
- Use exact facts and numbers after the hook. The proof matters.
- Allow a little dry humor or one odd detail; do not turn every sentence into a
  joke.
- Move from the visible toy to the engineering underneath it. A recurring,
  authentic turn is: “What I am proud of is not only the visible feature, but
  treating it as a proper software project.”
- Use short contrasts: “No backend. No account. No app store.”
- Be candid about scope and limitations instead of pretending a side project is
  a startup.
- Finish with a question someone can answer from experience.
- Keep emojis and hashtags restrained. The story and the artifact should do the
  work.

Avoid the standard LinkedIn fog: “thrilled to announce,” “incredible journey,”
“leveraging cutting-edge technology,” generic lessons about passion, or a long
shopping list of tools before the reader knows why the project exists.

## The strongest narrative threads

### 1. From the family table to a public URL

The emotional arc is not “I built a game.” It is: we played something together,
I became curious about its smallest rule, and I showed the kids how an everyday
idea can travel from observation to mathematics to code to a public artifact.

### 2. One innocent word: _always_

“Two cards have one match” sounds trivial. “Every possible pair of cards has
exactly one match” is a construction problem. The word _always_ is where the
finite geometry, implementation, and exhaustive tests enter the story.

### 3. The brain versus harmless transformations

The object does not change, but its position, scale, and rotation do. That makes
the game a tiny demonstration of how recognition differs from exact pixel
matching. This can be narrated without pretending the project is an AI or
computer-vision system: the player is the recognizer.

### 4. Turning company into competition with yourself

The single-player adaptation is a real product decision. A timer and a local
personal best turn a shared-card mechanic into a repeatable solo challenge. No
multiplayer infrastructure is required; the previous run supplies enough
pressure.

### 5. The browser as a small game console

The project is a good vehicle for showing what a modern browser can provide:
touch input, responsive rendering, sound, persistence, installation, offline
use, and updates through a URL—without an app store or backend.

### 6. Automation protects the fun

CI/CD is not enterprise decoration here. It removes repetitive chores and keeps
a hobby project trustworthy. The pipeline checks the math, behavior, layout,
translations, production build, mobile flow, and basic accessibility. GitHub
Pages then turns a push into a playable release.

### 7. A toy can still be proper software

Small projects are where it is tempting to skip types, tests, accessibility,
dependency maintenance, and repeatable deployment. The sharper story is that
the project stays playful for users because its foundations are deliberately
boring and reliable.

## Teasing hooks and lines

- Two cards. Eight symbols each. Exactly one match. Always. That last word is
  the entire software project.
- I built a game whose rules fit in one sentence—and whose deck needs finite
  geometry.
- A deck of 57 cards creates 1,596 pairs. I made the same promise for every one
  of them.
- My children saw balloons, bicycles, and ladybirds. I saw a finite projective
  plane.
- Some family games end when the children go to bed. This one became a PWA.
- Easy to explain in ten seconds. Hard to stop replaying once a timer appears.
- I made a game for one out of a game we played together. That sounds backwards.
  It works.
- I did not add multiplayer. I added an opponent with perfect availability:
  your previous best time.
- There is no backend, no login, and no app store. Just a URL, a timer, and your
  ego.
- Rotate it. Scale it. Move it. Your eyes still know the symbol—eventually.
- The player does the pattern recognition. The tests make sure the puzzle never
  cheats.
- The most important test in this project is also a small proof.
- What looks like a children's game is a geometry problem wearing clip art.
- My favorite feature is the one nobody sees: I no longer deploy the game by
  hand.
- `git push`. Quality checks. Production build. GitHub Pages. Back to trying to
  beat my score.
- Automation is how a weekend project stays fun after the weekend.
- A toy project is still software. Its users do not care that the bugs happened
  in your spare time.
- I wanted to learn the modern browser stack, so I gave myself a project with
  immediate feedback: either the game is fun, or it is not.
- Showing children what software can do is nice. Showing them how an idea
  becomes software is better.

## Post 1 — The origin story

**Suggested visual:** `media/game.png`, ideally with the shared balloon left
unmarked so readers can play before reading.

### Paste-ready copy

Some family games end when the children go to bed.

This one became a PWA.

We played a symbol-matching game with the kids. The rule is almost suspiciously
simple:

Two cards. Eight symbols each. Exactly one symbol appears on both. Find it
before somebody else does.

In the end, it is pattern recognition under time pressure. Rotate the symbols,
scale them, move them around—and suddenly the balloon you have seen a hundred
times needs another half-second.

Easy to understand. Hard to master. My favorite kind of game.

I wondered whether the same idea would work as a game for one. No opponent
across the table; just 10, 20, or 50 cards, a running clock, and your own best
time waiting to be beaten.

That became **Recognizer**.

The innocent part of the rule is “one shared symbol.” The interesting part is
“always.” How do you construct a full deck where _every_ pair of cards has
exactly one match?

The answer is a finite projective plane of order 7:

- 57 symbols
- 57 cards
- 8 symbols per card
- exactly one shared symbol for every pair

That mix of a simple rule and a mathematical structure is catnip to me. It has
the same appeal as a good Project Euler problem: understandable immediately,
but deep enough to keep pulling at the thread.

The other reason for building it was more personal. I love showing my children
that an idea from our table can be taken apart, understood, turned into code,
and shared with anyone who has a browser.

No installation required. No account. Open it and play:

https://marcelpetrick.github.io/recognizer/

Code:

https://github.com/marcelpetrick/recognizer

What physical game would you like to turn into a small browser experiment?

#WebDevelopment #TypeScript #React #Math #GameDevelopment

## Post 2 — The mathematics hidden in the toy

**Suggested visual:** a split image: the two round game cards on the left and a
small “57 cards / 1,596 pairs / 1 match” diagram on the right.

### Paste-ready copy

A deck of 57 cards creates 1,596 distinct pairs.

Recognizer makes the same promise for every single one:

**Exactly one shared symbol. Never zero. Never two.**

That is the part I find more interesting than the user interface.

If I had assigned symbols randomly, I could have generated cards until things
looked plausible. It would also have produced a wonderful intermittent bug:
somewhere in the deck, two cards would eventually have no valid answer—or more
than one.

Instead, the deck is constructed as a finite projective plane of order 7.
Points become symbols. Lines become cards.

The result has a rather satisfying symmetry:

- 57 points / symbols
- 57 lines / cards
- 8 symbols on every card
- every symbol on 8 cards
- one intersection for every pair of lines

And because a mathematical guarantee deserves a software guarantee, the test
suite checks all 1,596 card pairs.

I like tests like this. It is not merely checking an example. It is verifying
the central promise of the game.

The symbols may rotate, change size, and move around the card. The deck
structure never changes. The player gets variety without the rule becoming
unreliable.

What looks like a children's game is a geometry problem wearing clip art.

Try it:

https://marcelpetrick.github.io/recognizer/

Source:

https://github.com/marcelpetrick/recognizer

Do you have a favorite project where a product rule turned out to be a
mathematical problem?

#Mathematics #SoftwareTesting #TypeScript #ProjectEuler #GameDevelopment

## Post 3 — Why I chose the browser

**Suggested visual:** a phone and desktop showing the same game screen, or a
short capture moving from the menu into a 10-card challenge.

### Paste-ready copy

There is no backend, no login, and no app store.

Just a URL, a timer, and your ego.

For **Recognizer**, I deliberately chose “whatever the modern browser can do”
as the technology constraint.

I wanted a small, complete project for getting hands-on with the current web
stack—not another demo that ends after rendering a counter.

So the browser has to do the whole job:

- render and randomize the cards responsively
- handle mouse and touch input
- keep an honest monotonic timer
- give visual and audio feedback
- store preferences and local rankings
- work in English, German, and Croatian
- install as a PWA and continue offline after the first load

The implementation uses React, TypeScript, Vite, CSS, Local Storage, the Web
Audio API, and a service worker. No server is required because this game does
not need one.

That last sentence matters. “Could have a backend” and “benefits from a backend”
are very different things.

The result loads on desktop or phone, remembers the best times in that browser,
and turns the previous run into the next opponent. You can finish a short
challenge before many native apps have finished asking for permissions.

This is what I still enjoy about software development: pick one modest idea,
follow it all the way through, and use it to discover how much a platform has
changed.

Play it here:

https://marcelpetrick.github.io/recognizer/

Repository:

https://github.com/marcelpetrick/recognizer

What is the smallest project that taught you a surprising amount about a
platform?

#WebDevelopment #PWA #React #TypeScript #LearnByBuilding

## Post 4 — The deployment nobody has to perform

**Suggested visual:** `media/record.png` next to a cropped green GitHub Actions
run, or a short three-frame graphic: push → checks/build → playable page.

### Paste-ready copy

My favorite feature in this game is one the player will never see:

I no longer deploy it.

A push to `master` triggers GitHub Actions. One workflow runs the quality
pipeline:

- locked dependency installation
- formatting and Markdown-link checks
- ESLint and TypeScript
- 45 unit and component tests
- production PWA build
- Playwright tests on desktop and mobile
- an automated accessibility scan

A separate workflow builds the game for its GitHub Pages path, uploads the
artifact, and publishes it. Dependabot keeps an eye on npm packages and the
Actions themselves.

Then the new version is simply available in the browser.

For a small game, this can look like a lot of ceremony. I see it differently:
automation is how a spare-time project stays enjoyable after the first burst of
motivation.

The interesting work is the game rule, the finite geometry behind the deck,
the feel of the timer, and whether a rotated ladybird is still recognizable on
a phone. Repeating release steps by hand adds nothing to that.

And a toy project is still software. Players do not care that a broken build,
layout regression, or bad deployment happened during somebody's weekend.

Small scope is a good reason to keep the pipeline proportionate. It is not a
reason to make the result fragile.

The deployed game:

https://marcelpetrick.github.io/recognizer/

The repository and workflows:

https://github.com/marcelpetrick/recognizer

Which part of your personal-project release process did you automate first?

#GitHubActions #CICD #GitHubPages #SoftwareQuality #OpenSource

## Recommended sequence

Publish the origin story first because it gives every later technical post a
human reference point. Follow with the mathematics post while the game is still
fresh. Use the browser-stack post as the “what I learned” chapter, then the
deployment post as the engineering close.

The four posts should not be published on consecutive days. They work better as
separate glimpses of one project than as a launch thread. Reuse the project
name and links, but change the visual and opening claim each time.

If only one post is published, use Post 1. If two are published, use Posts 1 and
2; together they contain the personal motive and the most distinctive technical
fact.

## Source references used for this draft

- [Recognizer live game](https://marcelpetrick.github.io/recognizer/)
- [Recognizer repository](https://github.com/marcelpetrick/recognizer)
- [Marcel Petrick on LinkedIn](https://www.linkedin.com/in/marcelpetrickit/)
- [Qt6: preview is available and usable](https://www.linkedin.com/pulse/qt6-preview-available-usable-marcel-petrick/)
- Repository source, tests, README, local pipeline, GitHub Actions workflows,
  and screenshots as of 2026-07-17
