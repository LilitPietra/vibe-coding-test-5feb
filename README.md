# Cursor Component

A lightweight, accessible UI utility for custom cursor behavior across web applications. Built with vanilla TypeScript and designed to be framework-agnostic.

## Features

- **Multiple States**: Default, hover, active, focus-visible, disabled, and loading
- **Accessible**: Full keyboard navigation support, screen reader announcements, and reduced motion respect
- **Performance**: RAF-based position updates and CSS transform animations
- **Enhanced Animations**: Smooth pulse effects on hover and ripple effects on active state
- **Touch-Aware**: Automatically detects and disables on touch devices
- **Themeable**: CSS custom properties for easy customization
- **Framework-Agnostic**: Works with any JavaScript framework or vanilla JS

## Demo

Open `demo/index.html` in your browser to see an interactive demonstration of all cursor states and features.

## Installation

### Manual Installation

1. Copy the following files to your project:
   - `src/cursor.ts` - Main cursor class
   - `src/types.ts` - TypeScript type definitions
   - `src/cursor.css` - Cursor styles

2. Compile TypeScript (if using TypeScript):
   ```bash
   tsc src/cursor.ts --outDir dist
   ```

3. Include the CSS in your HTML:
   ```html
   <link rel="stylesheet" href="path/to/cursor.css">
   ```

4. Import and use the Cursor class:
   ```typescript
   import { Cursor } from './cursor';
   
   const cursor = new Cursor();
   cursor.mount();
   ```

## Usage

### Basic Usage

```typescript
import { Cursor } from './cursor';

// Create and mount cursor with default options
const cursor = new Cursor();
cursor.mount();
```

### With Options

```typescript
const cursor = new Cursor({
  size: 'large',
  initialState: 'default',
  enabled: true,
  disableOnTouch: true,
  trackFocus: true,
  customClass: 'my-cursor',
  zIndex: 9999
});

cursor.mount(document.body);
```

### Vanilla JavaScript (Without TypeScript)

If you're not using TypeScript, compile the TypeScript files first or use the inline implementation from the demo:

```html
<link rel="stylesheet" href="cursor.css">
<script src="cursor.js"></script>

<script>
  const cursor = new Cursor({ size: 'medium' });
  cursor.mount();
</script>
```

## API Reference

### Constructor

```typescript
new Cursor(options?: CursorOptions)
```

Creates a new cursor instance.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Initial cursor size |
| `shape` | `'circle' \| 'square' \| 'rounded-square' \| 'arrow' \| 'pointer'` | `'circle'` | Cursor shape |
| `initialState` | `CursorState` | `'default'` | Initial cursor state |
| `enabled` | `boolean` | `true` | Enable/disable custom cursor |
| `disableOnTouch` | `boolean` | `true` | Auto-disable on touch devices |
| `transitionDuration` | `number` | `100` | Transition duration in ms |
| `trackFocus` | `boolean` | `true` | Track keyboard focus |
| `customClass` | `string` | `''` | Custom CSS class |
| `zIndex` | `number` | `9999` | Z-index for cursor element |

### Methods

#### `mount(container?: HTMLElement): void`

Mounts the cursor to the DOM. If no container is provided, defaults to `document.body`.

```typescript
cursor.mount();
// or
cursor.mount(document.getElementById('app'));
```

#### `destroy(): void`

Removes the cursor from the DOM and cleans up event listeners.

```typescript
cursor.destroy();
```

#### `setState(state: CursorState): void`

Changes the cursor state.

```typescript
cursor.setState('loading');
cursor.setState('hover');
cursor.setState('disabled');
```

Available states: `'default'`, `'hover'`, `'active'`, `'focus-visible'`, `'disabled'`, `'loading'`

#### `getState(): CursorState`

Returns the current cursor state.

```typescript
const state = cursor.getState(); // 'default'
```

#### `setSize(size: CursorSize): void`

Changes the cursor size.

```typescript
cursor.setSize('large');
cursor.setSize('small');
```

Available sizes: `'small'` (12px), `'medium'` (18px), `'large'` (26px)

#### `getSize(): CursorSize`

Returns the current cursor size.

```typescript
const size = cursor.getSize(); // 'medium'
```

#### `setShape(shape: CursorShape): void`

Changes the cursor shape.

```typescript
cursor.setShape('square');
cursor.setShape('arrow');
cursor.setShape('pointer');
```

Available shapes: `'circle'`, `'square'`, `'rounded-square'`, `'arrow'`, `'pointer'`

#### `getShape(): CursorShape`

Returns the current cursor shape.

```typescript
const shape = cursor.getShape(); // 'circle'
```

#### `setPosition(x: number, y: number): void`

Manually set cursor position (usually not needed as it follows the mouse automatically).

```typescript
cursor.setPosition(100, 200);
```

#### `enable(): void`

Enables the custom cursor.

```typescript
cursor.enable();
```

#### `disable(): void`

Disables the custom cursor and shows the system cursor.

```typescript
cursor.disable();
```

#### `isActive(): boolean`

Returns whether the cursor is currently enabled and mounted.

```typescript
if (cursor.isActive()) {
  console.log('Cursor is active');
}
```

#### `on(eventName: string, callback: EventListener): void`

Adds an event listener to the cursor.

```typescript
cursor.on('statechange', (event) => {
  console.log('State changed:', event.detail);
});
```

#### `off(eventName: string, callback: EventListener): void`

Removes an event listener from the cursor.

```typescript
const handler = (e) => console.log(e.detail);
cursor.on('statechange', handler);
cursor.off('statechange', handler);
```

### Events

The cursor emits the following custom events:

#### `statechange`

Fired when the cursor state changes.

```typescript
cursor.on('statechange', (event: CustomEvent<CursorStateChangeEvent>) => {
  console.log('Previous:', event.detail.previousState);
  console.log('Current:', event.detail.currentState);
  console.log('Timestamp:', event.detail.timestamp);
});
```

#### `mount`

Fired when the cursor is mounted to the DOM.

```typescript
cursor.on('mount', () => {
  console.log('Cursor mounted');
});
```

#### `destroy`

Fired when the cursor is destroyed.

```typescript
cursor.on('destroy', () => {
  console.log('Cursor destroyed');
});
```

## CSS Customization

The cursor uses CSS custom properties (CSS variables) for easy theming:

```css
:root {
  /* Size tokens */
  --cursor-size-small: 12px;
  --cursor-size-medium: 18px;
  --cursor-size-large: 26px;

  /* Color tokens */
  --cursor-default-color: #000000;
  --cursor-hover-color: #333333;
  --cursor-active-color: #007AFF;
  --cursor-focus-color: #007AFF;
  --cursor-disabled-color: #999999;
  --cursor-loading-color: #007AFF;

  /* Opacity tokens */
  --cursor-disabled-opacity: 0.45;
  --cursor-default-opacity: 0.8;

  /* Animation tokens */
  --cursor-transition-duration: 0.15s;
  --cursor-transition-easing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Custom Styling Example

```css
/* Change cursor color to match your brand */
:root {
  --cursor-active-color: #ff0066;
  --cursor-focus-color: #ff0066;
}

/* Custom state styling */
.custom-cursor[data-state="hover"] {
  background-color: var(--cursor-hover-color);
  transform: translate(-50%, -50%) scale(1.5);
}
```

## Accessibility

The cursor component follows accessibility best practices:

- **Keyboard Navigation**: Fully supports keyboard navigation with visible focus indicators
- **Focus-Visible**: Tracks keyboard focus and updates cursor state automatically
- **Screen Reader Support**: Important state changes are announced to screen readers
- **Reduced Motion**: Respects `prefers-reduced-motion` user preference
- **Touch Devices**: Automatically disabled on touch-only devices
- **OS Cursor Fallback**: Native cursor remains functional for critical interactions

### QA Checklist

✅ Keyboard focus visible  
✅ Reduced motion supported  
✅ Touch devices excluded  
✅ No UI obstruction  
✅ Screen reader announcements where relevant

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills for CustomEvent and CSS variables)

## Performance

The cursor is optimized for performance:

- **Transform-based positioning**: Uses CSS transforms instead of top/left for better performance
- **RequestAnimationFrame**: Position updates are batched using RAF
- **Passive event listeners**: Mouse events use passive listeners
- **Minimal DOM impact**: Single element outside heavy DOM trees

## Examples

### React Integration

```tsx
import { useEffect, useRef } from 'react';
import { Cursor } from './cursor';

function App() {
  const cursorRef = useRef<Cursor | null>(null);

  useEffect(() => {
    cursorRef.current = new Cursor({ size: 'medium' });
    cursorRef.current.mount();

    return () => {
      cursorRef.current?.destroy();
    };
  }, []);

  return (
    <div>
      <button onClick={() => cursorRef.current?.setState('loading')}>
        Start Loading
      </button>
    </div>
  );
}
```

### Vue Integration

```vue
<template>
  <div>
    <button @click="setLoading">Start Loading</button>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { Cursor } from './cursor';

let cursor = null;

onMounted(() => {
  cursor = new Cursor({ size: 'medium' });
  cursor.mount();
});

onUnmounted(() => {
  cursor?.destroy();
});

const setLoading = () => {
  cursor?.setState('loading');
};
</script>
```

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="cursor.css">
</head>
<body>
  <button id="loadBtn">Start Loading</button>
  
  <script src="cursor.js"></script>
  <script>
    const cursor = new Cursor({ size: 'medium' });
    cursor.mount();
    
    document.getElementById('loadBtn').addEventListener('click', () => {
      cursor.setState('loading');
      
      setTimeout(() => {
        cursor.setState('default');
      }, 2000);
    });
  </script>
</body>
</html>
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure accessibility standards are met

## License

MIT License - feel free to use in personal and commercial projects.

## Credits

Created by [Lilit Petrosyan](https://github.com/LilitPietra)

Based on the CURSOR.md design specification.

---

**Made with ❤️ for better web experiences**
