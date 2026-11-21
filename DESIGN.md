---
name: The Unquiet Atlas
description: A tactile 1970s field-archive contact sheet for close observation.
colors:
  blackout: "#09211e"
  bottle: "#12352e"
  bottle-light: "#1d493e"
  paper: "#d8c9a8"
  paper-light: "#eee3c8"
  paper-dark: "#ad9b75"
  ink: "#17221d"
  ink-soft: "#425148"
  brass: "#bf9a55"
  brass-light: "#e4c97f"
  grease: "#e24c3f"
  grease-ink: "#932d29"
  cyan: "#74b7af"
  focus: "#f2d889"
typography:
  display:
    fontFamily: '"Barlow Archive", sans-serif'
    fontSize: "clamp(2.3rem, 3.5vw, 4.3rem)"
    fontWeight: 700
    lineHeight: 0.79
    letterSpacing: "-0.025em"
  headline:
    fontFamily: '"Barlow Archive", sans-serif'
    fontSize: "clamp(1.75rem, 2.5vw, 3.15rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.025em"
  title:
    fontFamily: '"Barlow Archive", sans-serif'
    fontSize: "1.85rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.03em"
  body:
    fontFamily: '"Atkinson Field", sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0"
  label:
    fontFamily: '"Barlow Archive", sans-serif'
    fontSize: "0.7rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "0.1em"
rounded:
  square: "0"
  control: "2px"
  circle: "50%"
spacing:
  micro: "4px"
  tool-gap: "7px"
  frame-inset: "8px"
  compact: "12px"
  section: "18px"
  sheet-inset: "clamp(13px, 1.35vw, 23px)"
  screen-gutter: "clamp(18px, 2.5vw, 46px)"
components:
  contact-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "{spacing.sheet-inset}"
  photo-frame:
    backgroundColor: "#18201d"
    textColor: "#d8d0bc"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "8px 8px 19px"
  difficulty-option:
    backgroundColor: "transparent"
    textColor: "#93aaa0"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "4px 9px 3px"
  difficulty-option-selected:
    backgroundColor: "{colors.brass-light}"
    textColor: "{colors.blackout}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "4px 9px 3px"
  route-stop:
    backgroundColor: "transparent"
    textColor: "#93ada2"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "0"
  archive-tool:
    backgroundColor: "#203d36"
    textColor: "#dbe3d7"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "7px 9px"
  archive-tool-hover:
    backgroundColor: "#294a41"
    textColor: "#dbe3d7"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "7px 9px"
  completion-action:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-light}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  instrument-reading:
    backgroundColor: "transparent"
    textColor: "{colors.brass-light}"
    typography: "{typography.title}"
    rounded: "{rounded.square}"
    padding: "0"
  inspection-loupe:
    backgroundColor: "transparent"
    rounded: "{rounded.circle}"
    size: "52px"
  toast:
    backgroundColor: "#0a2621"
    textColor: "{colors.paper-light}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "11px 15px"
---

# Design System: The Unquiet Atlas

## Overview

**Creative North Star: "The Working Conservator's Light Table"**

The interface reads as one recovered, catalogued artifact under examination. A deep bottle-green blackout surrounds a warm paper contact sheet; the paired exposures, evidence copy, route, and tools all feel attached to that working surface rather than arranged as dashboard cards.

The system is dense, documentary, and tactile without sacrificing state legibility. Condensed archival typography carries titles, stamps, labels, and instruments, while a highly readable body face handles instructions and evidence. Brass, faded cyan, and grease-pencil red behave as material state signals, not decorative accent color.

**Key Characteristics:**
- A warm physical contact sheet dominates a deep bottle-green blackout.
- Archival labels, route stamps, and tabular instruments carry game status without a floating HUD.
- Paired 8:5 exposures, grease-pencil findings, and a shared loupe make comparison the focal interaction.
- Brass, cyan, and red are state-bearing accents, never ambient decoration.

## Colors

The palette combines nocturnal archive greens, aged paper, oxidized metal, and sparse evidence marks.

### Primary
- **Archive Blackout** (`colors.blackout`): The page field, scrollbar track, and darkest contrast ground.
- **Bottle Green** (`colors.bottle`): The core archive-green family used to keep surrounding UI in the same physical world.
- **Lifted Bottle Green** (`colors.bottle-light`): The brighter green response used when dark actions rise on hover.

### Secondary
- **Oxidized Brass** (`colors.brass`): Meters, scroll affordances, and structural highlights.
- **Lamp Brass** (`colors.brass-light`): Selected difficulty, current route stamp, instrument numerals, and high-value action emphasis.
- **Inspection Focus** (`colors.focus`): Keyboard focus outlines only; it remains brighter than ordinary brass for reliable discovery.

### Tertiary
- **Grease Pencil** (`colors.grease`): Found rings, false-mark crosses, and urgent low-time feedback.
- **Dried Grease Ink** (`colors.grease-ink`): The oversized unresolved count and red copy that must sit legibly on paper.
- **Faded Cyan Stamp** (`colors.cyan`): The masthead eyebrow and completed-route state.

### Neutral
- **Archive Paper** (`colors.paper`): The dominant contact sheet and completion curtain.
- **Paper Highlight** (`colors.paper-light`): Primary text on blackout and dark control surfaces.
- **Aged Paper Edge** (`colors.paper-dark`): The darker end of the paper family for subdued material contrast.
- **Graphite Ink** (`colors.ink`): Titles and strongest copy on paper.
- **Soft Graphite** (`colors.ink-soft`): Captions, evidence support copy, and secondary paper text.

### Named Rules

**The Evidence Color Rule.** Grease red is reserved for observations, false marks, and urgent time pressure; brass indicates selection and instrumentation; faded cyan marks archive identity or completion.

**The Warm Paper, Cold Blackout Rule.** Working content belongs on paper or bottle green. Do not introduce generic white, gray, or blue application surfaces.

## Typography

**Display Font:** Barlow Archive (local Barlow Condensed 600/700, with sans-serif fallback)
**Body Font:** Atkinson Field (local Atkinson Hyperlegible 400/700, with sans-serif fallback)
**Label/Mono Font:** Barlow Archive; tabular numerals are enabled on timers, accuracy, score, and curtain statistics.

**Character:** The narrow display face resembles catalog stamps and instrument labels without imitating distressed novelty type. Atkinson Field keeps explanations, evidence, and controls readable against the dense archival composition.

### Hierarchy
- **Display** (`typography.display`): The stacked masthead identity; the completion verdict extends the same family at a larger one-off scale.
- **Headline** (`typography.headline`): Scene names on the contact sheet; uppercase, balanced, and dominant without competing with the exposures.
- **Title** (`typography.title`): Instrument readings and major numeric status.
- **Body** (`typography.body`): Captions, evidence, field notes, control names, and explanatory text.
- **Label** (`typography.label`): Route stops, metadata, frame captions, keycaps, and instrument labels; normally uppercase with deliberate tracking.

### Named Rules

**The Stamped Hierarchy Rule.** Barlow Archive owns uppercase identity, labels, and instrument numbers; Atkinson Field owns readable instructions, evidence, and actions. Do not swap their jobs.

## Layout

The page has a 320px minimum width and a centered 1520px maximum working area. The `screen-gutter` token controls the wide outer shell and the `sheet-inset` token controls the paper surface. The outer inset tightens to 15px at 1180px and 11px at 800px. Tight archival spacing uses `micro`, `tool-gap`, `frame-inset`, and `compact`; `section` separates major groups without making the artifact feel airy.

Above 1180px, the masthead is a three-part rail and the light table is a two-column grid: a fluid contact sheet plus a fixed 188px toolstrip. The comparison remains a two-column 8:5 pair with a slim gutter. Sheet heading, metadata, paired exposures, and evidence form one vertical record rather than independent cards.

At 1180px and below, the toolstrip moves beneath the sheet into three instrument columns plus a wider action group. At 800px and below, the masthead becomes one column, both exposures stack at full width, secondary scene copy is removed, metadata wraps, and evidence stacks. At 520px and below, route names collapse to lettered stamps, the unresolved numeral occupies the heading corner, the third instrument is omitted, tool actions become a two-by-two grid, and completion statistics stack. Never preserve side-by-side exposures by shrinking them below useful observation size.

## Elevation & Depth

Depth is physical and selective. The light table carries the broad ambient shadow; each dark photo frame has a short paper-contact shadow; the completion curtain and toast lift above the archive only when state requires it. Paper texture comes from fine inset rules and low-contrast gradients rather than extra nested surfaces.

### Shadow Vocabulary
- **Light-table lift** (`0 22px 55px rgb(0 10 8 / 45%)`): The complete paper-and-tool artifact above the blackout.
- **Contact-print edge** (`0 4px 11px rgb(43 32 17 / 30%)`): Each dark photographic frame against archive paper.
- **Curtain lift** (`0 28px 70px rgb(0 0 0 / 55%)`): The reconciled-sheet summary over the dimmed case.
- **Toast lift** (`0 10px 30px rgb(0 0 0 / 38%)`): Temporary feedback above the lower-right edge.

### Named Rules

**The Physical Stack Rule.** Shadows describe paper, print, or temporary overlay height. Resting labels, controls, and route stamps remain flat and bordered.

## Shapes

The system is overwhelmingly rectilinear: square contact sheets, photo frames, metadata rules, route stamps, and segmented controls evoke cut paper and instrument panels. One-pixel borders and registration lines do more work than fills. Action controls receive only a 2px practical radius; rounded cards and pills do not belong.

Circles are semantic exceptions. They are reserved for the inspection loupe, grease-pencil findings, reticles, dials, and round objects inside the documentary scenes. Their rarity makes observation states immediately recognizable.

## Components

### Archive Tool Buttons
- **Shape:** Compact instrument key with a practical 2px radius, a one-pixel green-gray border, and a 45px default target that compacts to 42px below 520px.
- **Default:** Dark lifted green with paper-light copy, a square brass keycap, and optional secondary seal count.
- **Hover:** Border changes to lamp brass, surface lifts one tone, and the control translates upward by 1px over 140ms ease-out.
- **Focus / Disabled:** A 3px inspection-focus outline with 3px offset is mandatory. Disabled tools use 42% opacity, retain their label, and do not move.

### Difficulty Control
- **Style:** A square, one-pixel segmented radio group with three equal compact labels.
- **Selected:** Lamp-brass fill and blackout text; selection is visible by both fill inversion and the checked radio state.
- **Focus:** The selected label receives the same 3px inspection-focus outline used by buttons and canvases.

### Expedition Route
- **Style:** Five lettered square stamps joined by hairline tracks. Labels use the label role and stay subordinate to the title.
- **State:** Current is brass with an inverted index, completed is faded cyan, available stops hover toward paper light, and locked stops retain a not-allowed cursor.
- **Compact:** Below 520px, names hide but letter stamps remain, preserving route position without horizontal crowding.

### Contact Sheet and Photo Frames
- **Contact sheet:** Archive paper, graphite copy, fine inset registration border, subtle paper gradient, and no corner radius.
- **Photo frame:** Near-black green surround, 8px image inset, 19px lower catalog edge, condensed captions, and a short contact shadow.
- **Comparison:** Both canvases share an 8:5 aspect ratio. At narrow widths they stack; they never become thumbnails or horizontal carousels.

### Instruments and Evidence
- **Readings:** Brass, tabular, condensed numerals with small uppercase labels and hairline separators.
- **Time pressure:** The timer label, number, and meter switch to grease red below one-quarter remaining; text and meter shape communicate the state together.
- **Evidence:** The newest finding is bold body copy; the field note is italic body copy separated by a vertical rule.

### Loupe and Observation Marks
- **Loupe:** A 52px circular inspection reticle with fine brass crosshairs appears over the same coordinates on both exposures.
- **Found:** Persistent double grease-pencil rings and numbered dots appear in both canvases.
- **Hint / Miss:** Hints add a dashed brass ring and three-second loupe placement; a false mark produces a temporary grease-red X and a status announcement.

### Curtain and Toast
- **Curtain:** A square archive-paper summary centered on a dark translucent case overlay, with a large condensed verdict, three tabular results, and one dark completion action.
- **Toast:** A compact blackout-green message with a brass border enters from the lower right over 180ms ease-out and never captures input.

### State and Accessibility Rules
- Every interactive control and canvas uses a visible focus outline; canvas labels explain arrow-key movement and marking.
- Pause darkens and desaturates both exposures and overlays an explicit paused message.
- Status changes are mirrored through polite live regions. Sound exposes `aria-pressed`, the current route exposes `aria-current`, and the curtain moves focus to its action.
- Under reduced motion, transitions and animations collapse to 0.01ms. Under increased contrast, paper, text, brass, and divider values strengthen without changing the composition.

## Do's and Don'ts

### Do:
- **Do** keep the paired documentary exposures as the dominant visual and interaction target.
- **Do** use brass for selection and instruments, cyan for archival completion, and grease red for evidence or urgency.
- **Do** preserve condensed uppercase labels, tabular readings, fine rules, and clipped square geometry.
- **Do** pair color states with numerals, text, rings, fills, or meter shape so meaning never depends on color alone.
- **Do** stack full-width exposures at 800px and below and preserve the lettered route at the smallest width.
- **Do** retain visible focus, live announcements, reduced-motion behavior, and the increased-contrast overrides.

### Don't:
- **Don't** turn the experience into a centered game card, decorative hero, or floating HUD.
- **Don't** introduce rounded pills, soft SaaS cards, glass effects, or generic white and gray surfaces.
- **Don't** shrink both exposures into untappable thumbnails to preserve a desktop composition.
- **Don't** use grease red as ambient decoration; its scarcity carries evidence and urgency.
- **Don't** hide progress, lock, pause, found, hint, or error state behind color alone.
