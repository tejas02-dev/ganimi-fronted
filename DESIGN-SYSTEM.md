# Ganimi Design System

A comprehensive design system documentation for the Ganimi frontend application, built with Next.js, Tailwind CSS, and Shadcn/ui components.

## 🎨 Overview

This design system provides a unified visual language and component library for Ganimi, ensuring consistency across the entire application. The system is built using modern design tokens and follows accessibility best practices.

---

## 📝 Typography

### Font Families

#### Primary Font
- **Font Family**: `Wix Madefor Display`
- **Fallback**: `system-ui, sans-serif`
- **Usage**: Body text, headings, and general UI elements
- **Google Fonts Import**: `https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@400;500;600;700&display=swap`

#### Secondary Fonts (System)
- **Sans Serif**: `Geist` (CSS Variable: `--font-geist-sans`)
- **Monospace**: `Geist Mono` (CSS Variable: `--font-geist-mono`)

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Typography Scale
Based on Tailwind CSS typography utilities:

- **xs**: 12px / 0.75rem
- **sm**: 14px / 0.875rem  
- **base**: 16px / 1rem
- **lg**: 18px / 1.125rem
- **xl**: 20px / 1.25rem
- **2xl**: 24px / 1.5rem
- **3xl**: 30px / 1.875rem
- **4xl**: 36px / 2.25rem

### Line Heights
- **Tight**: 1.25
- **Snug**: 1.375
- **Normal**: 1.5
- **Relaxed**: 1.625
- **Loose**: 2

---

## 🎨 Color System

### Color Format
All colors are defined using **OKLCH** color space for better perceptual uniformity and wider gamut support.

### Light Mode Colors

#### Neutral Colors
- **Background**: `oklch(1 0 0)` - Pure white
- **Foreground**: `oklch(0.145 0 0)` - Dark text
- **Card**: `oklch(1 0 0)` - White card background
- **Card Foreground**: `oklch(0.145 0 0)` - Dark text on cards
- **Popover**: `oklch(1 0 0)` - White popover background
- **Popover Foreground**: `oklch(0.145 0 0)` - Dark text on popovers

#### Brand Colors
- **Primary**: `oklch(0.205 0 0)` - Dark gray/black
- **Primary Foreground**: `oklch(0.985 0 0)` - White text on primary
- **Secondary**: `oklch(0.97 0 0)` - Light gray
- **Secondary Foreground**: `oklch(0.205 0 0)` - Dark text on secondary

#### State Colors
- **Muted**: `oklch(0.97 0 0)` - Light gray background
- **Muted Foreground**: `oklch(0.556 0 0)` - Medium gray text
- **Accent**: `oklch(0.97 0 0)` - Light gray accent
- **Accent Foreground**: `oklch(0.205 0 0)` - Dark text on accent
- **Destructive**: `oklch(0.577 0.245 27.325)` - Red for errors/destructive actions

#### Border & Input Colors
- **Border**: `oklch(0.922 0 0)` - Light gray borders
- **Input**: `oklch(0.922 0 0)` - Input field borders
- **Ring**: `oklch(0.708 0 0)` - Focus ring color

#### Chart Colors
- **Chart 1**: `oklch(0.646 0.222 41.116)` - Orange
- **Chart 2**: `oklch(0.6 0.118 184.704)` - Blue
- **Chart 3**: `oklch(0.398 0.07 227.392)` - Dark blue
- **Chart 4**: `oklch(0.828 0.189 84.429)` - Yellow-green
- **Chart 5**: `oklch(0.769 0.188 70.08)` - Green

#### Sidebar Colors
- **Sidebar**: `oklch(0.985 0 0)` - Light gray sidebar
- **Sidebar Foreground**: `oklch(0.145 0 0)` - Dark text
- **Sidebar Primary**: `oklch(0.205 0 0)` - Dark primary
- **Sidebar Primary Foreground**: `oklch(0.985 0 0)` - White text
- **Sidebar Accent**: `oklch(0.97 0 0)` - Light accent
- **Sidebar Accent Foreground**: `oklch(0.205 0 0)` - Dark text
- **Sidebar Border**: `oklch(0.922 0 0)` - Light border
- **Sidebar Ring**: `oklch(0.708 0 0)` - Focus ring

### Dark Mode Colors

#### Neutral Colors
- **Background**: `oklch(0.145 0 0)` - Dark background
- **Foreground**: `oklch(0.985 0 0)` - Light text
- **Card**: `oklch(0.205 0 0)` - Dark card background
- **Card Foreground**: `oklch(0.985 0 0)` - Light text on cards
- **Popover**: `oklch(0.205 0 0)` - Dark popover background
- **Popover Foreground**: `oklch(0.985 0 0)` - Light text on popovers

#### Brand Colors
- **Primary**: `oklch(0.922 0 0)` - Light gray/white
- **Primary Foreground**: `oklch(0.205 0 0)` - Dark text on primary
- **Secondary**: `oklch(0.269 0 0)` - Medium dark gray
- **Secondary Foreground**: `oklch(0.985 0 0)` - Light text on secondary

#### State Colors
- **Muted**: `oklch(0.269 0 0)` - Medium dark gray
- **Muted Foreground**: `oklch(0.708 0 0)` - Medium light gray text
- **Accent**: `oklch(0.269 0 0)` - Medium dark gray accent
- **Accent Foreground**: `oklch(0.985 0 0)` - Light text on accent
- **Destructive**: `oklch(0.704 0.191 22.216)` - Red for errors

#### Border & Input Colors
- **Border**: `oklch(1 0 0 / 10%)` - Translucent white border
- **Input**: `oklch(1 0 0 / 15%)` - Translucent white input
- **Ring**: `oklch(0.556 0 0)` - Medium gray focus ring

#### Chart Colors (Dark Mode)
- **Chart 1**: `oklch(0.488 0.243 264.376)` - Purple
- **Chart 2**: `oklch(0.696 0.17 162.48)` - Teal
- **Chart 3**: `oklch(0.769 0.188 70.08)` - Green
- **Chart 4**: `oklch(0.627 0.265 303.9)` - Pink
- **Chart 5**: `oklch(0.645 0.246 16.439)` - Orange

#### Sidebar Colors (Dark Mode)
- **Sidebar**: `oklch(0.205 0 0)` - Dark sidebar
- **Sidebar Foreground**: `oklch(0.985 0 0)` - Light text
- **Sidebar Primary**: `oklch(0.488 0.243 264.376)` - Purple primary
- **Sidebar Primary Foreground**: `oklch(0.985 0 0)` - Light text
- **Sidebar Accent**: `oklch(0.269 0 0)` - Medium dark accent
- **Sidebar Accent Foreground**: `oklch(0.985 0 0)` - Light text
- **Sidebar Border**: `oklch(1 0 0 / 10%)` - Translucent border
- **Sidebar Ring**: `oklch(0.556 0 0)` - Medium gray ring

### Custom Brand Colors (Used in Components)

#### Gradient Colors
- **Blue to Purple Gradient**: `from-blue-600 to-purple-600`
- **Reverse Gradient**: `from-purple-600 to-blue-600`

#### Specific Use Cases
- **Blue 50**: Light blue background (`hover:bg-blue-50`)
- **Blue 600**: Primary blue (`bg-blue-600`)
- **Blue 700**: Darker blue (`hover:bg-blue-700`)
- **Red 600**: Error color (`text-red-600`, `bg-red-600`)
- **Red 700**: Darker error (`hover:bg-red-700`)
- **Red 50**: Light error background (`focus:bg-red-50`)
- **Green 600**: Success color (`text-green-600`)
- **Gray 50**: Very light gray (`bg-gray-50`)
- **Gray 200**: Light gray (`bg-gray-200`)
- **Gray 400**: Medium gray (`text-gray-400`)
- **Gray 500**: Darker gray (`text-gray-500`)
- **Gray 600**: Dark gray (`text-gray-600`)
- **Gray 700**: Very dark gray (`text-gray-700`)
- **Gray 900**: Near black (`text-gray-900`)

---

## 📐 Spacing System

### Border Radius
- **Small**: `calc(var(--radius) - 4px)` → 6px (when --radius is 10px)
- **Medium**: `calc(var(--radius) - 2px)` → 8px
- **Large**: `var(--radius)` → 10px (0.625rem)
- **Extra Large**: `calc(var(--radius) + 4px)` → 14px

### Default Radius
- **Root Radius**: `0.625rem` (10px)

### Component-Specific Radius
- **Rounded Small**: `rounded-xs`, `rounded-sm`
- **Rounded Medium**: `rounded-md`
- **Rounded Large**: `rounded-lg`
- **Rounded Extra Large**: `rounded-xl`
- **Rounded Full**: `rounded-full` (for circular elements)

### Spacing Scale (Tailwind Default)
- **0**: 0px
- **1**: 4px / 0.25rem
- **2**: 8px / 0.5rem
- **3**: 12px / 0.75rem
- **4**: 16px / 1rem
- **5**: 20px / 1.25rem
- **6**: 24px / 1.5rem
- **8**: 32px / 2rem
- **10**: 40px / 2.5rem
- **12**: 48px / 3rem
- **16**: 64px / 4rem
- **20**: 80px / 5rem

---

## 🧩 Component System

### Component Variants

#### Button Variants
- **Default**: Primary blue background with white text
- **Destructive**: Red background for dangerous actions
- **Outline**: Transparent background with border
- **Secondary**: Light gray background
- **Ghost**: Transparent background, hover effects
- **Link**: Text-only button with underline

#### Button Sizes
- **Default**: `h-9 px-4 py-2` (36px height)
- **Small**: `h-8 px-3 gap-1.5` (32px height)
- **Large**: `h-10 px-6` (40px height)
- **Icon**: `size-9` (36px square)

#### Badge Variants
- **Default**: Primary background
- **Secondary**: Light gray background
- **Destructive**: Red background
- **Outline**: Transparent with border

#### Card Structure
- **Card Container**: White background, rounded corners, shadow
- **Card Header**: Grid layout for title and actions
- **Card Title**: Semibold text, no line height
- **Card Description**: Muted text, small size
- **Card Content**: Main content area with padding
- **Card Footer**: Bottom section with flex layout
- **Card Action**: Right-aligned action buttons

### Input Components

#### Input Styling
- **Height**: `h-9` (36px)
- **Padding**: `px-3 py-1`
- **Border**: Light gray with focus states
- **Border Radius**: `rounded-md`
- **Focus Ring**: Blue ring with 3px width
- **Error State**: Red border and ring

#### Select Components
- **Trigger**: Similar to input styling
- **Content**: Dropdown with shadow and animation
- **Item**: Hover states and selection indicators
- **Sizes**: Default and small variants

### Interactive States

#### Focus States
- **Ring Color**: `focus-visible:ring-ring/50`
- **Ring Width**: `focus-visible:ring-[3px]`
- **Border Color**: `focus-visible:border-ring`
- **Outline**: `outline-none`

#### Hover States
- **Button Hover**: Opacity reduction (`hover:bg-primary/90`)
- **Card Hover**: Shadow increase (`hover:shadow-lg`)
- **Icon Hover**: Scale transform (`hover:scale-105`)

#### Error States
- **Border**: `aria-invalid:border-destructive`
- **Ring**: `aria-invalid:ring-destructive/20`
- **Dark Mode Ring**: `dark:aria-invalid:ring-destructive/40`

---

## 🎬 Animation System

### Predefined Animations

#### Fade In Up
```css
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}
```

#### Built-in Tailwind Animations
- **Spin**: `animate-spin` (loading indicators)
- **Ping**: `animate-ping` (notification badges)
- **Pulse**: `animate-pulse` (loading skeletons)
- **Bounce**: `animate-bounce` (attention grabbers)

### Transition Utilities
- **Default Transition**: `transition-all`
- **Color Transitions**: `transition-colors`
- **Transform Transitions**: `transition-transform`
- **Box Shadow Transitions**: `transition-shadow`
- **Duration**: `duration-200`, `duration-300`
- **Easing**: `ease-out`, `ease-in-out`

### Component Animations

#### Dialog Animations
- **Fade In/Out**: `data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0`
- **Zoom In/Out**: `data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95`
- **Slide Animations**: Direction-based slide effects

#### Hover Animations
- **Scale**: `hover:scale-105`, `hover:scale-110`
- **Rotate**: `hover:rotate-12`
- **Shadow**: `hover:shadow-xl`

---

## 📱 Responsive Design

### Breakpoints (Tailwind Default)
- **sm**: 640px and up
- **md**: 768px and up
- **lg**: 1024px and up
- **xl**: 1280px and up
- **2xl**: 1536px and up

### Container Constraints
- **Max Width**: `max-w-2xl` for search bars
- **Full Width**: `w-full` for containers
- **Responsive Padding**: `px-4 sm:px-6 lg:px-8`

### Responsive Typography
- **Base Size**: `text-base` (16px on desktop)
- **Mobile Adjustment**: `md:text-sm` (14px on mobile)
- **Hidden Elements**: `hidden md:block` (show on desktop only)

---

## ♿ Accessibility

### Focus Management
- **Focus Visible**: Clear focus indicators with rings
- **Keyboard Navigation**: Tab order and navigation support
- **Screen Reader Support**: `sr-only` class for hidden text

### Color Contrast
- **Text Contrast**: High contrast ratios for readability
- **Focus Indicators**: Visible focus states
- **Error States**: Color and text-based error indication

### Semantic HTML
- **Proper Roles**: Button, dialog, and form roles
- **ARIA Labels**: Descriptive labels for interactive elements
- **Screen Reader Text**: Hidden descriptive text

---

## 🎯 Usage Guidelines

### Component Selection
1. **Use shadcn/ui components** as the foundation
2. **Extend with custom variants** when needed
3. **Maintain consistency** across similar interactions
4. **Follow the established patterns** for new components

### Color Usage
1. **Primary colors** for main actions and branding
2. **Secondary colors** for less important actions
3. **Destructive colors** for dangerous actions only
4. **Muted colors** for secondary information

### Typography Hierarchy
1. **Large text** for headings and important content
2. **Base text** for body content
3. **Small text** for secondary information
4. **Consistent font weights** for similar content types

### Spacing Consistency
1. **Use the spacing scale** for consistent gaps
2. **Follow component patterns** for padding and margins
3. **Maintain rhythm** between related elements

---

## 🔧 Implementation

### CSS Variables
All design tokens are implemented as CSS custom properties and can be accessed through Tailwind utilities or custom CSS.

### Component Library
Components are built using:
- **Radix UI Primitives** for accessibility and behavior
- **Class Variance Authority (CVA)** for variant management
- **Tailwind Merge** for class conflict resolution
- **Lucide React** for consistent iconography

### Theme Configuration
The design system supports both light and dark modes through CSS custom properties and the `dark` class selector.

---

## 📋 Component Inventory

### Base Components
- ✅ Button (5 variants, 4 sizes)
- ✅ Input (with focus and error states)
- ✅ Select (with dropdown and scroll)
- ✅ Card (with header, content, footer)
- ✅ Badge (4 variants)
- ✅ Avatar (with image and fallback)
- ✅ Dialog (with animations)
- ✅ Alert Dialog (for confirmations)
- ✅ Dropdown Menu (with separators)
- ✅ Skeleton (for loading states)
- ✅ Sonner (for toast notifications)

### Custom Components
- ✅ Navbar (with responsive design)
- ✅ ServicesList (with cards and actions)
- ✅ CreateServiceDialog
- ✅ EditServiceDialog
- ✅ BookingsList
- ✅ OrdersList

---

This design system serves as the foundation for building consistent, accessible, and maintainable user interfaces in the Ganimi application. For implementation details and code examples, refer to the component files in the `/components` directory.
