import type {
  CursorOptions,
  CursorState,
  CursorSize,
  CursorShape,
  Position,
  CursorStateChangeEvent,
} from './types';

/**
 * Cursor - A lightweight, accessible UI utility for custom cursor behavior
 * 
 * Features:
 * - Multiple cursor states (default, hover, active, focus-visible, disabled, loading)
 * - Performance-optimized with RAF and transforms
 * - Accessibility support (keyboard focus, reduced motion, screen readers)
 * - Touch device detection
 * - Framework-agnostic
 */
export class Cursor {
  private element: HTMLDivElement | null = null;
  private currentState: CursorState = 'default';
  private currentSize: CursorSize = 'medium';
  private currentShape: CursorShape = 'circle';
  private currentPosition: Position = { x: 0, y: 0 };
  private rafId: number | null = null;
  private isEnabled: boolean = true;
  private isMounted: boolean = false;
  private eventListeners: Map<string, EventListener> = new Map();
  
  private readonly options: Required<CursorOptions>;
  private readonly defaultOptions: Required<CursorOptions> = {
    size: 'medium',
    shape: 'circle',
    initialState: 'default',
    enabled: true,
    disableOnTouch: true,
    transitionDuration: 100,
    trackFocus: true,
    customClass: '',
    zIndex: 9999,
  };

  constructor(options: CursorOptions = {}) {
    this.options = { ...this.defaultOptions, ...options };
    this.currentSize = this.options.size;
    this.currentShape = this.options.shape;
    this.currentState = this.options.initialState;
    this.isEnabled = this.options.enabled;

    // Detect touch device
    if (this.options.disableOnTouch && this.isTouchDevice()) {
      this.isEnabled = false;
    }

    // Check for reduced motion preference
    if (this.prefersReducedMotion()) {
      // Reduced motion is handled via CSS
    }
  }

  /**
   * Mount the cursor to the DOM
   */
  public mount(container: HTMLElement = document.body): void {
    if (this.isMounted || !this.isEnabled) {
      return;
    }

    this.createElement();
    
    if (this.element) {
      container.appendChild(this.element);
      this.setupEventListeners();
      document.body.classList.add('custom-cursor-active');
      this.isMounted = true;

      // Dispatch mount event
      this.dispatchEvent('mount', undefined);

      // Start tracking focus if enabled
      if (this.options.trackFocus) {
        this.setupFocusTracking();
      }
    }
  }

  /**
   * Destroy the cursor and clean up
   */
  public destroy(): void {
    if (!this.isMounted) {
      return;
    }

    this.removeEventListeners();
    
    if (this.element && this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    document.body.classList.remove('custom-cursor-active');
    this.isMounted = false;
    this.element = null;

    // Dispatch destroy event
    this.dispatchEvent('destroy', undefined);
  }

  /**
   * Set the cursor state
   */
  public setState(state: CursorState): void {
    if (this.currentState === state || !this.element) {
      return;
    }

    const previousState = this.currentState;
    this.currentState = state;
    this.element.setAttribute('data-state', state);

    // Dispatch state change event
    const detail: CursorStateChangeEvent = {
      previousState,
      currentState: state,
      timestamp: Date.now(),
    };
    this.dispatchEvent('statechange', detail);

    // Announce state change for screen readers (only for important states)
    if (['disabled', 'loading', 'focus-visible'].includes(state)) {
      this.announceState(state);
    }
  }

  /**
   * Get current cursor state
   */
  public getState(): CursorState {
    return this.currentState;
  }

  /**
   * Set cursor size
   */
  public setSize(size: CursorSize): void {
    if (this.currentSize === size || !this.element) {
      return;
    }

    this.currentSize = size;
    this.element.setAttribute('data-size', size);
  }

  /**
   * Get current cursor size
   */
  public getSize(): CursorSize {
    return this.currentSize;
  }

  /**
   * Set cursor shape
   */
  public setShape(shape: CursorShape): void {
    if (this.currentShape === shape || !this.element) {
      return;
    }

    this.currentShape = shape;
    this.element.setAttribute('data-shape', shape);
  }

  /**
   * Get current cursor shape
   */
  public getShape(): CursorShape {
    return this.currentShape;
  }

  /**
   * Set cursor position (used internally, but can be called externally)
   */
  public setPosition(x: number, y: number): void {
    this.currentPosition = { x, y };
    this.updatePosition();
  }

  /**
   * Enable the cursor
   */
  public enable(): void {
    if (this.isEnabled) {
      return;
    }

    this.isEnabled = true;
    if (this.element) {
      this.element.classList.remove('hidden');
      document.body.classList.add('custom-cursor-active');
    }
  }

  /**
   * Disable the cursor
   */
  public disable(): void {
    if (!this.isEnabled) {
      return;
    }

    this.isEnabled = false;
    if (this.element) {
      this.element.classList.add('hidden');
      document.body.classList.remove('custom-cursor-active');
    }
  }

  /**
   * Check if cursor is currently enabled
   */
  public isActive(): boolean {
    return this.isEnabled && this.isMounted;
  }

  /**
   * Create the cursor DOM element
   */
  private createElement(): void {
    this.element = document.createElement('div');
    this.element.className = 'custom-cursor';
    
    if (this.options.customClass) {
      this.element.classList.add(this.options.customClass);
    }

    this.element.setAttribute('data-state', this.currentState);
    this.element.setAttribute('data-size', this.currentSize);
    this.element.setAttribute('data-shape', this.currentShape);
    this.element.setAttribute('aria-hidden', 'true');
    this.element.style.zIndex = this.options.zIndex.toString();

    // Create live region for screen reader announcements
    const liveRegion = document.createElement('div');
    liveRegion.className = 'cursor-sr-only';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0;';
    this.element.appendChild(liveRegion);
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    const handleMouseMove = (e: MouseEvent) => {
      this.currentPosition = { x: e.clientX, y: e.clientY };
      this.scheduleUpdate();
    };

    const handleMouseDown = () => {
      if (this.currentState !== 'disabled') {
        this.setState('active');
      }
    };

    const handleMouseUp = () => {
      if (this.currentState === 'active') {
        this.setState('default');
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, [role="button"], input, textarea, select')) {
        if (this.currentState === 'default') {
          this.setState('hover');
        }
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, [role="button"], input, textarea, select')) {
        if (this.currentState === 'hover') {
          this.setState('default');
        }
      }
    };

    // Use passive listeners for better performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    this.eventListeners.set('mousemove', handleMouseMove);
    this.eventListeners.set('mousedown', handleMouseDown);
    this.eventListeners.set('mouseup', handleMouseUp);
    this.eventListeners.set('mouseenter', handleMouseEnter);
    this.eventListeners.set('mouseleave', handleMouseLeave);
  }

  /**
   * Setup focus tracking for keyboard navigation
   */
  private setupFocusTracking(): void {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if focus is via keyboard (focus-visible)
      if (this.isFocusVisible(target)) {
        this.setState('focus-visible');
        
        // Position cursor near focused element
        const rect = target.getBoundingClientRect();
        this.setPosition(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    };

    const handleFocusOut = () => {
      if (this.currentState === 'focus-visible') {
        this.setState('default');
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    this.eventListeners.set('focusin', handleFocusIn as EventListener);
    this.eventListeners.set('focusout', handleFocusOut as EventListener);
  }

  /**
   * Remove all event listeners
   */
  private removeEventListeners(): void {
    this.eventListeners.forEach((listener, eventName) => {
      if (eventName === 'mouseenter' || eventName === 'mouseleave') {
        document.removeEventListener(eventName, listener, true);
      } else {
        document.removeEventListener(eventName, listener);
      }
    });
    this.eventListeners.clear();
  }

  /**
   * Schedule position update using RAF
   */
  private scheduleUpdate(): void {
    if (this.rafId !== null) {
      return;
    }

    this.rafId = requestAnimationFrame(() => {
      this.updatePosition();
      this.rafId = null;
    });
  }

  /**
   * Update cursor position using transform
   */
  private updatePosition(): void {
    if (!this.element) {
      return;
    }

    const { x, y } = this.currentPosition;
    this.element.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  }

  /**
   * Check if device is touch-enabled
   */
  private isTouchDevice(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore - for older browsers
      navigator.msMaxTouchPoints > 0
    );
  }

  /**
   * Check if user prefers reduced motion
   */
  private prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Check if element has focus-visible state
   */
  private isFocusVisible(element: HTMLElement): boolean {
    // Modern browsers support :focus-visible
    try {
      return element.matches(':focus-visible');
    } catch {
      // Fallback: assume keyboard focus if element is focusable
      return element.matches(':focus');
    }
  }

  /**
   * Announce state change to screen readers
   */
  private announceState(state: CursorState): void {
    if (!this.element) {
      return;
    }

    const liveRegion = this.element.querySelector('[role="status"]') as HTMLElement;
    if (liveRegion) {
      const messages: Record<string, string> = {
        'disabled': 'Cursor disabled',
        'loading': 'Loading',
        'focus-visible': 'Element focused',
      };

      liveRegion.textContent = messages[state] || '';
      
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  /**
   * Dispatch custom event
   */
  private dispatchEvent<T>(eventName: string, detail: T): void {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true,
    });
    
    if (this.element) {
      this.element.dispatchEvent(event);
    } else {
      document.dispatchEvent(event);
    }
  }

  /**
   * Add event listener to cursor
   */
  public on(eventName: string, callback: EventListener): void {
    if (this.element) {
      this.element.addEventListener(eventName, callback);
    }
  }

  /**
   * Remove event listener from cursor
   */
  public off(eventName: string, callback: EventListener): void {
    if (this.element) {
      this.element.removeEventListener(eventName, callback);
    }
  }
}

// Export as default
export default Cursor;
