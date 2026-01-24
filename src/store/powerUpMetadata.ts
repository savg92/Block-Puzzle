import { PowerUpType } from './gameStore';

export interface PowerUpMetadata {
  type: PowerUpType;
  icon: string;
  label: string;
  description: string;
}

export const POWER_UP_METADATA: Record<PowerUpType, PowerUpMetadata> = {
  undo: {
    type: 'undo',
    icon: '↩️',
    label: 'Undo',
    description: 'Revert your last move',
  },
  rotate: {
    type: 'rotate',
    icon: '🔄',
    label: 'Rotate',
    description: 'Rotate all pieces in tray',
  },
  discard: {
    type: 'discard',
    icon: '🗑️',
    label: 'Discard',
    description: 'Remove a piece from tray',
  },
  forcePlace: {
    type: 'forcePlace',
    icon: '⚡',
    label: 'Force',
    description: 'Place a piece anywhere',
  },
  addSingle: {
    type: 'addSingle',
    icon: '➕',
    label: 'Single',
    description: 'Place a single block',
  },
};
