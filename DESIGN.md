# Design System: MERN TypeScript Kanban Board
**Project ID:** 2874496792950004666

## 1. Visual Theme & Atmosphere
The "Kinetic Board" design system is built for high-performance productivity, targeting professionals who require a frictionless interface for complex task management. The brand personality is **disciplined, architectural, and reliable**. 

The overall style is **Corporate / Modern** with a focus on **functional minimalism**. It prioritizes information density without sacrificing clarity. The UI evokes a sense of "calm control" through the use of balanced whitespace and a restrained color application. The experience should feel like a premium physical workspace—everything has a designated place, and the tools never obstruct the work itself.

## 2. Color Palette & Roles
The palette is anchored by a sophisticated range of Slate Grays to establish structure and hierarchy.

*   **Primary Indigo (#4F46E5):** Used exclusively for high-intent actions, such as creating new tasks or confirming updates.
*   **Surface Lavender-Tinted White (#FCF8FF):** The main application background, providing a clean, non-sterile canvas.
*   **Pure Card White (#FFFFFF):** Used for individual Kanban columns and cards to draw the eye toward active content.
*   **Subtle Border/Outline (#777587):** Used for structural boundaries and secondary UI elements.
*   **Success Emerald (#BA1A1A - Note: Usually Emerald is green, but theme shows Error as Red):** 
    *   *Correction based on theme details:* 
    *   **Error Red (#BA1A1A):** High-visibility alerts and destructive actions.
    *   **Semantic Accents:** Amber is used for 'In Progress' to suggest caution/active movement, while Emerald signifies 'Done' as a rewarding conclusion (Note: these are described in the style guide but specific hexes for them in the `namedColors` are tertiary/secondary variations).

## 3. Typography Rules
The system utilizes **Inter** exclusively for its exceptional legibility in data-rich environments.

*   **Headlines (Inter, 700 weight, -0.02em letter-spacing):** Tighter letter-spacing and heavier weights anchor board columns and page titles.
*   **Body Text (Inter, 400 weight):** Optimized for reading task descriptions with standard tracking and a comfortable line height (24px).
*   **Labels (Inter, 600 weight, 0.05em letter-spacing):** Rendered in smaller sizes with increased tracking to differentiate metadata (tags, dates) from actionable task names.

## 4. Component Stylings
*   **Buttons:**
    *   *Primary:* Solid Indigo-600 background, White text. No gradients.
    *   *Secondary:* Transparent background, Slate-600 border and text.
    *   *Icon Buttons:* Ghost style (no border/background) unless hovered.
*   **Task Cards:**
    *   *Shape:* Generously rounded corners (8px / 0.5rem).
    *   *Background:* Pure White.
    *   *Depth:* "Soft Float" shadow (0px 1px 3px rgba(0,0,0,0.05)) for resting state; active/dragging cards receive a more pronounced shadow and a 2-degree tilt.
    *   *Content:* Bolded Task Title and a metadata footer (due date, assignee avatar).
*   **Kanban Columns:**
    *   *Layout:* Fixed-width (320px) to maintain predictability.
    *   *Header:* Sticky header with column name and a count badge.
    *   *Spacing:* 24px (1.5rem) gutters between columns.
*   **Status Chips:**
    *   *Shape:* Full "Pill" radius (9999px).
    *   *Style:* Light-tinted background (10% opacity of the category color) with high-contrast text.

## 5. Layout Principles
The system employs an **8px (0.5rem) base unit** governing all spacing to ensure mathematical rhythm.

*   **Responsiveness:**
    *   *Desktop:* Full horizontal scroll for Kanban columns.
    *   *Tablet:* 2-column view with side-scrolling.
    *   *Mobile:* Single-column view with a vertical stack or "Column Switcher" tab bar to maintain the native-app feel.
*   **Whitespace:** Generous page margins (2rem) and card padding (1rem) prevent visual overcrowding in dense task lists.
