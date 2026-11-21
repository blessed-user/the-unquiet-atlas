# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML, CSS, and browser-native ES modules, packaged by a Node.js 22 entrypoint. The game must run offline with no install, build step, or network request.

## Users

Desktop players who enjoy close observation, and make.fun judges evaluating the game from real browser screenshots before play-testing it with keyboard and mouse.

## Product Purpose

Create a complete spot-the-difference game that rewards careful looking across multiple scenes. Success means the player can understand the task immediately, find fair but non-obvious changes, use a meaningful hint, feel time pressure and progress, and complete a satisfying multi-scene expedition.

## Positioning

The game is an original field archive rather than a generic puzzle sheet: five one-off documentary scenes are constructed as paired contact prints, with differences tied to the objects and implied stories in each location.

## Operating Context

The game opens in a current desktop browser from local static files. Players compare paired pictures, click either side to mark a difference, move a keyboard loupe when desired, request limited hints, and advance through an expedition route.

## Capabilities and Constraints

- At desktop play sizes, two near-identical pictures remain visible side by side while playing; narrow mobile layouts stack the full-width exposures rather than shrinking their details into untappable thumbnails.
- Found differences receive persistent markers; several unfound differences and a remaining counter are visible in submitted screenshots.
- Five escalating scenes provide 15, 25, or 50 finds in total according to difficulty.
- Mouse and keyboard play are both supported.
- The game includes useful hints, visible time pressure, sound controls, pause, restart, and completion states.
- Every runtime file lives under `game/`; the game makes no network request.
- Three or four screenshots must be real, unedited browser renders and each must fit the bounty's image limits.

## Brand Commitments

The user selected a field-archive world: moody 1970s expedition contact sheets spanning a specimen desk, a night market, a coastal weather station, a mangrove ferry, and a rainforest field camp. The imagery must feel specific, authentic, and difficult for another entrant to source or reproduce.

## Evidence on Hand

The official make.fun kit defines the runtime, dossier, screenshot, and submission requirements. There are no supplied customer claims or third-party image assets; all scene imagery and game content must be original.

## Product Principles

- Make observation feel like fieldwork, not a worksheet.
- Hide changes in story-rich details, never arbitrary noise.
- Keep the player's next action and remaining work legible at a glance.
- Reward accuracy and momentum without punishing accessibility needs.
- Treat every submitted screenshot as both proof of play and a composed artifact.

## Accessibility & Inclusion

All controls require visible focus states and descriptive labels. Keyboard play must cover scene navigation, loupe movement, marking, hint, pause, and sound. Reduced-motion and high-contrast preferences are respected, status changes are announced, and color is never the only marker of a found difference.
