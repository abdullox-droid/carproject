# Design System Document: The Onyx Standard

## 1. Overview & Creative North Star: "The Kinetic Curator"
This design system is engineered to evoke the feeling of a high-end, private concierge service for the automotive world. Our Creative North Star, **"The Kinetic Curator,"** balances the heavy, immovable prestige of luxury (Onyx) with the fluid, high-velocity nature of modern mobility.

To break away from "template" layouts, we move beyond the rigid grid. We embrace **intentional asymmetry**—offsetting large display typography against vast negative space—and **tonal layering** to define hierarchy. The experience should feel like flipping through a premium editorial magazine: authoritative, quiet, and profoundly intentional.

---

## 2. Colors: Tonal Architecture
The palette is a study in shadow and light. We utilize a spectrum of blacks and slates to create a "solid" feel that anchors the user’s trust.

### The "No-Line" Rule
**Borders are a failure of hierarchy.** Designers are strictly prohibited from using 1px solid lines to section content. Boundaries must be defined through background shifts. For example, a `surface-container-low` section should sit directly on a `background` or `surface` canvas. The transition of tone is the only divider permitted.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of obsidian and frosted glass.
- **Base Layer:** `surface` (#0e0e0e)
- **Secondary Depth:** `surface-container-low` (#131313) for large grouping areas.
- **Interactive Depth:** `surface-container-highest` (#252626) for elevated cards or modals.
- **The "Glass & Gradient" Rule:** Floating elements (like navigation bars or action sheets) should utilize `surface_bright` at 70% opacity with a `20px` backdrop blur. Use a subtle linear gradient from `primary` (#c6c6c7) to `primary-container` (#454747) at a 45-degree angle for high-value CTAs to give them a metallic, silver-sheen "soul."

---

## 3. Typography: Editorial Authority
We pair the technical precision of **Inter** with the structural elegance of **Manrope** to create a sophisticated, modern dialogue.

- **Display (Manrope):** Use `display-lg` and `display-md` for hero headlines. These should often be left-aligned with significant "breathing room" (at least 64px) from the nearest element.
- **Headline (Manrope):** `headline-lg` through `headline-sm` are for section titles. Use low tracking (-2%) to make the type feel "solid" and compressed.
- **Body & Labels (Inter):** `body-lg` and `body-md` handle the functional data. In the Uzbekistan context, ensure `UZS` currency formatting is always rendered in `title-sm` (Inter) to maintain a technical, trustworthy appearance.

---

## 4. Elevation & Depth: Atmospheric Layering
Traditional drop shadows are too "digital." We use **Ambient Shadows** and **Tonal Stacking** to create a premium sense of weight.

- **The Layering Principle:** Instead of a shadow, place a `surface-container-lowest` (#000000) card on top of a `surface-container-high` (#1f2020) background. This "inverse lift" creates a deep, recessed luxury look.
- **Ambient Shadows:** When an element must float (e.g., a car selection modal), use a shadow color tinted with `on-surface` (#e7e5e4) at 5% opacity, with a blur radius of at least `40px`.
- **The Ghost Border Fallback:** If accessibility requires a stroke, use the `outline-variant` (#484848) at 15% opacity. It should be felt, not seen.

---

## 5. Components: The Premium Kit

### Buttons (The "Machined" Look)
- **Primary:** Background `primary` (#c6c6c7), Text `on-primary` (#3f4041). Use `ROUND_TWELVE` (0.75rem) corners. The feel should be like a brushed aluminum button.
- **Secondary:** Background `secondary-container`, Text `on-secondary-container`. No border.
- **Tertiary:** Text `primary`, no background. For low-priority navigation.

### Cards & Lists (The "Seamless" Feed)
- **Rule:** Forbid divider lines. Separate list items using `16px` of vertical white space or a subtle shift from `surface-container-low` to `surface-container-highest`.
- **Car Cards:** Use high-contrast imagery against `surface-container-lowest` (#000000). The car should feel like it's emerging from the shadows.

### Input Fields (The "Technical" Slate)
- **State:** Use `surface-variant` for the input container.
- **Focus:** Transition the "Ghost Border" from 15% opacity to 60% opacity of the `primary` token. Avoid heavy glow effects.

### Specialized Components: "The Uzbekistan Tier"
- **Currency Display:** A custom component for **UZS** that uses `title-lg` for the amount and `label-sm` for the "SO'M" suffix, vertically aligned to the top for an editorial look.
- **Vehicle Status Badge:** Uses `tertiary-container` with `on-tertiary-container` text for a subtle, silver-on-white high-end "tag" look.

---

## 6. Do’s and Don’ts

### Do:
- **Do** use `ROUND_TWELVE` (0.75rem) as the standard for all containers to maintain a "smooth" tactile feel.
- **Do** leverage "Extreme Contrast"—placing `tertiary` (#faf9f9) text directly on `background` (#0e0e0e) for key value propositions.
- **Do** allow for asymmetrical layouts where text blocks are offset to the left and imagery is cropped aggressively to the right.

### Don’t:
- **Don’t** use pure white (#FFFFFF) for body text; always use `on-surface` (#e7e5e4) to reduce eye strain in dark environments.
- **Don’t** use standard "Material Design" shadows. If it looks like a default shadow, it is too "cheap" for this system.
- **Don’t** use 1px dividers. If you feel the need to separate, use space or a tone-shift.