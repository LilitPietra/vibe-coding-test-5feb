# Quick Start Guide

Get up and running with the Cursor component in minutes!

## 📦 Installation

### Option 1: Install TypeScript (Recommended)

If you don't have TypeScript installed:

```bash
npm install
```

This will install TypeScript as a dev dependency.

### Option 2: Use the Demo Directly

The demo includes an inline JavaScript implementation - just open `demo/index.html` in your browser!

## 🚀 Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

This creates the compiled files in the `dist/` directory.

## 🎨 View the Demo

### Option 1: Direct File Open

Simply open `demo/index.html` in your web browser.

### Option 2: Local Server (Recommended)

For a better development experience, use a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000/demo/`

## 💻 Basic Usage

### 1. Include CSS

```html
<link rel="stylesheet" href="src/cursor.css">
```

### 2. Include JavaScript

After building with TypeScript:

```html
<script type="module">
  import { Cursor } from './dist/cursor.js';
  
  const cursor = new Cursor();
  cursor.mount();
</script>
```

### 3. That's it! 

Your custom cursor is now active. Move your mouse to see it in action!

## 🎯 Try Different States

```javascript
const cursor = new Cursor();
cursor.mount();

// Change states
cursor.setState('hover');
cursor.setState('loading');
cursor.setState('disabled');

// Change sizes
cursor.setSize('large');
cursor.setSize('small');

// Listen to events
cursor.on('statechange', (event) => {
  console.log('State changed:', event.detail);
});
```

## 🔧 Common Tasks

### Compile TypeScript in Watch Mode

```bash
npm run watch
```

### Clean Build Artifacts

```bash
npm run clean
```

### Use Without TypeScript

If you don't want to use TypeScript, you can copy the inline implementation from `demo/index.html` (lines with the `Cursor` class definition) into your own JavaScript file.

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed API documentation
- Explore the [demo](demo/index.html) to see all features
- Customize CSS variables to match your brand
- Check out framework integrations (React, Vue) in the README

## 🆘 Troubleshooting

### Cursor not showing?

1. Make sure you included the CSS file
2. Check if you're on a touch device (cursor auto-disables)
3. Verify the cursor is mounted: `cursor.isActive()`

### TypeScript errors?

Make sure you have TypeScript installed:

```bash
npm install typescript
```

### Build fails?

Clean and rebuild:

```bash
npm run clean && npm run build
```

## 🎉 You're Ready!

Start building amazing experiences with your custom cursor!

For questions or issues, check the main [README.md](README.md) or open an issue on GitHub.
