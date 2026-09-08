import type { IconName } from '@/components/ui/Icon';
import type { ScreenId } from './types';

export interface NavItem {
  id: ScreenId;
  label: string;
  icon: IconName;
  description: string;
}

export const NAV: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: 'grid', description: 'Today at a glance' },
  { id: 'receptionist', label: 'AI Receptionist', icon: 'headset', description: 'Live call simulation' },
  { id: 'appointments', label: 'Appointments', icon: 'calendar', description: 'Bookings and slots' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'message', description: 'Confirmations and reminders' },
  { id: 'analytics', label: 'Call Analytics', icon: 'bar-chart', description: 'Volume and outcomes' },
  { id: 'how-it-works', label: 'How It Works', icon: 'route', description: 'Routing and rollout' },
];

export const SCREEN_IDS = NAV.map((n) => n.id);

export function isScreenId(value: string): value is ScreenId {
  return (SCREEN_IDS as string[]).includes(value);
}
