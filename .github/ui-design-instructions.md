# UI Design System Instructions

This document defines the design standards, component patterns, and implementation guidelines for the React Important Questions application. All UI work must follow these standards to ensure consistency, accessibility, and maintainability.

---

## 1. Design Tokens

### 1.1 Color Palette

#### Primary Colors (Brand)
```css
/* Defined in tailwind.config.js */
primary-50:  #f0f9ff
primary-100: #e0f2fe
primary-200: #bae6fd
primary-300: #7dd3fc
primary-400: #38bdf8
primary-500: #0ea5e9  /* Main brand color */
primary-600: #0284c7  /* Primary actions, hover states */
primary-700: #0369a1
primary-800: #075985
primary-900: #0c4a6e
primary-950: #082f49
```

#### Semantic Colors
```css
/* Success */
success-50:  #f0fdf4
success-500: #22c55e
success-600: #16a34a

/* Warning */
warning-50:  #fefce8
warning-500: #eab308
warning-600: #ca8a04

/* Danger/Error */
danger-50:  #fef2f2
danger-500: #ef4444
danger-600: #dc2626

/* Info */
info-50:  #eff6ff
info-500: #3b82f6
info-600: #2563eb
```

#### Neutral Colors (Light Mode)
```css
gray-50:  #f9fafb   /* Page backgrounds */
gray-100: #f3f4f6   /* Card backgrounds, subtle borders */
gray-200: #e5e7eb   /* Borders, dividers */
gray-300: #d1d5db   /* Input borders, disabled states */
gray-400: #9ca3af   /* Placeholder text, icons */
gray-500: #6b7280   /* Helper text, secondary labels */
gray-600: #4b5563   /* Body text */
gray-700: #374151   /* Headings, primary text */
gray-800: #1f2937   /* High emphasis text */
gray-900: #111827   /* Maximum emphasis */
```

#### Neutral Colors (Dark Mode)
```css
dark-bg-primary:   #111827  /* gray-900 - Page backgrounds */
dark-bg-secondary: #1f2937  /* gray-800 - Card backgrounds */
dark-bg-tertiary:  #374151  /* gray-700 - Elevated surfaces */
dark-border:       #374151  /* gray-700 - Borders */
dark-text-primary: #f9fafb  /* gray-50 - Primary text */
dark-text-secondary: #d1d5db /* gray-300 - Secondary text */
dark-text-muted:   #9ca3af  /* gray-400 - Muted text */
```

### 1.2 Spacing Scale
```css
/* Base unit: 4px (0.25rem) */
space-0:   0
space-1:   0.25rem  /* 4px */
space-2:   0.5rem   /* 8px */
space-3:   0.75rem  /* 12px */
space-4:   1rem     /* 16px */
space-5:   1.25rem  /* 20px */
space-6:   1.5rem   /* 24px */
space-8:   2rem     /* 32px */
space-10:  2.5rem   /* 40px */
space-12:  3rem     /* 48px */
space-16:  4rem     /* 64px */
space-20:  5rem     /* 80px */
space-24:  6rem     /* 96px */
```

### 1.3 Typography Scale
```css
/* Font Families */
font-sans: 'Inter', system-ui, sans-serif
font-mono: 'JetBrains Mono', 'Fira Code', monospace

/* Font Sizes */
text-xs:   0.75rem   /* 12px - Captions, labels */
text-sm:   0.875rem  /* 14px - Body small, form labels */
text-base: 1rem      /* 16px - Body text */
text-lg:   1.125rem  /* 18px - Large body */
text-xl:   1.25rem   /* 20px - Subheadings */
text-2xl:  1.5rem    /* 24px - Section headings */
text-3xl:  1.875rem  /* 30px - Page titles */
text-4xl:  2.25rem   /* 36px - Hero titles */
text-5xl:  3rem      /* 48px - Large hero */
text-6xl:  3.75rem   /* 60px - Extra large */

/* Font Weights */
font-normal:  400
font-medium:  500
font-semibold: 600
font-bold:    700

/* Line Heights */
leading-tight:   1.25  /* Headings */
leading-snug:    1.375
leading-normal:  1.5   /* Body text */
leading-relaxed: 1.625
```

### 1.4 Border Radius
```css
rounded-none:  0
rounded-sm:    0.125rem  /* 2px */
rounded:       0.25rem   /* 4px - Inputs, buttons */
rounded-md:    0.375rem  /* 6px - Cards, dropdowns */
rounded-lg:    0.5rem    /* 8px - Primary cards, modals */
rounded-xl:    0.75rem   /* 12px - Feature cards */
rounded-2xl:   1rem      /* 16px - Hero sections */
rounded-full:  9999px    /* Badges, pills, avatars */
```

### 1.5 Shadows
```css
shadow-sm:   0 1px 2px 0 rgb(0 0 0 / 0.05)
shadow:      0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
shadow-md:   0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
shadow-lg:   0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
shadow-xl:   0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
```

### 1.6 Transitions
```css
/* Duration */
duration-75:   75ms
duration-100:  100ms
duration-150:  150ms
duration-200:  200ms  /* Default for most interactions */
duration-300:  300ms  /* Modals, drawers */
duration-500:  500ms  /* Page transitions */

/* Easing */
ease-linear:   linear
ease-in:       cubic-bezier(0.4, 0, 1, 1)
ease-out:      cubic-bezier(0, 0, 0.2, 1)  /* Default */
ease-in-out:   cubic-bezier(0.4, 0, 0.2, 1)
```

### 1.7 Breakpoints
```css
sm:  640px   /* Mobile landscape / small tablet */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

---

## 2. Component Standards

### 2.1 Base Component Structure

All components must follow this pattern:

```tsx
// ComponentName.tsx
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils'; // Class name utility

interface ComponentNameProps extends HTMLAttributes<HTMLElement> {
  // Component-specific props
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const ComponentName = forwardRef<HTMLElement, ComponentNameProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn(
          'base-styles',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </element>
    );
  }
);

ComponentName.displayName = 'ComponentName';
```

### 2.2 Required Props for All Components

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `className` | `string` | No | Additional CSS classes |
| `children` | `ReactNode` | Yes (usually) | Component content |
| `...props` | `HTMLAttributes` | No | Spread remaining HTML attributes |

### 2.3 Variant & Size Patterns

Use consistent naming across all components:

```tsx
// Variants
type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'destructive';

// Sizes
type Size = 'sm' | 'md' | 'lg' | 'icon'; // icon = square (e.g., 40x40px)
```

### 2.4 Component Inventory

#### Buttons (`Button.tsx`)
```tsx
// Variants: primary, secondary, outline, ghost, danger, destructive
// Sizes: sm, md, lg, icon
// States: default, hover, focus, active, disabled, loading
```

#### Cards (`Card.tsx`)
```tsx
// Padding: none, sm, md, lg
// Hover: boolean (elevation change)
// Sub-components: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
```

#### Badges (`Badge.tsx`)
```tsx
// Variants: default, success, warning, danger, info, outline
// Sizes: sm, md, lg
// Specialized: DifficultyBadge, StatusBadge, TopicBadge
```

#### Form Inputs (`Input.tsx`, `Textarea.tsx`, `Select.tsx`)
```tsx
// Required: label, error, helperText
// States: default, focus, error, disabled
// Accessibility: aria-invalid, aria-describedby, proper label association
```

#### Dialogs (`Dialog.tsx`, `DeleteConfirmationDialog.tsx`)
```tsx
// Native <dialog> element
// Focus trap, escape key, backdrop click
// Focus restoration on close
// Sub-components: DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger
```

#### Loading States (`LoadingSpinner.tsx`)
```tsx
// Sizes: sm, md, lg
// Variants: spinner, overlay, page-loader
// Accessibility: role="status", aria-live="polite", sr-only label
```

---

## 3. Layout Patterns

### 3.1 Page Structure

```tsx
// Public Pages
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  <PublicLayout>
    <main className="lg:pl-64"> {/* Account for fixed sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page content */}
      </div>
    </main>
  </PublicLayout>
</div>

// Admin Pages
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  <AdminLayout>
    <main className="lg:pl-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page content */}
      </div>
    </main>
  </AdminLayout>
</div>
```

### 3.2 Container Widths

```tsx
// Full width with padding
<div className="px-4 sm:px-6 lg:px-8">

// Constrained content width
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Narrow content (forms, articles)
<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

// Extra narrow (auth forms)
<div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
```

### 3.3 Grid Systems

```tsx
// Responsive grid - 1/2/3 columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

// Auto-fit grid (cards)
<div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">

// Sidebar + content
<div className="grid lg:grid-cols-[260px_1fr] gap-8">

// Equal columns
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
```

### 3.4 Section Spacing

```tsx
// Standard section
<section className="py-12 sm:py-16 lg:py-20">

// Hero section
<section className="py-16 sm:py-24 lg:py-32">

// Compact section
<section className="py-8 sm:py-12">
```

---

## 4. Accessibility Standards (WCAG 2.1 AA)

### 4.1 Color Contrast
- **Normal text**: 4.5:1 minimum
- **Large text** (18px+ bold, 24px+): 3:1 minimum
- **UI components** (borders, icons): 3:1 minimum
- **Focus indicators**: 3:1 minimum against adjacent colors

### 4.2 Focus Management
```tsx
// Visible focus styles (defined in globals.css)
:focus-visible {
  @apply outline-none ring-2 ring-primary-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900;
}

// Skip links for keyboard navigation
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary-600 text-white rounded">
  Skip to main content
</a>
```

### 4.3 Semantic HTML
```tsx
// Page structure
<header>  // Site header
<nav>     // Navigation
<main>    // Main content (one per page)
<section> // Thematic grouping with aria-labelledby
<article> // Self-contained content
<aside>   // Complementary content
<footer>  // Footer

// Headings - proper hierarchy
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
```

### 4.4 Form Accessibility
```tsx
// Labels MUST be associated with inputs
<label htmlFor="email">Email</label>
<input id="email" ... />

// Error messages
<input aria-invalid="true" aria-describedby="email-error" ... />
<p id="email-error" role="alert">Error message</p>

// Required fields
<label>Email <span className="text-red-500" aria-hidden="true">*</span></label>
<input required aria-required="true" ... />
```

### 4.5 ARIA Patterns

#### Dialog/Modal
```tsx
<dialog role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Dialog Title</h2>
  <button data-dialog-close>Close</button>
</dialog>
```

#### Tabs
```tsx
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel-1">Tab 1</button>
  <button role="tab" aria-selected="false" aria-controls="panel-2">Tab 2</button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">Content</div>
```

#### Tooltips
```tsx
<button aria-describedby="tooltip-id">Hover me</button>
<div id="tooltip-id" role="tooltip">Tooltip content</div>
```

### 4.6 Screen Reader Support
```tsx
// Hidden visually, available to screen readers
<span className="sr-only">Loading...</span>

// Decorative images
<img src="icon.svg" alt="" aria-hidden="true" />

// Meaningful images
<img src="chart.png" alt="Bar chart showing 40% increase in Q3" />

// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">Status updated</div>
```

---

## 5. Dark Mode Implementation

### 5.1 Strategy
- **Class-based**: `dark` class on `<html>` element
- **CSS variables** for colors (preferred) or Tailwind `dark:` variants
- **System preference** detection with manual toggle
- **Persistence** via localStorage

### 5.2 Implementation Pattern
```tsx
// In component - use dark: variants
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  <p className="text-gray-600 dark:text-gray-400">Secondary text</p>
  <div className="border-gray-200 dark:border-gray-700">Border</div>
</div>

// Avoid arbitrary values - use design tokens
// ❌ bg-[#1a1a1a]
// ✅ dark:bg-gray-900
```

### 5.3 Images & Media
```tsx
// Use CSS filters for simple inversions
<img className="dark:invert dark:contrast-125" src="logo.svg" alt="" />

// Or provide dark-specific images
<picture>
  <source srcSet="logo-dark.svg" media="(prefers-color-scheme: dark)" />
  <img src="logo-light.svg" alt="Logo" />
</picture>
```

---

## 6. Responsive Design Patterns

### 6.1 Mobile-First Approach
```tsx
// Base styles for mobile
<div className="p-4">

// Tablet and up
<div className="p-4 md:p-6">

// Desktop and up
<div className="p-4 md:p-6 lg:p-8">
```

### 6.2 Common Breakpoints Usage
```tsx
// Typography
<h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">

// Spacing
<section className="py-12 sm:py-16 lg:py-20">

// Layout
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

// Visibility
<div className="hidden lg:block">Desktop only</div>
<div className="lg:hidden">Mobile only</div>

// Flex direction
<div className="flex flex-col md:flex-row">
```

### 6.3 Touch Targets
- Minimum 44x44px (11x11 units) for interactive elements
- Use `min-h-[44px] min-w-[44px]` or adequate padding
- Adequate spacing between touch targets (8px minimum)

---

## 7. Animation & Transition Standards

### 7.1 Allowed Animations
```tsx
// Fade in/out
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
.animate-fade-out { animation: fadeOut 0.15s ease-in; }

// Slide up/down
.animate-slide-up { animation: slideUp 0.3s ease-out; }
.animate-slide-down { animation: slideDown 0.2s ease-in; }

// Scale
.animate-zoom-in { animation: zoomIn 0.2s ease-out; }

// Spin (loading only)
.animate-spin { animation: spin 1s linear infinite; }

// Pulse (skeleton loading)
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
```

### 7.2 Transition Properties
```tsx
// Standard transitions
transition-colors        // Color changes
transition-shadow        // Shadow changes
transition-transform     // Transform changes
transition-opacity       // Opacity changes
transition-all           // Avoid - be specific

// Duration
duration-150  // Fast (hover)
duration-200  // Standard
duration-300  // Modals, drawers
```

### 7.3 Reduced Motion
```tsx
// Respect prefers-reduced-motion
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 7.4 Animation Library - Framer Motion (Recommended)
For complex animations, use **Framer Motion** (install: `npm install framer-motion`):

```tsx
import { motion, AnimatePresence } from 'framer-motion';

// Page transitions
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
</AnimatePresence>

// Staggered list animations
<motion.ul>
  {items.map((item, index) => (
    <motion.li
      key={item.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      {item.name}
    </motion.li>
  ))}
</motion.ul>

// Hover/tap animations
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="..."
>
  Click me
</motion.button>

// Layout animations (shared layout)
<motion.div layout className="...">
  {content}
</motion.div>

// Presence animations (enter/exit)
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      Modal content
    </motion.div>
  )}
</AnimatePresence>
```

### 7.5 CSS-Only Animations (Tailwind)
For simple animations, prefer Tailwind utilities:

```tsx
// Fade in
<div className="animate-fade-in">Content</div>

// Slide up on enter
<div className="animate-slide-up">Content</div>

// Scale on hover
<button className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
  Button
</button>

// Shimmer loading
<div className="animate-pulse bg-gray-200 dark:bg-gray-700">...</div>

// Spin loader
<svg className="animate-spin h-8 w-8">...</svg>

// Bounce (use sparingly)
<div className="animate-bounce">...</div>

// Ping (for notifications)
<div className="animate-ping">...</div>
```

### 7.6 Animation Tokens (Add to tailwind.config.js)
```js
// tailwind.config.js
theme: {
  extend: {
    animation: {
      'fade-in': 'fadeIn 0.2s ease-out',
      'fade-out': 'fadeOut 0.15s ease-in',
      'slide-up': 'slideUp 0.3s ease-out',
      'slide-down': 'slideDown 0.2s ease-in',
      'slide-left': 'slideLeft 0.3s ease-out',
      'slide-right': 'slideRight 0.3s ease-out',
      'zoom-in': 'zoomIn 0.2s ease-out',
      'zoom-out': 'zoomOut 0.15s ease-in',
      'shimmer': 'shimmer 2s infinite',
      'spin-slow': 'spin 3s linear infinite',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      fadeOut: {
        '0%': { opacity: '1' },
        '100%': { opacity: '0' },
      },
      slideUp: {
        '0%': { opacity: '0', transform: 'translateY(10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      slideDown: {
        '0%': { opacity: '1', transform: 'translateY(0)' },
        '100%': { opacity: '0', transform: 'translateY(10px)' },
      },
      slideLeft: {
        '0%': { opacity: '0', transform: 'translateX(10px)' },
        '100%': { opacity: '1', transform: 'translateX(0)' },
      },
      slideRight: {
        '0%': { opacity: '0', transform: 'translateX(-10px)' },
        '100%': { opacity: '1', transform: 'translateX(0)' },
      },
      zoomIn: {
        '0%': { opacity: '0', transform: 'scale(0.95)' },
        '100%': { opacity: '1', transform: 'scale(1)' },
      },
      zoomOut: {
        '0%': { opacity: '1', transform: 'scale(1)' },
        '100%': { opacity: '0', transform: 'scale(0.95)' },
      },
      shimmer: {
        '0%': { backgroundPosition: '-200% 0' },
        '100%': { backgroundPosition: '200% 0' },
      },
    },
  },
}
```

### 7.7 Component Animation Patterns

#### Button Interactions
```tsx
// Primary button with subtle press animation
<button className="
  transition-all duration-150 ease-out
  hover:shadow-md hover:-translate-y-0.5
  active:scale-[0.98] active:shadow-sm
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
">
  Button
</button>

// Icon button with rotation
<button className="
  transition-transform duration-200
  hover:rotate-90
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
">
  <Icon />
</button>
```

#### Card Hover Effects
```tsx
// Elevated card on hover
<div className="
  transition-all duration-300 ease-out
  hover:shadow-xl hover:-translate-y-1
  hover:border-primary-200 dark:hover:border-primary-800
">
  <Card>Content</Card>
</div>

// Border glow on hover
<div className="
  transition-all duration-300
  hover:ring-2 hover:ring-primary-500/20
  hover:border-transparent
">
  <Card>Content</Card>
</div>
```

#### Input Focus Animations
```tsx
// Input with label float animation
<div className="relative">
  <input className="
    peer transition-all duration-200
    placeholder-transparent
    focus:placeholder:text-gray-400
    focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
  " placeholder=" " />
  <label className="
    absolute left-4 top-1/2 -translate-y-1/2 text-gray-500
    transition-all duration-200 pointer-events-none
    peer-focus:-translate-y-6 peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600
    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
  ">
    Label
  </label>
</div>
```

#### List Item Animations
```tsx
// Staggered entrance
{items.map((item, index) => (
  <motion.li
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
  >
    {item.content}
  </motion.li>
))}

// Slide in from side (for sidebar, drawers)
<motion.aside
  initial={{ x: -300 }}
  animate={{ x: 0 }}
  exit={{ x: -300 }}
  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
>
  Sidebar content
</motion.aside>
```

#### Modal/Dialog Animations
```tsx
// Backdrop fade + content scale
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <DialogContent>...</DialogContent>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

#### Toast/Notification Animations
```tsx
// Slide in from right, fade out
<motion.div
  initial={{ x: 400, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: 400, opacity: 0 }}
  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
  className="fixed bottom-4 right-4 z-50"
>
  <Toast>Message</Toast>
</motion.div>
```

#### Page Transitions
```tsx
// In layout or router outlet
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className="min-h-[calc(100vh-200px)]"
  >
    <Outlet />
  </motion.div>
</AnimatePresence>
```

#### Skeleton Loading Shimmer
```tsx
// Enhanced skeleton with shimmer
<div className="
  relative overflow-hidden bg-gray-200 dark:bg-gray-700
  before:absolute before:inset-0 before:-translate-x-full
  before:animate-shimmer before:bg-gradient-to-r
  before:from-transparent before:via-white/50 before:to-transparent
  dark:before:via-white/10
">
  {/* Skeleton content */}
</div>
```

---

## 8. State Patterns

### 8.1 Loading States
```tsx
// Skeleton loaders (preferred for content)
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
</div>

// Spinner for actions
<Button isLoading>Save</Button>

// Page loader
<PageLoader label="Loading questions..." />
```

### 8.2 Empty States
```tsx
<div className="text-center py-12">
  <svg className="mx-auto h-12 w-12 text-gray-400" ... />
  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
    No questions found
  </h3>
  <p className="mt-2 text-gray-500 dark:text-gray-400">
    Get started by creating your first question.
  </p>
  <Button className="mt-6" onClick={handleCreate}>Create Question</Button>
</div>
```

### 8.3 Error States
```tsx
<div className="text-center py-12">
  <svg className="mx-auto h-12 w-12 text-red-500" ... />
  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
    Something went wrong
  </h3>
  <p className="mt-2 text-gray-500 dark:text-gray-400">
    {errorMessage}
  </p>
  <Button variant="outline" className="mt-6" onClick={handleRetry}>
    Try Again
  </Button>
</div>
```

### 8.4 Success/Toast Notifications
```tsx
// Use a toast system (not implemented yet - use inline for now)
<div className="fixed bottom-4 right-4 z-50" role="status" aria-live="polite">
  <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
    <svg className="h-5 w-5" ... />
    <span>Question saved successfully</span>
  </div>
</div>
```

---

## 9. Code Quality Standards

### 9.1 TypeScript
```tsx
// Strict types for props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

// Avoid any
// ❌ const handleClick = (e: any) => {}
// ✅ const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {}

// Use proper event types
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); ... }}
```

### 9.2 Component Composition
```tsx
// Prefer composition over complex props
// ❌ <Card title="Title" description="Desc" action={<Button />} />
// ✅
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Desc</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### 9.3 Class Name Utility
```tsx
// Use cn() utility for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  variant === 'primary' && 'primary-classes',
  className
)} />
```

---

## 10. File Organization

### 10.1 Component Structure
```
src/components/ui/
├── Button.tsx
├── Button.stories.tsx      // Storybook (if used)
├── Button.test.tsx         // Tests
├── Card.tsx
├── Card.tsx                // Sub-components in same file
├── Badge.tsx
├── Input.tsx
├── Textarea.tsx
├── Select.tsx
├── Dialog.tsx              // All dialog sub-components
├── LoadingSpinner.tsx
├── QuestionCard.tsx
├── DeleteConfirmationDialog.tsx
├── ErrorBoundary.tsx
├── Progress.tsx
└── index.ts                // Barrel export
```

### 10.2 Naming Conventions
- **Files**: PascalCase (`Button.tsx`, `QuestionCard.tsx`)
- **Components**: PascalCase (`Button`, `QuestionCard`)
- **Props interfaces**: `{ComponentName}Props` (`ButtonProps`)
- **Types**: PascalCase (`Variant`, `Size`)
- **CSS classes**: kebab-case (via Tailwind)
- **Hooks**: camelCase with `use` prefix (`useTheme`, `useAuth`)

---

## 11. Implementation Checklist

### For New Components
- [ ] Follows base component structure (forwardRef, displayName)
- [ ] Includes `className` and `...props` spread
- [ ] Supports dark mode via `dark:` variants
- [ ] Has proper TypeScript types
- [ ] Includes accessibility attributes (aria-*, role)
- [ ] Has focus-visible styles
- [ ] Supports all required states (hover, focus, disabled, loading)
- [ ] Uses design tokens (no arbitrary values)
- [ ] Responsive (mobile-first)
- [ ] Exported from `index.ts`

### For Pages
- [ ] Uses correct layout (PublicLayout/AdminLayout)
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Includes skip link target (`<main id="main-content">`)
- [ ] Loading, empty, and error states handled
- [ ] Responsive at all breakpoints
- [ ] Dark mode tested
- [ ] Keyboard navigable

### For Forms
- [ ] All inputs have associated labels
- [ ] Error messages linked via `aria-describedby`
- [ ] Required fields marked visually and via `aria-required`
- [ ] Validation on blur and submit
- [ ] Preserves input on error
- [ ] Submit button disabled during submission
- [ ] Success feedback after submission

---

## 12. Anti-Patterns to Avoid

| Anti-Pattern | Correct Approach |
|--------------|------------------|
| Arbitrary color values (`bg-[#123456]`) | Use design tokens (`bg-primary-600`) |
| Inline styles for layout | Use Tailwind utility classes |
| `any` type in TypeScript | Proper typing with interfaces |
| Missing `forwardRef` on UI components | Always use `forwardRef` |
| No focus styles | Use `:focus-visible` with ring utilities |
| Color-only state indication | Combine color + icon + text |
| Fixed pixel values for spacing | Use spacing scale (`p-4`, `gap-6`) |
| Direct DOM manipulation | Use React state and refs |
| Duplicate component logic | Extract to hooks/utilities |
| Hardcoded strings in components | Use constants or i18n system |

---

## 13. Resources

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **WAI-ARIA Practices**: https://www.w3.org/WAI/ARIA/apg/
- **Radix UI Primitives**: https://www.radix-ui.com/ (reference for patterns)
- **Headless UI**: https://headlessui.com/ (reference for patterns)

---

## 14. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-08-04 | Initial design system documentation |

---

*This document is a living standard. Update it when design decisions change or new patterns are established.*