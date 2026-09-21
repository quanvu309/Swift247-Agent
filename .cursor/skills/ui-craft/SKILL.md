---
name: ui-craft
description: UI polish for interfaces. Use when designing, building, or reviewing screens, components, motion, press states, popovers, tooltips, drawers, or toasts.
---

# UI craft

Brand, copy, and product-specific layout live in the product. This skill is how interfaces should feel in every product.

Unseen details compound. Make the obvious interaction correct before adding decoration.

## Should it move?

| How often users see it | Decision |
| --- | --- |
| 100+ times a day (keyboard, command palette) | No animation |
| Tens of times a day (hover, list nav) | Remove or cut hard |
| Occasional (modal, drawer, toast) | Short animation |
| Rare (onboarding, celebration) | Delight is allowed |

Never animate keyboard-initiated actions.

Every animation needs a purpose: spatial consistency, state, explanation, feedback, or avoiding a jump. "Looks cool" is not a purpose for something seen often.

## Motion

Entering or exiting uses ease-out (starts fast). On-screen movement uses ease-in-out. Hover or color uses ease. Constant motion (progress, marquee) uses linear.

Never use ease-in on UI. It delays the first frame, which is when the user is watching.

Prefer custom curves over built-in CSS easings:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

Durations:

| Element | Duration |
| --- | --- |
| Button press | 100-160ms |
| Tooltip, small popover | 125-200ms |
| Dropdown, select | 150-250ms |
| Modal, drawer | 200-500ms |

Keep ordinary UI under 300ms. Release is snappy (about 200ms ease-out). A deliberate hold (hold-to-delete) can be slow, then snap back fast.

Do not animate from `scale(0)`. Start near `scale(0.95)` plus opacity 0. Nothing appears from nothing.

Pressable controls use `transform: scale(0.97)` on `:active`.

Popovers scale from their trigger (`transform-origin` at the trigger). Modals stay centered.

Tooltips delay on first open. Once one is open, neighbors open instantly with no animation.

Use CSS transitions for UI that can be interrupted (toasts, toggles). Keyframes restart from zero. Prefer `transform` and `opacity` only. Do not animate layout properties (`width`, `height`, `margin`, `padding`).

`prefers-reduced-motion: reduce` keeps opacity and color, drops travel. Gate hover motion with `@media (hover: hover) and (pointer: fine)`.

## Components

Good defaults beat options. Handle edge cases quietly (timers pause when the tab is hidden, drag keeps pointer capture, extra touches are ignored).

Stagger list entrance 30-80ms per item. Do not block input while stagger runs.

## Review

When reviewing UI, output one table:

| Before | After | Why |
| --- | --- | --- |
| example | example | one line |

Check: `transition: all`, `scale(0)`, `ease-in`, popover origin center, animation on keyboard actions, UI longer than 300ms, hover without the pointer media query, keyframes on rapid UI, motion without reduced-motion.
