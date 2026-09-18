---
name: Swift247 Agent System
description: Cargo check before pickup, using the existing shadcn tokens and official Swift247 marks
colors:
  background: "#ffffff"
  foreground: "#241028"
  card: "#ffffff"
  primary: "#5B1A63"
  primary-foreground: "#ffffff"
  secondary: "#F4EEF6"
  secondary-foreground: "#4A1552"
  muted: "#F6F2F7"
  muted-foreground: "#7A6880"
  accent: "#F4EEF6"
  accent-foreground: "#4A1552"
  destructive: "#E23C2C"
  border: "#EBE3EE"
  input: "#EBE3EE"
  ring: "#8E1F6E"
  sidebar: "#F8F3FA"
  brand-orange: "#F26522"
  brand-lavender: "#F6F1F8"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.45rem, 4vw, 3.65rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "0.375rem"
  md: "0.625rem"
  lg: "0.75rem"
  xl: "1.25rem"
spacing:
  section: "5rem"
  group: "1.5rem"
  stack: "1rem"
  tight: "0.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    height: "2.25rem"
    padding: "0 1rem"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    height: "2.25rem"
    padding: "0 1rem"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
---

# Design System: Swift247 Agent System

## Overview

**Creative North Star: "The pickup gate"**

SAS is a logistics ops product, not a marketing microsite. The visual system is the existing shadcn token set mapped onto Swift247 brand hex. Inter carries every heading and body line. Official marks stay in the sticky rail. Color is rare. Primary purple is the action and the identity, not a wash on every block.

This file documents the incumbent system in `src/index.css`, `tailwind.config.js`, and `src/components/ui`. It does not introduce a second palette, a second type family, or a second component kit.

**Key characteristics:**

- Semantic tokens first (`bg-background`, `bg-primary`, `text-muted-foreground`, `border-border`)
- Inter for UI. Geist Mono only for measurement and canvas labels
- Sticky desktop sidebar with official Swift247 marks
- Flat surfaces, 0.625rem radius, quiet borders
- Landing mode is Persuade. App chrome stays Operate

## Colors

The palette is Swift247 purple on a cool paper wash. Magenta is the focus ring. Orange is a scarce accent, not a third brand system.

### Primary

- **Swift purple** (`#5B1A63`, `--primary`): primary buttons, active nav, the one dark band if a landing closer needs it
- **Primary foreground** (`#ffffff`): text and icons on primary

### Secondary

- **Lilac wash** (`#F4EEF6`, `--secondary` / `--accent`): secondary buttons and hover fills
- **Secondary foreground** (`#4A1552`): text on that wash

### Neutral

- **Paper** (`#ffffff`, `--background` / `--card`)
- **Ink** (`#241028`, `--foreground`)
- **Muted text** (`#7A6880`, `--muted-foreground`)
- **Hairline** (`#EBE3EE`, `--border` / `--input`)
- **Sidebar paper** (`#F8F3FA`, `--sidebar`)

### Named rules

**The token rule.** Use Tailwind semantic colors. Do not use raw `bg-blue-500` or one-off hex in class names. Brand hex already lives in CSS variables.

**The one voice rule.** Primary purple is the action color. Do not paint three adjacent slabs in purple, magenta, and orange. Magenta is the ring. Orange is optional and scarce.

**The Inter rule.** Inter is the committed UI face. Detector `overused-font` findings for Inter are false positives here.

## Typography

**Display font:** Inter
**Body font:** Inter
**Label/mono font:** Geist Mono, only for canvas node labels and numeric/measurement strings

**Character:** Neutral ops type. Weight and size carry hierarchy. Tracking-heavy uppercase kickers are out.

### Hierarchy

- **Display** (600, clamp 2.45rem to 3.65rem, line-height 1.05): landing h1 only
- **Headline** (600, 1.875rem to 2.25rem): section h2
- **Title** (600, 1.125rem to 1.25rem): card and step titles
- **Body** (400, 1rem, leading-7, max ~45ch on landing intro): explanation copy
- **Muted body** (400, 0.875rem, leading-6): supporting copy
- **Label** (500, 0.875rem): buttons and inline actions

### Named rules

**The heading rule.** The heading carries the section. Do not put an eyebrow, kicker, or `01` costume above it unless the number is a real sequence the reader must follow.

**The measure rule.** Landing body copy stays in a readable measure. Do not stretch a paragraph across the full 1180px content width.

## Layout

App chrome is a sticky `h-svh` sidebar plus a sticky 4rem header. Landing content is full bleed inside `main` (`px-0 py-0` on `/`). Inner content maxes at 1180px.

Spacing uses Tailwind gap on flex and grid. No `space-y-*` or `space-x-*`. Vertical stacks are `flex flex-col gap-*`. Equal width and height use `size-*`.

Landing rhythm. Tight groups inside a card or step. Generous `py-16` / `py-20` between sections. More space above a heading than below it.

Desktop sidebar stays on screen while `/` scrolls (`sticky top-0 h-svh self-start`). Do not change that.

Narrow viewports. Single column. Hero illustration stacks under the copy. Primary CTA remains a Button, not a text link.

## Elevation and depth

Surfaces are flat at rest. Cards use `border-border` and `shadow-sm`. Do not add glow halos or zero-offset colored shadows.

Focus is `--ring` magenta at 2px. Do not invent a second focus treatment on the landing.

## Shapes

Radius token `--radius` is 0.625rem. Buttons and badges use that. Cards use `rounded-xl`. Do not restyle Button to a pill with `rounded-full`. className is for layout, not recoloring or re-rounding primitives.

## Components

Use the files in `src/components/ui`. Prefer variants over one-off classes.

### Buttons

- **Shape:** `rounded-md` (0.375rem to 0.625rem via the primitive)
- **Primary:** `variant="default"` (`bg-primary text-primary-foreground`)
- **Outline:** `variant="outline"`
- **Ghost:** header and icon controls
- **Icons:** no extra `size-*` on icons inside Button. The primitive sizes them
- **Links:** `asChild` with `Link` or `a`

### Cards

Full composition. `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`. Do not dump everything into `CardContent`. Do not nest Card in Card.

### Badge

Status labels (`Live`, `Paused`, `Draft`) use Badge variants. Not custom spans.

### Separator

Section and column rules use `Separator`. Not raw `hr` or `border-t` divs.

### Do not

- Invent a second component kit
- Recolor Card or Button with `className`
- Use `space-y-*`
- Restore a volume chart or KPI row on `/`
- Replace Inter or the official marks
