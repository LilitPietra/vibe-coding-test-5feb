/**
 * Cursor state types
 */
export type CursorState = 
  | 'default'
  | 'hover'
  | 'active'
  | 'focus-visible'
  | 'disabled'
  | 'loading';

/**
 * Cursor size options
 */
export type CursorSize = 'small' | 'medium' | 'large';

/**
 * Cursor shape options
 */
export type CursorShape = 'circle' | 'square' | 'rounded-square' | 'arrow' | 'pointer';

/**
 * Configuration options for the Cursor component
 */
export interface CursorOptions {
  /**
   * Initial cursor size
   * @default 'medium'
   */
  size?: CursorSize;

  /**
   * Cursor shape
   * @default 'circle'
   */
  shape?: CursorShape;

  /**
   * Initial cursor state
   * @default 'default'
   */
  initialState?: CursorState;

  /**
   * Enable/disable custom cursor
   * @default true
   */
  enabled?: boolean;

  /**
   * Automatically disable on touch devices
   * @default true
   */
  disableOnTouch?: boolean;

  /**
   * Smooth movement transition duration in ms
   * @default 100
   */
  transitionDuration?: number;

  /**
   * Enable keyboard focus tracking
   * @default true
   */
  trackFocus?: boolean;

  /**
   * Custom CSS class to add to cursor element
   */
  customClass?: string;

  /**
   * Z-index for cursor element
   * @default 9999
   */
  zIndex?: number;
}

/**
 * Event detail for state change events
 */
export interface CursorStateChangeEvent {
  previousState: CursorState;
  currentState: CursorState;
  timestamp: number;
}

/**
 * Position coordinates
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Cursor component event map
 */
export interface CursorEvents {
  statechange: CustomEvent<CursorStateChangeEvent>;
  mount: CustomEvent<void>;
  destroy: CustomEvent<void>;
}
