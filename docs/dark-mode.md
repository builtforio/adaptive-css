# Dark Mode

Adaptive CSS provides flexible dark mode support with multiple implementation strategies.

## How It Works

The generated CSS includes three dark mode mechanisms:

1. **Attribute selector** — `[data-theme="dark"]`
2. **Class selector** — `.dark`
3. **System preference** — `@media (prefers-color-scheme: dark)`

All three can work together, with manual overrides taking precedence over system preference.

---

## Implementation Strategies

### Strategy 1: User Toggle with Persistence

The most common approach — let users choose and remember their preference:

```html
<html data-theme="light">
<head>
  <link rel="stylesheet" href="colors.css">
  <script>
    // Apply saved preference immediately (before page renders)
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.dataset.theme = saved;
    }
  </script>
</head>
<body class="bg-default text-default">
  <button id="theme-toggle">Toggle Theme</button>

  <script>
    const toggle = document.getElementById('theme-toggle');
    toggle.addEventListener('click', () => {
      const html = document.documentElement;
      const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
      html.dataset.theme = next;
      localStorage.setItem('theme', next);
    });
  </script>
</body>
</html>
```

### Strategy 2: System Preference Only

Let the OS control the theme — no toggle needed:

```html
<html>
<head>
  <link rel="stylesheet" href="colors.css">
</head>
<body class="bg-default text-default">
  <!-- Theme automatically matches system preference -->
</body>
</html>
```

The generated CSS handles this with:

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not(.light) {
    /* Dark mode tokens */
  }
}
```

### Strategy 3: System Preference with Override

Best of both worlds — follow system by default, allow manual override:

```html
<html>
<head>
  <link rel="stylesheet" href="colors.css">
  <script>
    // Check for saved preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.dataset.theme = saved;
    }
    // If no saved preference, system preference applies automatically
  </script>
</head>
<body class="bg-default text-default">
  <button id="theme-toggle">Toggle Theme</button>

  <script>
    const toggle = document.getElementById('theme-toggle');

    function getEffectiveTheme() {
      const explicit = document.documentElement.dataset.theme;
      if (explicit) return explicit;
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    toggle.addEventListener('click', () => {
      const current = getEffectiveTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('theme', next);
    });

    // Optional: Add a "System" option that clears the override
    function useSystemTheme() {
      delete document.documentElement.dataset.theme;
      localStorage.removeItem('theme');
    }
  </script>
</body>
</html>
```

### Strategy 4: Class-Based (Tailwind-style)

If you prefer class-based toggling:

```html
<html class="light">
<body class="bg-default text-default">
  <button onclick="document.documentElement.classList.toggle('dark');
                   document.documentElement.classList.toggle('light');">
    Toggle
  </button>
</body>
</html>
```

---

## React Implementation

```tsx
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({ theme: 'system', setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem('theme') as Theme) || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'system') {
      delete root.dataset.theme;
      localStorage.removeItem('theme');
    } else {
      root.dataset.theme = theme;
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Usage
function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
```

---

## Vue Implementation

```vue
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

type Theme = 'light' | 'dark' | 'system';

const theme = ref<Theme>('system');

onMounted(() => {
  const saved = localStorage.getItem('theme') as Theme;
  if (saved) theme.value = saved;
});

watch(theme, (newTheme) => {
  if (newTheme === 'system') {
    delete document.documentElement.dataset.theme;
    localStorage.removeItem('theme');
  } else {
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
  }
});
</script>

<template>
  <select v-model="theme">
    <option value="light">Light</option>
    <option value="dark">Dark</option>
    <option value="system">System</option>
  </select>
</template>
```

---

## Preventing Flash of Wrong Theme

To prevent a flash of light mode before JavaScript runs:

### Option 1: Inline Script in `<head>`

```html
<head>
  <script>
    (function() {
      const saved = localStorage.getItem('theme');
      if (saved) {
        document.documentElement.dataset.theme = saved;
      }
    })();
  </script>
  <link rel="stylesheet" href="colors.css">
</head>
```

### Option 2: Server-Side Detection

Set the theme attribute server-side based on a cookie:

```html
<!-- Server renders this based on theme cookie -->
<html data-theme="dark">
```

### Option 3: CSS-Only with System Preference

If you only use system preference (no manual toggle), there's no flash because CSS handles it:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #111827;
  }
}
```

---

## Custom Dark Mode Selector

Configure a custom selector in your config:

```json
{
  "darkModeSelector": "[data-mode=\"night\"]"
}
```

Generates:

```css
[data-mode="night"],
.dark {
  /* Dark tokens */
}
```

---

## Disabling System Preference

To only allow manual switching:

```json
{
  "respectSystemPreference": false
}
```

This removes the `@media (prefers-color-scheme: dark)` block.

---

## Detecting Current Theme in JavaScript

```javascript
function getCurrentTheme() {
  // Check explicit setting first
  const explicit = document.documentElement.dataset.theme;
  if (explicit) return explicit;

  // Fall back to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    if (!document.documentElement.dataset.theme) {
      console.log('System theme changed to:', e.matches ? 'dark' : 'light');
    }
  });
```

---

## Testing Dark Mode

### Browser DevTools

1. Open DevTools (F12)
2. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
3. Type "rendering"
4. Select "Show Rendering"
5. Find "Emulate CSS media feature prefers-color-scheme"
6. Toggle between light and dark

### Automated Testing

```javascript
// Playwright
await page.emulateMedia({ colorScheme: 'dark' });

// Puppeteer
await page.emulateMediaFeatures([
  { name: 'prefers-color-scheme', value: 'dark' }
]);

// Cypress
cy.wrap(window).its('matchMedia')
  .invoke('call', window, '(prefers-color-scheme: dark)')
  .its('matches').should('eq', true);
```
