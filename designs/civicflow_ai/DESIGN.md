---
name: CivicFlow AI
colors:
  surface: '#f5fbf5'
  surface-dim: '#d5dcd6'
  surface-bright: '#f5fbf5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff5ef'
  surface-container: '#e9efe9'
  surface-container-high: '#e4eae4'
  surface-container-highest: '#dee4de'
  on-surface: '#171d19'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#2c322e'
  inverse-on-surface: '#ecf2ec'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#9b3e3b'
  on-tertiary: '#ffffff'
  tertiary-container: '#ba5551'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ae'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#7f2928'
  background: '#f5fbf5'
  on-background: '#171d19'
  surface-variant: '#dee4de'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  gutter: 24px
  margin: 32px
---

## Brand & Style

The design system for this product is built on the pillars of transparency, efficiency, and institutional trust. It targets government officials, urban planners, and civic tech developers who require a platform that feels both cutting-edge and reliably stable. 

The aesthetic is a fusion of **Modern Minimalism** and **Glassmorphism**. It utilizes a clean, "hackathon-winning" layout that prioritizes data density without sacrificing legibility. High-trust is established through a systematic application of whitespace, precise alignment, and subtle translucent layers that suggest a modern, open-source-inspired interface. The emotional response should be one of clarity and proactive governance—transforming complex civic data into actionable flow.

## Colors

The color palette is anchored by **Emerald Green (600)**, symbolizing growth, approval, and active "go" states. This is contrasted against **Deep Slate (900/800)** for primary typography and structural headers, providing a grounded, professional foundation.

The background uses a crisp **Slate-50**, which serves as the canvas for glassmorphic surfaces (White @ 90% opacity with backdrop blurring). Status colors are functionally mapped to urgency:
- **Critical:** Rose-600 for immediate blockers or high-priority alerts.
- **High:** Amber-600 for warnings or attention-required items.
- **Medium/Low:** Sky-600 or Slate-600 for informational and secondary data points.

## Typography

This design system utilizes **Inter** exclusively to achieve a systematic, utilitarian aesthetic. The hierarchy is defined by tight tracking in large headlines and generous leading in body text to ensure maximum readability for long-form civic reports. 

Use `label-sm` with uppercase styling for secondary metadata and table headers to create a clear visual distinction from interactive body text. Display sizes should always use a slight negative letter spacing to maintain a "tight," professional feel on dashboard hero sections.

## Layout & Spacing

The layout follows a **12-column fluid grid** for dashboard views and a **fixed-width centered container (1280px)** for documentation or report pages. Spacing is strictly based on a **4px baseline grid**, ensuring all components align perfectly with the "developer-centric" aesthetic.

- **Desktop:** 32px margins with 24px gutters.
- **Tablet:** 24px margins with 16px gutters.
- **Mobile:** 16px margins with 12px gutters.

Large dashboard panels should utilize `2xl` (48px) padding to evoke a sense of "premium space," while data-heavy tables should drop to `sm` (8px) internal cell padding for high information density.

## Elevation & Depth

Depth is primarily achieved through **Tonal Layering** and **Glassmorphism** rather than heavy shadows.

1.  **Base Layer:** `slate-50` solid background.
2.  **Surface Layer (Cards/Panels):** White with 90% opacity, a `1px` stroke in `slate-200`, and a `backdrop-filter: blur(12px)`.
3.  **Floating Layer (Modals/Popovers):** Pure white with a subtle, ultra-diffused shadow (`0 20px 25px -5px rgb(0 0 0 / 0.05)`).
4.  **Interactive States:** Elements should feel "raised" on hover using a subtle increase in border-color contrast rather than shadow depth, maintaining the minimalist profile.

## Shapes

The shape language is **Soft (0.25rem)**, leaning into a more precise, professional aesthetic common in enterprise SaaS.

- **Small Components (Buttons, Inputs):** 4px (0.25rem) radius.
- **Medium Components (Cards, Modals):** 8px (0.5rem) radius.
- **Large Sections (Sidebars, Hero Areas):** 12px (0.75rem) radius.

This subtle rounding prevents the UI from feeling "sharp" or aggressive while maintaining a serious, structured appearance compared to more consumer-focused "pill-shaped" designs.

## Components

### Buttons
- **Primary:** Emerald-600 background, white text. No gradient. 4px border radius.
- **Secondary:** White/90 glass background, 1px Slate-200 border, Slate-900 text.
- **Ghost:** Transparent background, Emerald-600 text, becomes Slate-100 on hover.

### Form Inputs
- **Default:** White background, 1px Slate-200 border.
- **Focus:** 1px Emerald-600 border with a 3px Emerald-100 outer glow (ring).
- **Labels:** `label-md` in Slate-700, positioned above the input field.

### Chips & Badges
- Used for status tagging. High-contrast text on a low-contrast version of the status color (e.g., Critical uses Rose-600 text on Rose-50 background).

### Cards
- Standard containers use the Glassmorphism effect: White/90, 1px Slate-200 border, and 12px blur. Headers within cards should have a 1px Slate-100 bottom border.

### Icons
- Use **Lucide-react** style: 2px stroke width, consistent 20px or 24px sizing. Icons should be Slate-500 for neutral states and Primary-600 for active navigation items.

### Data Tables
- Header row: `slate-50` background, `label-sm` text style.
- Rows: White background, 1px `slate-100` bottom border, `body-sm` text.