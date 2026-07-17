I built 𝗥𝗲𝗰𝗼𝗴𝗻𝗶𝘇𝗲𝗿 after playing a symbol-matching game with my children.

The rule takes ten seconds to explain:

𝘛𝘸𝘰 𝘤𝘢𝘳𝘥𝘴. 𝘌𝘪𝘨𝘩𝘵 𝘴𝘺𝘮𝘣𝘰𝘭𝘴 𝘦𝘢𝘤𝘩. 𝘌𝘹𝘢𝘤𝘵𝘭𝘺 𝘰𝘯𝘦 𝘮𝘢𝘵𝘤𝘩.

Building it raised three useful questions:

• How do you guarantee that rule across all 1,596 possible card pairs?

• How do you turn a shared game into a good single-player challenge?

• How much infrastructure does a small browser game actually need?

The mathematical part uses a finite projective plane. The test suite verifies every possible card pair.

The product stays deliberately small: 10, 20, or 50 cards, a timer, and local high scores. No accounts, global rankings, or backend.

𝗔 𝘀𝗶𝗱𝗲 𝗻𝗼𝘁𝗲 𝗳𝗼𝗿 𝘁𝗵𝗼𝘀𝗲 𝗶𝗻𝘁𝗲𝗿𝗲𝘀𝘁𝗲𝗱 𝗶𝗻 𝘀𝗼𝗳𝘁𝘄𝗮𝗿𝗲 𝗱𝗲𝗹𝗶𝘃𝗲𝗿𝘆:

I also used the project as a compact, end-to-end SDLC example: written requirements, scope and acceptance criteria; separated and testable domain logic; versioned storage with migration handling; unit, component, browser, mobile, and accessibility tests; formatting, linting, type and build gates; locked dependencies with automated updates; and repeatable PWA deployment through GitHub Actions and GitHub Pages.

𝘕𝘰𝘵 𝘣𝘦𝘤𝘢𝘶𝘴𝘦 𝘢 𝘴𝘮𝘢𝘭𝘭 𝘨𝘢𝘮𝘦 𝘯𝘦𝘦𝘥𝘴 𝘦𝘯𝘵𝘦𝘳𝘱𝘳𝘪𝘴𝘦 𝘵𝘩𝘦𝘢𝘵𝘳𝘦.

Its limited scope simply makes the whole chain visible:

𝗥𝘂𝗹𝗲 → 𝗿𝗲𝗾𝘂𝗶𝗿𝗲𝗺𝗲𝗻𝘁 → 𝗶𝗺𝗽𝗹𝗲𝗺𝗲𝗻𝘁𝗮𝘁𝗶𝗼𝗻 → 𝗮𝘂𝘁𝗼𝗺𝗮𝘁𝗲𝗱 𝘃𝗲𝗿𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 → 𝗿𝗲𝗹𝗲𝗮𝘀𝗲

Good technical leadership is often this practical: make constraints explicit, avoid features that do not earn their cost, and automate checks people should not have to remember.

It was also nice to show my children how something from our table can become working—and properly delivered—software.

https://marcelpetrick.github.io/recognizer/

#SoftwareLeadership #SDLC #SoftwareQuality #EngineeringManagement #GameDevelopment
