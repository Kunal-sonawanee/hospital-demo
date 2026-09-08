import type { SVGProps } from 'react';

export type IconName =
  | 'grid'
  | 'phone'
  | 'phone-off'
  | 'phone-incoming'
  | 'calendar'
  | 'message'
  | 'bar-chart'
  | 'route'
  | 'play'
  | 'check'
  | 'check-circle'
  | 'x'
  | 'chevron-down'
  | 'chevron-right'
  | 'clock'
  | 'map-pin'
  | 'user'
  | 'users'
  | 'bell'
  | 'plus'
  | 'sparkles'
  | 'arrow-right'
  | 'arrow-down'
  | 'shield'
  | 'search'
  | 'activity'
  | 'hospital'
  | 'headset'
  | 'refresh'
  | 'menu'
  | 'zap'
  | 'info'
  | 'lock'
  | 'whatsapp';

const PATHS: Record<IconName, string[]> = {
  grid: ['M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'],
  phone: [
    'M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z',
  ],
  'phone-off': [
    'M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.4 19.4 0 0 1-3.33-2.67',
    'M5.3 9.5A19.6 19.6 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91',
    'M2 2l20 20',
  ],
  'phone-incoming': ['M16 2v6h6', 'M22 2l-6 6', 'M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z'],
  calendar: ['M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4', 'M8 2v4', 'M3 10h18'],
  message: [
    'M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z',
  ],
  'bar-chart': ['M12 20V10', 'M18 20V4', 'M6 20v-4'],
  route: [
    'M6 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    'M9 19h5.5a3.5 3.5 0 0 0 0-7h-4a3.5 3.5 0 0 1 0-7H15',
  ],
  play: ['M6 4.5v15l12-7.5z'],
  check: ['M20 6 9 17l-5-5'],
  'check-circle': ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'm8.5 12.2 2.4 2.4 4.6-4.9'],
  x: ['M18 6 6 18', 'M6 6l12 12'],
  'chevron-down': ['m6 9 6 6 6-6'],
  'chevron-right': ['m9 6 6 6-6 6'],
  clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6.5V12l3.5 2'],
  'map-pin': ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z', 'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  user: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  users: ['M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  bell: ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.7 21a2 2 0 0 1-3.4 0'],
  plus: ['M12 5v14', 'M5 12h14'],
  sparkles: [
    'M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7z',
    'M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z',
  ],
  'arrow-right': ['M5 12h14', 'm12 5 7 7-7 7'],
  'arrow-down': ['M12 5v14', 'm5 12 7 7 7-7'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'm21 21-4.3-4.3'],
  activity: ['M22 12h-4l-3 9L9 3l-3 9H2'],
  hospital: ['M3 21h18', 'M5 21V8l7-4 7 4v13', 'M10 21v-4h4v4', 'M12 8.5v3.5', 'M10.25 10.25h3.5'],
  headset: [
    'M3 15v-3a9 9 0 0 1 18 0v3',
    'M21 16.5a2.5 2.5 0 0 1-2.5 2.5H18v-7h.5A2.5 2.5 0 0 1 21 14.5z',
    'M3 16.5A2.5 2.5 0 0 0 5.5 19H6v-7h-.5A2.5 2.5 0 0 0 3 14.5z',
  ],
  refresh: ['M3 12a9 9 0 0 1 15.3-6.4L21 8', 'M21 3.5V8h-4.5', 'M21 12a9 9 0 0 1-15.3 6.4L3 16', 'M3 20.5V16h4.5'],
  menu: ['M3 6h18', 'M3 12h18', 'M3 18h18'],
  zap: ['M13 2 3 14h9l-1 8 10-12h-9z'],
  info: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 16.5V12', 'M12 8h.01'],
  lock: ['M5 11a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z', 'M8 9V6.5a4 4 0 0 1 8 0V9'],
  whatsapp: [
    'M12.04 2C6.6 2 2.18 6.4 2.18 11.82c0 1.9.53 3.68 1.46 5.2L2 22l5.13-1.6a9.9 9.9 0 0 0 4.9 1.27h.01c5.44 0 9.86-4.4 9.86-9.82S17.48 2 12.04 2z',
  ],
};

const FILLED: Partial<Record<IconName, boolean>> = { play: true, whatsapp: true, grid: true };

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}

export function Icon({ name, size = 18, strokeWidth = 1.7, ...rest }: IconProps) {
  const filled = FILLED[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
