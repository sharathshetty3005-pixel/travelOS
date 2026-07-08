# TravelOS Engineering Handbook: Design System Tokens

This document details the Design Token values for TravelOS. These tokens must be consistently applied across both Light Mode and Dark Mode.

---

## 1. Color Palette (Obsidian & Gold Premium Theme)

The colors are selected to look premium, minimal, and luxurious.

### Dark Mode (Obsidian)
* **Background Primary**: `rgb(10, 10, 12)` (Obsidian)
* **Background Secondary**: `rgb(24, 24, 28)` (Deep Gray)
* **Background Tertiary**: `rgb(34, 34, 40)` (Slate Accent)
* **Text Primary**: `rgb(247, 247, 249)` (Pearl White)
* **Text Secondary**: `rgba(247, 247, 249, 0.6)` (Subtle Gray)
* **Accent Gold**: `rgb(212, 175, 55)` (Luxury Gold)
* **Accent Teal/Cyan**: `rgb(0, 242, 254)` (Electric Cyan for AI prompts)
* **Glass Backdrop**: `rgba(18, 18, 22, 0.7)`

### Light Mode (Alabaster)
* **Background Primary**: `rgb(247, 247, 249)` (Pearl White)
* **Background Secondary**: `rgb(255, 255, 255)` (White)
* **Background Tertiary**: `rgb(235, 235, 240)` (Cool Light Gray)
* **Text Primary**: `rgb(10, 10, 12)` (Obsidian)
* **Text Secondary**: `rgba(10, 10, 12, 0.6)` (Subtle Slate)
* **Accent Gold**: `rgb(197, 153, 24)` (Darker Luxury Gold for contrast)
* **Accent Teal/Cyan**: `rgb(0, 180, 190)` (Electric Teal for Light mode visibility)
* **Glass Backdrop**: `rgba(255, 255, 255, 0.7)`

---

## 2. Spacing Scale (in Density-Independent Pixels)

Spacing values are linear and must be strictly followed to maintain visual balance and structural alignment. Do not use random pixel offsets.

* **Micro**: `4` (Subtle padding, label gaps)
* **Tiny**: `8` (Padding inside badges, item list gaps)
* **Small**: `12` (Compact row spacing)
* **Medium**: `16` (Default container padding, grid gaps)
* **Large**: `20` (Spacious component margins)
* **XLarge**: `24` (Screen edges padding)
* **XXLarge**: `32` (Header margins, section divider gaps)
* **Huge**: `40`, `48`, `64`, `80`, `96` (Large screen section dividers, graphic assets gaps)

---

## 3. Border Radii

* **S**: `8` (Small badges, chips)
* **M**: `12` (Small cards, input text boxes)
* **L**: `16` (Default container panels, popups)
* **XL**: `20` (Larger dialog boards, maps marker sheets)
* **XXL**: `24`, `32` (Bottom sheets, splash screens panels)
* **Capsule**: `999` (Pill buttons, interactive chips)

---

## 4. Typography

Use system fonts dynamically matching the styling weights. Sizes are in points:

| Name | Size (pt) | Weight | Line Height (pt) | Intent / Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | 38 | Bold (700) | 46 | Splash Screen logo, big highlights |
| **Heading** | 28 | Semibold (600) | 34 | Primary screen titles |
| **Title** | 20 | Medium (500) | 26 | Card headers, section headlines |
| **Body** | 16 | Regular (400) | 22 | General reading, descriptions |
| **Label** | 14 | Semibold (600) | 18 | Interactive labels, actions |
| **Caption** | 12 | Regular (400) | 16 | Small timestamps, helper tags |

---

## 5. Motion & Easing Constants

All animations built using React Native Reanimated must feel soft, snappy, and natural.

### Durations
* **Fast**: `150ms` (Hover states, toggle button switch)
* **Medium**: `300ms` (Screen transitions, expand details panels)
* **Slow**: `600ms` (Cinematic splash fades, onboarding slide changes)

### Springs (Reanimated Spring Configurations)
* **Default Snappy**: `{ mass: 1, damping: 15, stiffness: 120 }` (Interactive cards, list shifts)
* **Soft Bounce**: `{ mass: 1, damping: 20, stiffness: 90 }` (Popups, onboarding slides, main CTA)
* **Slow Smooth**: `{ mass: 1.5, damping: 26, stiffness: 70 }` (Splash transitions, backdrop fades)
