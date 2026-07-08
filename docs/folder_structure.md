# TravelOS Engineering Handbook: Folder Structure

This document details the project structure, folder mapping, and conventions for where new files must be placed.

---

## 1. Directory Tree & Roles

```
TravelOS/
├── app/                      # Expo Router File-based Routes & Screen Shells
│   ├── (tabs)/               # Tab-based main navigation entrypoints
│   ├── _layout.tsx           # App Root Layout (coordinates context providers)
│   ├── index.tsx             # App Entry (handles redirects)
│   └── onboarding.tsx        # High-motion welcome experience
├── assets/                   # Static resources
│   ├── fonts/                # Custom typeface resources
│   ├── images/               # Local WebP backgrounds, icons
│   └── animations/           # High-quality Lottie json files
├── components/               # UI Foundation Kit (Atomic Reusable Components)
│   ├── feedback/             # Skeleton loaders, custom activity indicator, progress indicators
│   ├── input/                # Custom buttons, custom text fields, select lists
│   ├── layout/               # Glassmorphic containers, safe views, sections headers
│   └── typography/           # Custom font styles matching typographic weights
├── features/                 # Domain-Specific Feature Folders (Self-contained logic)
│   ├── ai-planner/           # Itinerary builder elements, feature-scoped custom hooks
│   ├── currency/             # Exchange rates interface & quick calculations helper
│   ├── destination/          # Spot details, reviews, cards
│   ├── expenses/             # Ledger sheets, chart components
│   └── weather/              # Weather reports, location climate blocks
├── hooks/                    # Global React Hooks
├── providers/                # Top-level context wrappers (Theme, React Query, Safe Area)
├── services/                 # Hardware, SecureStore, API connections wrappers
├── repositories/             # Interface connecting Mock data/HTTP client to Domain objects
├── store/                    # Domain-focused micro-stores (Zustand)
├── theme/                    # Design system theme definitions, style providers, and hooks
├── constants/                # Project wide static configurations
├── utils/                    # Base mathematical calculations, string formatters
├── mocks/                    # Mock JSON files containing rich simulated database records
├── types/                    # Pure TypeScript type interfaces and declarations
└── docs/                     # Engineering design specifications and manuals
```

---

## 2. Component Structure Rules

### Reusable UI Kit vs. Feature Components
* **UI Kit (`components/`)**:
  - Components under this directory must be completely domain-agnostic.
  - They should never import anything from `features/`, `store/`, or `repositories/`.
  - They should take styling configurations (colors, fonts) dynamically via the theme provider.
* **Feature Components (`features/<domain>/components/`)**:
  - Components here are domain-aware (e.g., `DestinationReviewCard`, `ExpenseGraph`).
  - They can pull specific hooks, stores, and types related to their domain.
  - They compose atomic components from `components/` to build domain-specific views.

### Screen Components (`app/`)
* Files inside `app/` should act as thin shells.
  - They load root features, pass configuration variables, and hook screen layouts to Expo Router.
  - Keep logic in screen files to a minimum: delegate visual layout to features/components, state management to stores, and queries to custom hooks.
