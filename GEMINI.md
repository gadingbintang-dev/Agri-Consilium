# Project Rules & Conventions

## Indonesian Language
- All user-facing text must be in Indonesian.
- Use professional yet modern tone.
- Technical terms (like 'm2', 'budget tier') should be localized contextually.

## Component Styling
- Use Vanilla Tailwind CSS.
- Prioritize high visual impact (gradients, glassmorphism, smooth transitions).
- Layout should be responsive (mobile-first).

## State and Persistence
- Use Zustand for all global state.
- Ensure data integrity when reading from persisted storage by implementing safety checks for undefined or legacy keys.
