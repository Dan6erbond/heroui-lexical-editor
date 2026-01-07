'use client';

import * as React from 'react';

import {
  Button,
  ButtonProps,
  Input,
  InputProps,
  Popover,
  PopoverContent,
  PopoverProps,
  PopoverTrigger,
  Select,
  SelectItem,
  Slider,
  cn,
  extendVariants,
} from '@heroui/react';

import { PipetteIcon } from 'lucide-react';

/**
 * @see https://gist.github.com/bkrmendy/f4582173f50fab209ddfef1377ab31e3
 */
interface EyeDropper {
  open: (options?: { signal?: AbortSignal }) => Promise<{ sRGBHex: string }>;
}

declare global {
  interface Window {
    EyeDropper?: {
      new (): EyeDropper;
    };
  }
}

const colorFormats = ['hex', 'rgb', 'hsl', 'hsb'] as const;
type ColorFormat = (typeof colorFormats)[number];

interface ColorValue {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface HSVColorValue {
  h: number;
  s: number;
  v: number;
  a: number;
}

function hexToRgb(hex: string, alpha?: number): ColorValue {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1] ?? '0', 16),
        g: Number.parseInt(result[2] ?? '0', 16),
        b: Number.parseInt(result[3] ?? '0', 16),
        a: alpha ?? 1,
      }
    : { r: 0, g: 0, b: 0, a: alpha ?? 1 };
}

function rgbToHex(color: ColorValue): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

function rgbToHsv(color: ColorValue): HSVColorValue {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  if (diff !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / diff) % 6;
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : diff / max;
  const v = max;

  return {
    h,
    s: Math.round(s * 100),
    v: Math.round(v * 100),
    a: color.a,
  };
}

function hsvToRgb(hsv: HSVColorValue): ColorValue {
  const h = hsv.h / 360;
  const s = hsv.s / 100;
  const v = hsv.v / 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r: number;
  let g: number;
  let b: number;

  switch (i % 6) {
    case 0: {
      r = v;
      g = t;
      b = p;
      break;
    }
    case 1: {
      r = q;
      g = v;
      b = p;
      break;
    }
    case 2: {
      r = p;
      g = v;
      b = t;
      break;
    }
    case 3: {
      r = p;
      g = q;
      b = v;
      break;
    }
    case 4: {
      r = t;
      g = p;
      b = v;
      break;
    }
    case 5: {
      r = v;
      g = p;
      b = q;
      break;
    }
    default: {
      r = 0;
      g = 0;
      b = 0;
    }
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a: hsv.a,
  };
}

function colorToString(color: ColorValue, format: ColorFormat = 'hex'): string {
  switch (format) {
    case 'hex':
      return rgbToHex(color);
    case 'rgb':
      return color.a < 1
        ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
        : `rgb(${color.r}, ${color.g}, ${color.b})`;
    case 'hsl': {
      const hsl = rgbToHsl(color);
      return color.a < 1 ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${color.a})` : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
    case 'hsb': {
      const hsv = rgbToHsv(color);
      return color.a < 1 ? `hsba(${hsv.h}, ${hsv.s}%, ${hsv.v}%, ${color.a})` : `hsb(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
    }
    default:
      return rgbToHex(color);
  }
}

function rgbToHsl(color: ColorValue) {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const sum = max + min;

  const l = sum / 2;

  let h = 0;
  let s = 0;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - sum) : diff / sum;

    if (max === r) {
      h = (g - b) / diff + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / diff + 2;
    } else if (max === b) {
      h = (r - g) / diff + 4;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(hsl: { h: number; s: number; l: number }, alpha = 1): ColorValue {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 1 / 6 && h < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 2 / 6 && h < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 3 / 6 && h < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 4 / 6 && h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 5 / 6 && h < 1) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a: alpha,
  };
}

function parseColorString(value: string): ColorValue | null {
  const trimmed = value.trim();

  // Parse hex colors
  if (trimmed.startsWith('#')) {
    const hexMatch = trimmed.match(/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/);
    if (hexMatch) {
      return hexToRgb(trimmed);
    }
  }

  // Parse rgb/rgba colors
  const rgbMatch = trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (rgbMatch) {
    return {
      r: Number.parseInt(rgbMatch[1] ?? '0', 10),
      g: Number.parseInt(rgbMatch[2] ?? '0', 10),
      b: Number.parseInt(rgbMatch[3] ?? '0', 10),
      a: rgbMatch[4] ? Number.parseFloat(rgbMatch[4]) : 1,
    };
  }

  // Parse hsl/hsla colors
  const hslMatch = trimmed.match(/^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (hslMatch) {
    const h = Number.parseInt(hslMatch[1] ?? '0', 10);
    const s = Number.parseInt(hslMatch[2] ?? '0', 10) / 100;
    const l = Number.parseInt(hslMatch[3] ?? '0', 10) / 100;
    const a = hslMatch[4] ? Number.parseFloat(hslMatch[4]) : 1;

    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0;
    let g = 0;
    let b = 0;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (h >= 300 && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
      a,
    };
  }

  // Parse hsb/hsba colors
  const hsbMatch = trimmed.match(/^hsba?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (hsbMatch) {
    const h = Number.parseInt(hsbMatch[1] ?? '0', 10);
    const s = Number.parseInt(hsbMatch[2] ?? '0', 10);
    const v = Number.parseInt(hsbMatch[3] ?? '0', 10);
    const a = hsbMatch[4] ? Number.parseFloat(hsbMatch[4]) : 1;

    return hsvToRgb({ h, s, v, a });
  }

  return null;
}

type Direction = 'ltr' | 'rtl';

const DirectionContext = React.createContext<Direction | undefined>(undefined);

function useDirection(dirProp?: Direction): Direction {
  const contextDir = React.useContext(DirectionContext);
  return dirProp ?? contextDir ?? 'ltr';
}

function useLazyRef<T>(fn: () => T) {
  const ref = React.useRef<T | null>(null);

  if (ref.current === null) {
    ref.current = fn();
  }

  return ref as React.RefObject<T>;
}

interface ColorPickerStoreState {
  color: ColorValue;
  hsv: HSVColorValue;
  open: boolean;
  format: ColorFormat;
}

interface ColorPickerStoreCallbacks {
  onColorChange?: (colorString: string) => void;
  onOpenChange?: (open: boolean) => void;
  onFormatChange?: (format: ColorFormat) => void;
}

interface ColorPickerStore {
  subscribe: (cb: () => void) => () => void;
  getState: () => ColorPickerStoreState;
  setColor: (value: ColorValue) => void;
  setHsv: (value: HSVColorValue) => void;
  setOpen: (value: boolean) => void;
  setFormat: (value: ColorFormat) => void;
  notify: () => void;
}

function createColorPickerStore(
  listenersRef: React.RefObject<Set<() => void>>,
  stateRef: React.RefObject<ColorPickerStoreState>,
  callbacks?: ColorPickerStoreCallbacks,
): ColorPickerStore {
  const store: ColorPickerStore = {
    subscribe: (cb) => {
      if (listenersRef.current) {
        listenersRef.current.add(cb);
        return () => listenersRef.current?.delete(cb);
      }
      return () => {};
    },
    getState: () =>
      stateRef.current || {
        color: { r: 0, g: 0, b: 0, a: 1 },
        hsv: { h: 0, s: 0, v: 0, a: 1 },
        open: false,
        format: 'hex' as ColorFormat,
      },
    setColor: (value: ColorValue) => {
      if (!stateRef.current) return;
      if (Object.is(stateRef.current.color, value)) return;

      const prevState = { ...stateRef.current };
      stateRef.current.color = value;

      if (callbacks?.onColorChange) {
        const colorString = colorToString(value, prevState.format);
        callbacks.onColorChange(colorString);
      }

      store.notify();
    },
    setHsv: (value: HSVColorValue) => {
      if (!stateRef.current) return;
      if (Object.is(stateRef.current.hsv, value)) return;

      const prevState = { ...stateRef.current };
      stateRef.current.hsv = value;

      if (callbacks?.onColorChange) {
        const colorValue = hsvToRgb(value);
        const colorString = colorToString(colorValue, prevState.format);
        callbacks.onColorChange(colorString);
      }

      store.notify();
    },
    setOpen: (value: boolean) => {
      if (!stateRef.current) return;
      if (Object.is(stateRef.current.open, value)) return;

      stateRef.current.open = value;

      if (callbacks?.onOpenChange) {
        callbacks.onOpenChange(value);
      }

      store.notify();
    },
    setFormat: (value: ColorFormat) => {
      if (!stateRef.current) return;
      if (Object.is(stateRef.current.format, value)) return;

      stateRef.current.format = value;

      if (callbacks?.onFormatChange) {
        callbacks.onFormatChange(value);
      }

      store.notify();
    },
    notify: () => {
      if (listenersRef.current) {
        for (const cb of listenersRef.current) {
          cb();
        }
      }
    },
  };

  return store;
}

function useColorPickerStoreContext(consumerName: string) {
  const context = React.useContext(ColorPickerStoreContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`ColorPickerRoot\``);
  }
  return context;
}

function useColorPickerStore<U>(selector: (state: ColorPickerStoreState) => U): U {
  const store = useColorPickerStoreContext('useColorPickerStoreSelector');

  const getSnapshot = React.useCallback(() => selector(store.getState()), [store, selector]);

  return React.useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

interface ColorPickerContextValue {
  dir: Direction;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

const ColorPickerStoreContext = React.createContext<ColorPickerStore | null>(null);
const ColorPickerContext = React.createContext<ColorPickerContextValue | null>(null);

function useColorPickerContext(consumerName: string) {
  const context = React.useContext(ColorPickerContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`ColorPickerRoot\``);
  }
  return context;
}

const InputGroupItem = extendVariants(Input, {
  variants: {
    position: {
      first: {
        inputWrapper: 'rounded-r-none border-r-0 shadow-none',
      },
      middle: {
        inputWrapper: 'rounded-none border-x-0 shadow-none',
      },
      last: {
        inputWrapper: 'rounded-l-none border-l-0 shadow-none',
      },
      isolated: {
        inputWrapper: 'shadow-none',
      },
    },
  },
  defaultVariants: {
    size: 'sm',
    variant: 'bordered',
  },
});

export interface ColorPickerRootProps
  extends Omit<React.ComponentProps<'div'>, 'onValueChange' | 'children' | 'color' | 'ref'>,
    PopoverProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  format?: ColorFormat;
  defaultFormat?: ColorFormat;
  onFormatChange?: (format: ColorFormat) => void;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

export const ColorPickerRoot = React.memo((props: ColorPickerRootProps) => {
  const {
    value: valueProp,
    defaultValue = '#000000',
    onValueChange,
    format: formatProp,
    defaultFormat = 'hex',
    onFormatChange,
    defaultOpen,
    isOpen: openProp,
    onOpenChange,
    name,
    disabled,
    readOnly,
    required,
    ...rootProps
  } = props;

  const initialColor = React.useMemo(() => {
    const colorString = valueProp ?? defaultValue;
    const color = hexToRgb(colorString);

    return {
      color,
      hsv: rgbToHsv(color),
      open: openProp ?? defaultOpen ?? false,
      format: formatProp ?? defaultFormat,
    };
  }, [valueProp, defaultValue, formatProp, defaultFormat, openProp, defaultOpen]);

  const stateRef = React.useRef(initialColor);
  const listenersRef = React.useRef(new Set<() => void>());

  const storeCallbacks = React.useMemo(
    () => ({
      onColorChange: onValueChange,
      onOpenChange: onOpenChange,
      onFormatChange: onFormatChange,
    }),
    [onValueChange, onOpenChange, onFormatChange],
  );

  const store = React.useMemo(() => createColorPickerStore(listenersRef, stateRef, storeCallbacks), [storeCallbacks]);

  return (
    <ColorPickerStoreContext.Provider value={store}>
      <ColorPickerRootImpl {...rootProps} value={valueProp} isOpen={openProp} onOpenChange={onOpenChange} />
    </ColorPickerStoreContext.Provider>
  );
});

interface ColorPickerRootImplProps
  extends Omit<
    ColorPickerRootProps,
    'defaultValue' | 'onValueChange' | 'format' | 'defaultFormat' | 'onFormatChange'
  > {}

function ColorPickerRootImpl(props: ColorPickerRootImplProps) {
  const {
    value: valueProp,
    isOpen: openProp,
    dir: dirProp,
    disabled,
    readOnly,
    required,
    onOpenChange,
    ...popoverProps
  } = props;

  const store = useColorPickerStoreContext('ColorPickerRootImpl');
  const open = useColorPickerStore((state) => state.open);

  const dir = useDirection(dirProp as Direction);

  const contextValue = React.useMemo<ColorPickerContextValue>(
    () => ({
      dir,
      disabled,
      readOnly,
      required,
    }),
    [dir, disabled, readOnly, required],
  );

  React.useEffect(() => {
    if (valueProp !== undefined) {
      const currentState = store.getState();
      const color = hexToRgb(valueProp, currentState.color.a);
      store.setColor(color);
      store.setHsv(rgbToHsv(color));
    }
  }, [valueProp, store]);

  React.useEffect(() => {
    if (openProp !== undefined) store.setOpen(openProp);
  }, [openProp, store]);

  const handleOpenChange = (newOpen: boolean) => {
    store.setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <ColorPickerContext.Provider value={contextValue}>
      <Popover
        {...popoverProps}
        isOpen={open}
        onOpenChange={handleOpenChange}
        placement={popoverProps.placement ?? 'bottom'}
      />
    </ColorPickerContext.Provider>
  );
}

export function ColorPickerTrigger({ ...props }: ButtonProps) {
  return (
    <PopoverTrigger>
      <Button data-slot="color-picker-trigger" {...props} />
    </PopoverTrigger>
  );
}

export function ColorPickerContent({ className, children, ...props }: React.ComponentProps<'div'>) {
  const contentClasses = cn('flex w-[320px] flex-col gap-4 p-4', className);

  return (
    <PopoverContent className={contentClasses} {...(props as any)}>
      {children}
    </PopoverContent>
  );
}

export function ColorPickerArea({ className, ...props }: React.ComponentProps<'div'>) {
  const store = useColorPickerStoreContext('ColorPickerArea');
  const hsv = useColorPickerStore((state) => state.hsv);
  const areaRef = React.useRef<HTMLDivElement>(null);

  const update = (clientX: number, clientY: number) => {
    if (!areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const newHsv = {
      ...hsv,
      s: Math.round(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * 100),
      v: Math.round(Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height)) * 100),
    };
    store.setHsv(newHsv);
    store.setColor(hsvToRgb(newHsv));
  };

  const backgroundHue = hsvToRgb({ h: hsv.h, s: 100, v: 100, a: 1 });

  return (
    <div
      ref={areaRef}
      className={cn(
        'relative h-40 w-full cursor-crosshair rounded-lg border border-default-200 overflow-hidden',
        className,
      )}
      onPointerDown={(e) => {
        areaRef.current?.setPointerCapture(e.pointerId);
        update(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (e.buttons === 1) update(e.clientX, e.clientY);
      }}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `rgb(${backgroundHue.r}, ${backgroundHue.g}, ${backgroundHue.b})`,
        }}
      />
      <div className="absolute inset-0 bg-linear-to-r from-white to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-black to-transparent" />
      <div
        className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm"
        style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%` }}
      />
    </div>
  );
}

export function ColorPickerHueSlider() {
  const store = useColorPickerStoreContext('HueSlider');
  const hsv = useColorPickerStore((state) => state.hsv);

  return (
    <Slider
      aria-label="Hue"
      size="sm"
      minValue={0}
      maxValue={360}
      value={hsv.h}
      onChange={(v) => {
        const next = { ...hsv, h: v as number };
        store.setHsv(next);
        store.setColor(hsvToRgb(next));
      }}
      classNames={{
        filler: 'bg-transparent',
        track:
          'h-3 bg-[linear-gradient(to_right,#ff0000_0%,#ffff00_16.66%,#00ff00_33.33%,#00ffff_50%,#0000ff_66.66%,#ff00ff_83.33%,#ff0000_100%)] [border-inline-start-width:0]',
        thumb: 'bg-background border-2 border-default-300 shadow-small',
      }}
    />
  );
}

export function ColorPickerAlphaSlider() {
  const context = useColorPickerContext('ColorPickerAlphaSlider');
  const store = useColorPickerStoreContext('ColorPickerAlphaSlider');

  const color = useColorPickerStore((state) => state.color);
  const hsv = useColorPickerStore((state) => state.hsv);

  const onValueChange = React.useCallback(
    (value: number | number[]) => {
      // HeroUI Slider returns number or number[], we ensure we get the scalar
      const val = Array.isArray(value) ? value[0] : value;
      const alpha = (val ?? 0) / 100;

      // Crucial: Update both to keep store internal states in sync
      store.setColor({ ...color, a: alpha });
      store.setHsv({ ...hsv, a: alpha });
    },
    [color, hsv, store],
  );

  const trackImage = `linear-gradient(to right, transparent, rgb(${color.r}, ${color.g}, ${color.b})),
    repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)`;

  return (
    <Slider
      aria-label="Alpha"
      size="sm"
      minValue={0}
      maxValue={100}
      step={1}
      isDisabled={context.disabled}
      value={Math.round((color?.a ?? 1) * 100)}
      onChange={onValueChange}
      style={
        {
          '--alpha-img': trackImage,
          '--alpha-size': 'auto, 8px 8px',
        } as React.CSSProperties
      }
      classNames={{
        base: 'max-w-full',
        track:
          'h-3 !bg-[image:var(--alpha-img)] !bg-[length:var(--alpha-size)] !bg-none border-none [border-inline-start-width:0] ring-1 ring-default-200',
        filler: 'bg-transparent',
      }}
      renderThumb={(props) => (
        <div
          {...props}
          className="group p-1 top-1/2 bg-background border-small border-default-200 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
        >
          <span
            className="transition-transform rounded-full w-3 h-3 block group-data-[dragging=true]:scale-80"
            style={{
              backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
            }}
          />
        </div>
      )}
    />
  );
}

export function ColorPickerSwatch({ className, ...props }: React.ComponentProps<'div'>) {
  const color = useColorPickerStore((state) => state.color);
  const bg =
    color.a < 1
      ? `linear-gradient(rgba(${color.r},${color.g},${color.b},${color.a}), rgba(${color.r},${color.g},${color.b},${color.a})), repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0% 50% / 8px 8px`
      : `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

  return <div className={cn('size-8 rounded border shadow-sm', className)} style={{ background: bg }} {...props} />;
}

export function ColorPickerEyeDropper(props: ButtonProps) {
  const context = useColorPickerContext('ColorPickerEyeDropper');
  const store = useColorPickerStoreContext('ColorPickerEyeDropper');

  const color = useColorPickerStore((state) => state.color);

  const onEyeDropper = React.useCallback(async () => {
    if (!window.EyeDropper) return;

    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();

      if (result.sRGBHex) {
        const currentAlpha = color?.a ?? 1;
        const newColor = hexToRgb(result.sRGBHex, currentAlpha);
        const newHsv = rgbToHsv(newColor);
        store.setColor(newColor);
        store.setHsv(newHsv);
      }
    } catch (error) {
      console.warn('EyeDropper error:', error);
    }
  }, [color, store]);

  const hasEyeDropper = typeof window !== 'undefined' && !!window.EyeDropper;

  if (!hasEyeDropper) return null;

  return (
    <Button isIconOnly size="sm" variant="bordered" onPress={onEyeDropper} disabled={context.disabled} {...props}>
      <PipetteIcon className="size-4" />
    </Button>
  );
}

export function ColorPickerFormatSelect() {
  const store = useColorPickerStoreContext('FormatSelect');
  const format = useColorPickerStore((state) => state.format);

  return (
    <Select
      size="sm"
      className="w-24"
      selectedKeys={[format]}
      onSelectionChange={(keys) => store.setFormat(Array.from(keys)[0] as ColorFormat)}
    >
      {colorFormats.map((f) => (
        <SelectItem key={f}>{f.toUpperCase()}</SelectItem>
      ))}
    </Select>
  );
}

export interface ColorPickerInputProps extends Omit<InputProps, 'value' | 'onValueChange'> {
  withoutAlpha?: boolean;
}

interface FormatInputProps extends ColorPickerInputProps {
  onColorChange: (color: ColorValue) => void;
}

export function ColorPickerInput({ withoutAlpha, ...props }: ColorPickerInputProps) {
  const store = useColorPickerStoreContext('ColorPickerInput');
  const color = useColorPickerStore((state) => state.color);
  const format = useColorPickerStore((state) => state.format);
  const hsv = useColorPickerStore((state) => state.hsv);

  const onColorChange = React.useCallback(
    (next: ColorValue) => {
      store.setColor(next);
      store.setHsv(rgbToHsv(next));
    },
    [store],
  );

  const sharedProps = { ...props, withoutAlpha, onColorChange };

  switch (format) {
    case 'hex':
      return <HexInput colorValue={color} {...sharedProps} />;
    case 'rgb':
      return <RgbInput colorValue={color} {...sharedProps} />;
    case 'hsl':
      return <HslInput colorValue={color} {...sharedProps} />;
    case 'hsb':
      return <HsbInput hsvValue={hsv} {...sharedProps} />;
    default:
      return null;
  }
}

function HexInput({
  colorValue,
  onColorChange,
  withoutAlpha,
  className,
  ...props
}: FormatInputProps & { colorValue: ColorValue }) {
  return (
    <div className={cn('flex items-center', className)}>
      <InputGroupItem
        position={withoutAlpha ? 'isolated' : 'first'}
        value={rgbToHex(colorValue)}
        onChange={(e) => {
          const p = parseColorString(e.target.value);
          if (p) onColorChange({ ...p, a: colorValue.a });
        }}
        {...props}
      />
      {!withoutAlpha && (
        <InputGroupItem
          position="last"
          className="w-16"
          value={Math.round(colorValue.a * 100).toString()}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val)) onColorChange({ ...colorValue, a: val / 100 });
          }}
          {...props}
        />
      )}
    </div>
  );
}

function RgbInput({
  colorValue,
  onColorChange,
  withoutAlpha,
  className,
  ...props
}: FormatInputProps & { colorValue: ColorValue }) {
  const update = (c: keyof ColorValue, v: string) => {
    const val = parseInt(v, 10);
    if (!isNaN(val)) {
      onColorChange({ ...colorValue, [c]: c === 'a' ? val / 100 : val });
    }
  };

  return (
    <div className={cn('flex items-center', className)}>
      <InputGroupItem
        position="first"
        value={colorValue.r.toString()}
        onChange={(e) => update('r', e.target.value)}
        {...props}
      />
      <InputGroupItem
        position="middle"
        value={colorValue.g.toString()}
        onChange={(e) => update('g', e.target.value)}
        {...props}
      />
      <InputGroupItem
        position={withoutAlpha ? 'last' : 'middle'}
        value={colorValue.b.toString()}
        onChange={(e) => update('b', e.target.value)}
        {...props}
      />
      {!withoutAlpha && (
        <InputGroupItem
          position="last"
          value={Math.round(colorValue.a * 100).toString()}
          onChange={(e) => update('a', e.target.value)}
          {...props}
        />
      )}
    </div>
  );
}

function HslInput({
  colorValue,
  onColorChange,
  withoutAlpha,
  className,
  ...props
}: FormatInputProps & { colorValue: ColorValue }) {
  const hsl = React.useMemo(() => rgbToHsl(colorValue), [colorValue]);

  const update = (c: keyof typeof hsl, v: string) => {
    const val = parseInt(v, 10);
    if (!isNaN(val)) onColorChange(hslToRgb({ ...hsl, [c]: val }, colorValue.a));
  };

  return (
    <div className={cn('flex items-center', className)}>
      <InputGroupItem
        position="first"
        value={hsl.h.toString()}
        onChange={(e) => update('h', e.target.value)}
        {...props}
      />
      <InputGroupItem
        position="middle"
        value={hsl.s.toString()}
        onChange={(e) => update('s', e.target.value)}
        {...props}
      />
      <InputGroupItem
        position={withoutAlpha ? 'last' : 'middle'}
        value={hsl.l.toString()}
        onChange={(e) => update('l', e.target.value)}
        {...props}
      />
      {!withoutAlpha && (
        <InputGroupItem
          position="last"
          value={Math.round(colorValue.a * 100).toString()}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val)) onColorChange({ ...colorValue, a: val / 100 });
          }}
          {...props}
        />
      )}
    </div>
  );
}

function HsbInput({
  hsvValue,
  onColorChange,
  withoutAlpha,
  className,
  ...props
}: FormatInputProps & { hsvValue: HSVColorValue }) {
  const update = (c: keyof HSVColorValue, v: string) => {
    const val = parseInt(v, 10);
    if (!isNaN(val)) {
      const nextHsv = { ...hsvValue, [c]: val };
      onColorChange(hsvToRgb(nextHsv));
    }
  };

  return (
    <div className={cn('flex items-center', className)}>
      <InputGroupItem
        position="first"
        className="w-14"
        value={hsvValue.h.toString()}
        onChange={(e) => update('h', e.target.value)}
        {...props}
      />
      <InputGroupItem
        position="middle"
        className="w-14"
        value={hsvValue.s.toString()}
        onChange={(e) => update('s', e.target.value)}
        {...props}
      />
      <InputGroupItem
        position={withoutAlpha ? 'last' : 'middle'}
        className="w-14"
        value={hsvValue.v.toString()}
        onChange={(e) => update('v', e.target.value)}
        {...props}
      />
      {!withoutAlpha && (
        <InputGroupItem
          position="last"
          className="w-14"
          value={Math.round(hsvValue.a * 100).toString()}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val)) {
              onColorChange({ ...hsvToRgb(hsvValue), a: val / 100 });
            }
          }}
          {...props}
        />
      )}
    </div>
  );
}

export {
  ColorPickerAlphaSlider as AlphaSlider,
  ColorPickerArea as Area,
  ColorPickerRoot as ColorPicker,
  ColorPickerContent as Content,
  ColorPickerEyeDropper as EyeDropper,
  ColorPickerFormatSelect as FormatSelect,
  ColorPickerHueSlider as HueSlider,
  ColorPickerInput as Input,
  ColorPickerRoot as Root,
  ColorPickerSwatch as Swatch,
  ColorPickerTrigger as Trigger,
  useColorPickerStore as useColorPicker,
};
