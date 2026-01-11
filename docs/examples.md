# Examples

Real-world examples of using Adaptive CSS in different scenarios.

## Basic HTML Page

A simple HTML page using the generated colors:

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <link rel="stylesheet" href="colors.css">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, sans-serif;
      line-height: 1.6;
      transition: background-color 0.2s, color 0.2s;
    }
  </style>
</head>
<body class="bg-default text-default">
  <header class="bg-elevated" style="padding: 1rem;">
    <nav style="display: flex; justify-content: space-between; align-items: center;">
      <h1>My App</h1>
      <button
        class="bg-accent text-on-accent"
        style="padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer;"
        onclick="toggleTheme()"
      >
        Toggle Theme
      </button>
    </nav>
  </header>

  <main style="padding: 2rem; max-width: 800px; margin: 0 auto;">
    <section class="bg-surface" style="padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
      <h2>Welcome</h2>
      <p class="text-muted">This is a demo of the adaptive color system.</p>
    </section>

    <div style="display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
      <div class="bg-elevated" style="padding: 1rem; border-radius: 8px;">
        <h3>Card 1</h3>
        <p class="text-muted">Some content here.</p>
      </div>
      <div class="bg-elevated" style="padding: 1rem; border-radius: 8px;">
        <h3>Card 2</h3>
        <p class="text-muted">More content here.</p>
      </div>
    </div>
  </main>

  <script>
    function toggleTheme() {
      const html = document.documentElement;
      html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
    }
  </script>
</body>
</html>
```

---

## Component Library Styles

Base styles for a component library:

```css
/* components.css */
@import './colors.css';

/* Button Component */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s, transform 0.1s;
}

.btn:active {
  transform: scale(0.98);
}

.btn-primary {
  background-color: var(--color-accent);
  color: var(--color-accent-fg);
}

.btn-primary:hover {
  background-color: var(--color-accent-hover);
}

.btn-primary:active {
  background-color: var(--color-accent-active);
}

.btn-secondary {
  background-color: var(--color-bg-elevated);
  color: var(--color-fg);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background-color: var(--color-bg-surface);
}

/* Input Component */
.input {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  background-color: var(--color-bg);
  color: var(--color-fg);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input::placeholder {
  color: var(--color-fg-muted);
}

/* Card Component */
.card {
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border-subtle);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.card-title {
  color: var(--color-fg);
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-description {
  color: var(--color-fg-muted);
  font-size: 0.875rem;
}

/* Alert Component */
.alert {
  padding: 1rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.alert-success {
  background-color: var(--color-success);
  color: var(--color-success-fg);
}

.alert-warning {
  background-color: var(--color-warning);
  color: var(--color-warning-fg);
}

.alert-error {
  background-color: var(--color-error);
  color: var(--color-error-fg);
}

.alert-info {
  background-color: var(--color-info);
  color: var(--color-info-fg);
}
```

---

## React Components

Using colors in React with styled-components or CSS modules:

### With CSS Modules

```tsx
// Button.module.css
.button {
  background-color: var(--color-accent);
  color: var(--color-accent-fg);
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: var(--color-accent-hover);
}

// Button.tsx
import styles from './Button.module.css';

export function Button({ children, ...props }) {
  return (
    <button className={styles.button} {...props}>
      {children}
    </button>
  );
}
```

### With Tailwind + CSS Variables

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--color-bg)',
          subtle: 'var(--color-bg-subtle)',
          elevated: 'var(--color-bg-elevated)',
          surface: 'var(--color-bg-surface)',
        },
        fg: {
          DEFAULT: 'var(--color-fg)',
          muted: 'var(--color-fg-muted)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          active: 'var(--color-accent-active)',
          fg: 'var(--color-accent-fg)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          subtle: 'var(--color-border-subtle)',
        },
      },
    },
  },
};
```

```tsx
// Usage
<button className="bg-accent text-accent-fg hover:bg-accent-hover">
  Click me
</button>
```

---

## Multi-Tenant Theming

Generate different themes for different customers:

```typescript
// generate-themes.ts
import { generateCSS } from 'adaptive-css';
import { writeFileSync, mkdirSync } from 'fs';

const tenants = {
  acme: {
    neutral: '#374151',
    accent: '#EF4444',  // Red
  },
  globex: {
    neutral: '#1F2937',
    accent: '#8B5CF6',  // Purple
  },
  initech: {
    neutral: '#6B7280',
    accent: '#10B981',  // Green
  },
};

mkdirSync('themes', { recursive: true });

for (const [tenant, colors] of Object.entries(tenants)) {
  const css = generateCSS({
    palettes: {
      neutral: colors.neutral,
      accent: colors.accent,
    },
  });

  writeFileSync(`themes/${tenant}.css`, css);
  console.log(`Generated theme for ${tenant}`);
}
```

Load themes dynamically:

```html
<link id="theme-css" rel="stylesheet" href="/themes/acme.css">

<script>
  function setTenant(tenant) {
    document.getElementById('theme-css').href = `/themes/${tenant}.css`;
  }
</script>
```

---

## Dashboard Layout

A complete dashboard layout using the color system:

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard</title>
  <link rel="stylesheet" href="colors.css">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, sans-serif;
      min-height: 100vh;
      display: flex;
    }

    /* Sidebar */
    .sidebar {
      width: 250px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-item {
      padding: 0.75rem 1rem;
      border-radius: 0.375rem;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transition: background-color 0.15s;
    }

    .nav-item:hover {
      background-color: var(--color-bg-elevated);
    }

    .nav-item.active {
      background-color: var(--color-accent);
      color: var(--color-accent-fg);
    }

    /* Main content */
    .main {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--color-border-subtle);
    }

    /* Stats grid */
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      padding: 1.25rem;
      border-radius: 0.5rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.875rem;
    }

    /* Table */
    .table-container {
      border-radius: 0.5rem;
      border: 1px solid var(--color-border-subtle);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid var(--color-border-subtle);
    }

    th {
      font-weight: 600;
      font-size: 0.875rem;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background-color: var(--color-bg-subtle);
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .badge-success {
      background-color: var(--color-success);
      color: var(--color-success-fg);
    }

    .badge-warning {
      background-color: var(--color-warning);
      color: var(--color-warning-fg);
    }
  </style>
</head>
<body class="bg-default text-default">
  <aside class="sidebar bg-subtle">
    <h2 style="padding: 1rem; font-size: 1.25rem;">Dashboard</h2>
    <nav>
      <a href="#" class="nav-item active">Overview</a>
      <a href="#" class="nav-item text-default">Analytics</a>
      <a href="#" class="nav-item text-default">Reports</a>
      <a href="#" class="nav-item text-default">Settings</a>
    </nav>
  </aside>

  <main class="main bg-default">
    <header class="header">
      <h1>Overview</h1>
      <button
        class="bg-accent text-on-accent"
        style="padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer;"
        onclick="toggleTheme()"
      >
        Toggle Theme
      </button>
    </header>

    <div class="stats">
      <div class="stat-card bg-elevated">
        <div class="stat-value">$45,231</div>
        <div class="stat-label text-muted">Total Revenue</div>
      </div>
      <div class="stat-card bg-elevated">
        <div class="stat-value">+2,350</div>
        <div class="stat-label text-muted">New Users</div>
      </div>
      <div class="stat-card bg-elevated">
        <div class="stat-value">12,543</div>
        <div class="stat-label text-muted">Active Sessions</div>
      </div>
      <div class="stat-card bg-elevated">
        <div class="stat-value">573</div>
        <div class="stat-label text-muted">Pending Orders</div>
      </div>
    </div>

    <div class="table-container bg-elevated">
      <table>
        <thead class="bg-surface">
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#12345</td>
            <td>John Doe</td>
            <td><span class="badge badge-success">Completed</span></td>
            <td>$125.00</td>
          </tr>
          <tr>
            <td>#12346</td>
            <td>Jane Smith</td>
            <td><span class="badge badge-warning">Pending</span></td>
            <td>$89.00</td>
          </tr>
          <tr>
            <td>#12347</td>
            <td>Bob Johnson</td>
            <td><span class="badge badge-success">Completed</span></td>
            <td>$245.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>

  <script>
    function toggleTheme() {
      const html = document.documentElement;
      html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
    }
  </script>
</body>
</html>
```

---

## Form Example

A styled form using the color system:

```html
<form class="bg-elevated" style="padding: 1.5rem; border-radius: 0.5rem; max-width: 400px;">
  <h2 style="margin-bottom: 1rem;">Sign In</h2>

  <div style="margin-bottom: 1rem;">
    <label class="text-default" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">
      Email
    </label>
    <input
      type="email"
      placeholder="you@example.com"
      style="
        width: 100%;
        padding: 0.5rem 0.75rem;
        background: var(--color-bg);
        color: var(--color-fg);
        border: 1px solid var(--color-border);
        border-radius: 0.375rem;
      "
    >
  </div>

  <div style="margin-bottom: 1rem;">
    <label class="text-default" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">
      Password
    </label>
    <input
      type="password"
      placeholder="••••••••"
      style="
        width: 100%;
        padding: 0.5rem 0.75rem;
        background: var(--color-bg);
        color: var(--color-fg);
        border: 1px solid var(--color-border);
        border-radius: 0.375rem;
      "
    >
  </div>

  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
    <input type="checkbox" id="remember">
    <label for="remember" class="text-muted" style="font-size: 0.875rem;">
      Remember me
    </label>
  </div>

  <button
    type="submit"
    class="bg-accent text-on-accent"
    style="
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
    "
  >
    Sign In
  </button>

  <p class="text-muted" style="margin-top: 1rem; text-align: center; font-size: 0.875rem;">
    Don't have an account? <a href="#" style="color: var(--color-accent);">Sign up</a>
  </p>
</form>
```
