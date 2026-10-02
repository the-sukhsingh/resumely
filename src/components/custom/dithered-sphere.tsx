'use client';

import { useId, useMemo } from 'react';

export const DITHER_PALETTES = {
  lime: {
    name: 'Lime',
    l0: '#1c1e00',
    l1: '#4a5200',
    l2: '#9da800',
    l3: '#f4f300',
    glow: 'rgba(244, 243, 0, 0.4)',
    border: 'rgba(244, 243, 0, 0.25)',
  },
  cyan: {
    name: 'Cyan',
    l0: '#032030',
    l1: '#0369a1',
    l2: '#0284c7',
    l3: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.4)',
    border: 'rgba(56, 189, 248, 0.25)',
  },
  violet: {
    name: 'Violet',
    l0: '#1e0836',
    l1: '#581c87',
    l2: '#9333ea',
    l3: '#d8b4fe',
    glow: 'rgba(216, 180, 254, 0.4)',
    border: 'rgba(216, 180, 254, 0.25)',
  },
  rose: {
    name: 'Rose',
    l0: '#380614',
    l1: '#881337',
    l2: '#e11d48',
    l3: '#fda4af',
    glow: 'rgba(253, 164, 175, 0.4)',
    border: 'rgba(253, 164, 175, 0.25)',
  },
  emerald: {
    name: 'Emerald',
    l0: '#022116',
    l1: '#065f46',
    l2: '#059669',
    l3: '#6ee7b7',
    glow: 'rgba(110, 231, 183, 0.4)',
    border: 'rgba(110, 231, 183, 0.25)',
  },
  amber: {
    name: 'Amber',
    l0: '#2b1103',
    l1: '#78350f',
    l2: '#d97706',
    l3: '#fde68a',
    glow: 'rgba(253, 230, 138, 0.4)',
    border: 'rgba(253, 230, 138, 0.25)',
  },
  indigo: {
    name: 'Indigo',
    l0: '#0f0f33',
    l1: '#312e81',
    l2: '#4f46e5',
    l3: '#a5b4fc',
    glow: 'rgba(165, 180, 252, 0.4)',
    border: 'rgba(165, 180, 252, 0.25)',
  },
  orange: {
    name: 'Orange',
    l0: '#330e03',
    l1: '#7c2d12',
    l2: '#ea580c',
    l3: '#fed7aa',
    glow: 'rgba(254, 215, 170, 0.4)',
    border: 'rgba(254, 215, 170, 0.25)',
  },
  teal: {
    name: 'Teal',
    l0: '#032420',
    l1: '#115e59',
    l2: '#0d9488',
    l3: '#5eead4',
    glow: 'rgba(94, 234, 212, 0.4)',
    border: 'rgba(94, 234, 212, 0.25)',
  },
  fuchsia: {
    name: 'Fuchsia',
    l0: '#330536',
    l1: '#701a75',
    l2: '#c026d3',
    l3: '#f5d0fe',
    glow: 'rgba(245, 208, 254, 0.4)',
    border: 'rgba(245, 208, 254, 0.25)',
  },
} as const;

export type DitherColor = keyof typeof DITHER_PALETTES;

const PALETTE_KEYS = Object.keys(DITHER_PALETTES) as DitherColor[];

// Highly textured 8x8 Bayer ordered dithering paths for 4-tone 3D sphere
// Generated on a 48x48 pixel grid (r=22.5, cx=23.5, cy=23.5)
const PATH_L1 = 'M18,2h1v1h-1zM20,2h1v1h-1zM22,2h1v1h-1zM24,2h1v1h-1zM26,2h1v1h-1zM27,2h1v1h-1zM28,2h1v1h-1zM30,2h1v1h-1zM19,3h1v1h-1zM21,3h1v1h-1zM23,3h1v1h-1zM25,3h1v1h-1zM27,3h1v1h-1zM29,3h1v1h-1zM31,3h1v1h-1zM16,4h1v1h-1zM18,4h1v1h-1zM20,4h1v1h-1zM21,4h1v1h-1zM22,4h1v1h-1zM23,4h1v1h-1zM24,4h1v1h-1zM25,4h1v1h-1zM26,4h1v1h-1zM27,4h1v1h-1zM28,4h1v1h-1zM29,4h1v1h-1zM30,4h1v1h-1zM31,4h1v1h-1zM32,4h1v1h-1zM33,4h1v1h-1zM34,4h1v1h-1zM17,5h1v1h-1zM19,5h1v1h-1zM21,5h1v1h-1zM23,5h1v1h-1zM24,5h1v1h-1zM25,5h1v1h-1zM26,5h1v1h-1zM27,5h1v1h-1zM28,5h1v1h-1zM29,5h1v1h-1zM30,5h1v1h-1zM31,5h1v1h-1zM32,5h1v1h-1zM33,5h1v1h-1zM34,5h1v1h-1zM35,5h1v1h-1zM36,5h1v1h-1zM14,6h1v1h-1zM16,6h1v1h-1zM18,6h1v1h-1zM19,6h1v1h-1zM20,6h1v1h-1zM21,6h1v1h-1zM22,6h1v1h-1zM23,6h1v1h-1zM24,6h1v1h-1zM25,6h1v1h-1zM27,6h1v1h-1zM28,6h1v1h-1zM29,6h1v1h-1zM31,6h1v1h-1zM33,6h1v1h-1zM35,6h1v1h-1zM37,6h1v1h-1zM15,7h1v1h-1zM17,7h1v1h-1zM19,7h1v1h-1zM21,7h1v1h-1zM22,7h1v1h-1zM23,7h1v1h-1zM24,7h1v1h-1zM25,7h1v1h-1zM26,7h1v1h-1zM27,7h1v1h-1zM28,7h1v1h-1zM29,7h1v1h-1zM30,7h1v1h-1zM32,7h1v1h-1zM33,7h1v1h-1zM34,7h1v1h-1zM36,7h1v1h-1zM37,7h1v1h-1zM38,7h1v1h-1zM10,8h1v1h-1zM12,8h1v1h-1zM14,8h1v1h-1zM15,8h1v1h-1zM16,8h1v1h-1zM17,8h1v1h-1zM18,8h1v1h-1zM19,8h1v1h-1zM20,8h1v1h-1zM21,8h1v1h-1zM22,8h1v1h-1zM23,8h1v1h-1zM25,8h1v1h-1zM27,8h1v1h-1zM29,8h1v1h-1zM31,8h1v1h-1zM35,8h1v1h-1zM37,8h1v1h-1zM39,8h1v1h-1zM11,9h1v1h-1zM13,9h1v1h-1zM15,9h1v1h-1zM16,9h1v1h-1zM17,9h1v1h-1zM18,9h1v1h-1zM19,9h1v1h-1zM20,9h1v1h-1zM21,9h1v1h-1zM22,9h1v1h-1zM23,9h1v1h-1zM24,9h1v1h-1zM26,9h1v1h-1zM28,9h1v1h-1zM30,9h1v1h-1zM32,9h1v1h-1zM34,9h1v1h-1zM36,9h1v1h-1zM38,9h1v1h-1zM40,9h1v1h-1zM8,10h1v1h-1zM10,10h1v1h-1zM12,10h1v1h-1zM13,10h1v1h-1zM14,10h1v1h-1zM15,10h1v1h-1zM16,10h1v1h-1zM17,10h1v1h-1zM19,10h1v1h-1zM20,10h1v1h-1zM21,10h1v1h-1zM23,10h1v1h-1zM25,10h1v1h-1zM27,10h1v1h-1zM29,10h1v1h-1zM41,10h1v1h-1zM9,11h1v1h-1zM11,11h1v1h-1zM13,11h1v1h-1zM14,11h1v1h-1zM15,11h1v1h-1zM16,11h1v1h-1zM17,11h1v1h-1zM18,11h1v1h-1zM19,11h1v1h-1zM20,11h1v1h-1zM21,11h1v1h-1zM22,11h1v1h-1zM24,11h1v1h-1zM26,11h1v1h-1zM28,11h1v1h-1zM30,11h1v1h-1zM32,11h1v1h-1zM34,11h1v1h-1zM36,11h1v1h-1zM38,11h1v1h-1zM40,11h1v1h-1zM42,11h1v1h-1zM6,12h1v1h-1zM8,12h1v1h-1zM10,12h1v1h-1zM11,12h1v1h-1zM12,12h1v1h-1zM13,12h1v1h-1zM14,12h1v1h-1zM15,12h1v1h-1zM17,12h1v1h-1zM19,12h1v1h-1zM21,12h1v1h-1zM23,12h1v1h-1zM7,13h1v1h-1zM9,13h1v1h-1zM11,13h1v1h-1zM12,13h1v1h-1zM13,13h1v1h-1zM14,13h1v1h-1zM15,13h1v1h-1zM16,13h1v1h-1zM17,13h1v1h-1zM18,13h1v1h-1zM19,13h1v1h-1zM20,13h1v1h-1zM22,13h1v1h-1zM24,13h1v1h-1zM26,13h1v1h-1zM30,13h1v1h-1zM42,13h1v1h-1zM6,14h1v1h-1zM8,14h1v1h-1zM10,14h1v1h-1zM11,14h1v1h-1zM12,14h1v1h-1zM13,14h1v1h-1zM15,14h1v1h-1zM17,14h1v1h-1zM19,14h1v1h-1zM21,14h1v1h-1zM7,15h1v1h-1zM9,15h1v1h-1zM10,15h1v1h-1zM11,15h1v1h-1zM12,15h1v1h-1zM13,15h1v1h-1zM14,15h1v1h-1zM15,15h1v1h-1zM16,15h1v1h-1zM17,15h1v1h-1zM18,15h1v1h-1zM20,15h1v1h-1zM22,15h1v1h-1zM24,15h1v1h-1zM26,15h1v1h-1zM28,15h1v1h-1zM44,15h1v1h-1zM4,16h1v1h-1zM6,16h1v1h-1zM7,16h1v1h-1zM8,16h1v1h-1zM9,16h1v1h-1zM10,16h1v1h-1zM11,16h1v1h-1zM13,16h1v1h-1zM15,16h1v1h-1zM17,16h1v1h-1zM19,16h1v1h-1zM5,17h1v1h-1zM7,17h1v1h-1zM8,17h1v1h-1zM9,17h1v1h-1zM10,17h1v1h-1zM11,17h1v1h-1zM12,17h1v1h-1zM13,17h1v1h-1zM14,17h1v1h-1zM15,17h1v1h-1zM16,17h1v1h-1zM18,17h1v1h-1zM20,17h1v1h-1zM22,17h1v1h-1zM2,18h1v1h-1zM4,18h1v1h-1zM6,18h1v1h-1zM7,18h1v1h-1zM8,18h1v1h-1zM9,18h1v1h-1zM11,18h1v1h-1zM13,18h1v1h-1zM15,18h1v1h-1zM17,18h1v1h-1zM3,19h1v1h-1zM5,19h1v1h-1zM7,19h1v1h-1zM8,19h1v1h-1zM9,19h1v1h-1zM10,19h1v1h-1zM11,19h1v1h-1zM12,19h1v1h-1zM13,19h1v1h-1zM14,19h1v1h-1zM16,19h1v1h-1zM18,19h1v1h-1zM20,19h1v1h-1zM2,20h1v1h-1zM4,20h1v1h-1zM5,20h1v1h-1zM6,20h1v1h-1zM7,20h1v1h-1zM8,20h1v1h-1zM9,20h1v1h-1zM11,20h1v1h-1zM13,20h1v1h-1zM15,20h1v1h-1zM3,21h1v1h-1zM5,21h1v1h-1zM7,21h1v1h-1zM8,21h1v1h-1zM9,21h1v1h-1zM10,21h1v1h-1zM11,21h1v1h-1zM12,21h1v1h-1zM14,21h1v1h-1zM16,21h1v1h-1zM18,21h1v1h-1zM2,22h1v1h-1zM4,22h1v1h-1zM5,22h1v1h-1zM6,22h1v1h-1zM7,22h1v1h-1zM8,22h1v1h-1zM9,22h1v1h-1zM11,22h1v1h-1zM13,22h1v1h-1zM3,23h1v1h-1zM5,23h1v1h-1zM6,23h1v1h-1zM7,23h1v1h-1zM8,23h1v1h-1zM9,23h1v1h-1zM10,23h1v1h-1zM12,23h1v1h-1zM14,23h1v1h-1zM16,23h1v1h-1zM2,24h1v1h-1zM3,24h1v1h-1zM4,24h1v1h-1zM5,24h1v1h-1zM6,24h1v1h-1zM7,24h1v1h-1zM9,24h1v1h-1zM11,24h1v1h-1zM3,25h1v1h-1zM4,25h1v1h-1zM5,25h1v1h-1zM6,25h1v1h-1zM7,25h1v1h-1zM8,25h1v1h-1zM10,25h1v1h-1zM12,25h1v1h-1zM14,25h1v1h-1zM2,26h1v1h-1zM3,26h1v1h-1zM4,26h1v1h-1zM5,26h1v1h-1zM7,26h1v1h-1zM9,26h1v1h-1zM11,26h1v1h-1zM13,26h1v1h-1zM3,27h1v1h-1zM5,27h1v1h-1zM6,27h1v1h-1zM7,27h1v1h-1zM8,27h1v1h-1zM9,27h1v1h-1zM10,27h1v1h-1zM12,27h1v1h-1zM14,27h1v1h-1zM2,28h1v1h-1zM3,28h1v1h-1zM4,28h1v1h-1zM5,28h1v1h-1zM7,28h1v1h-1zM9,28h1v1h-1zM11,28h1v1h-1zM3,29h1v1h-1zM4,29h1v1h-1zM5,29h1v1h-1zM6,29h1v1h-1zM7,29h1v1h-1zM8,29h1v1h-1zM10,29h1v1h-1zM12,29h1v1h-1zM2,30h1v1h-1zM3,30h1v1h-1zM4,30h1v1h-1zM5,30h1v1h-1zM7,30h1v1h-1zM9,30h1v1h-1zM3,31h1v1h-1zM4,31h1v1h-1zM5,31h1v1h-1zM6,31h1v1h-1zM8,31h1v1h-1zM10,31h1v1h-1zM12,31h1v1h-1zM3,32h1v1h-1zM4,32h1v1h-1zM5,32h1v1h-1zM7,32h1v1h-1zM4,33h1v1h-1zM5,33h1v1h-1zM6,33h1v1h-1zM7,33h1v1h-1zM8,33h1v1h-1zM10,33h1v1h-1zM4,34h1v1h-1zM5,34h1v1h-1zM7,34h1v1h-1zM9,34h1v1h-1zM5,35h1v1h-1zM6,35h1v1h-1zM8,35h1v1h-1zM10,35h1v1h-1zM12,35h1v1h-1zM5,36h1v1h-1zM7,36h1v1h-1zM6,37h1v1h-1zM7,37h1v1h-1zM8,37h1v1h-1zM10,37h1v1h-1zM7,38h1v1h-1zM9,38h1v1h-1zM8,39h1v1h-1zM10,39h1v1h-1zM12,39h1v1h-1zM9,40h1v1h-1zM10,41h1v1h-1z';
const PATH_L2 = 'M26,6h1v1h-1zM30,6h1v1h-1zM32,6h1v1h-1zM34,6h1v1h-1zM36,6h1v1h-1zM31,7h1v1h-1zM35,7h1v1h-1zM24,8h1v1h-1zM26,8h1v1h-1zM28,8h1v1h-1zM30,8h1v1h-1zM32,8h1v1h-1zM33,8h1v1h-1zM34,8h1v1h-1zM36,8h1v1h-1zM38,8h1v1h-1zM25,9h1v1h-1zM27,9h1v1h-1zM29,9h1v1h-1zM31,9h1v1h-1zM33,9h1v1h-1zM35,9h1v1h-1zM37,9h1v1h-1zM39,9h1v1h-1zM18,10h1v1h-1zM22,10h1v1h-1zM24,10h1v1h-1zM26,10h1v1h-1zM28,10h1v1h-1zM30,10h1v1h-1zM31,10h1v1h-1zM32,10h1v1h-1zM33,10h1v1h-1zM34,10h1v1h-1zM35,10h1v1h-1zM36,10h1v1h-1zM37,10h1v1h-1zM38,10h1v1h-1zM39,10h1v1h-1zM40,10h1v1h-1zM23,11h1v1h-1zM25,11h1v1h-1zM27,11h1v1h-1zM29,11h1v1h-1zM31,11h1v1h-1zM33,11h1v1h-1zM35,11h1v1h-1zM37,11h1v1h-1zM39,11h1v1h-1zM41,11h1v1h-1zM16,12h1v1h-1zM18,12h1v1h-1zM20,12h1v1h-1zM22,12h1v1h-1zM24,12h1v1h-1zM25,12h1v1h-1zM26,12h1v1h-1zM27,12h1v1h-1zM28,12h1v1h-1zM29,12h1v1h-1zM30,12h1v1h-1zM31,12h1v1h-1zM32,12h1v1h-1zM33,12h1v1h-1zM34,12h1v1h-1zM35,12h1v1h-1zM36,12h1v1h-1zM37,12h1v1h-1zM38,12h1v1h-1zM39,12h1v1h-1zM40,12h1v1h-1zM41,12h1v1h-1zM42,12h1v1h-1zM21,13h1v1h-1zM23,13h1v1h-1zM25,13h1v1h-1zM27,13h1v1h-1zM28,13h1v1h-1zM29,13h1v1h-1zM31,13h1v1h-1zM32,13h1v1h-1zM33,13h1v1h-1zM34,13h1v1h-1zM35,13h1v1h-1zM36,13h1v1h-1zM37,13h1v1h-1zM38,13h1v1h-1zM39,13h1v1h-1zM40,13h1v1h-1zM41,13h1v1h-1zM43,13h1v1h-1zM14,14h1v1h-1zM16,14h1v1h-1zM18,14h1v1h-1zM20,14h1v1h-1zM22,14h1v1h-1zM23,14h1v1h-1zM24,14h1v1h-1zM25,14h1v1h-1zM26,14h1v1h-1zM27,14h1v1h-1zM28,14h1v1h-1zM29,14h1v1h-1zM30,14h1v1h-1zM31,14h1v1h-1zM32,14h1v1h-1zM33,14h1v1h-1zM34,14h1v1h-1zM35,14h1v1h-1zM36,14h1v1h-1zM37,14h1v1h-1zM38,14h1v1h-1zM39,14h1v1h-1zM40,14h1v1h-1zM41,14h1v1h-1zM42,14h1v1h-1zM43,14h1v1h-1zM19,15h1v1h-1zM21,15h1v1h-1zM23,15h1v1h-1zM25,15h1v1h-1zM27,15h1v1h-1zM29,15h1v1h-1zM30,15h1v1h-1zM31,15h1v1h-1zM32,15h1v1h-1zM33,15h1v1h-1zM34,15h1v1h-1zM35,15h1v1h-1zM36,15h1v1h-1zM37,15h1v1h-1zM38,15h1v1h-1zM39,15h1v1h-1zM40,15h1v1h-1zM41,15h1v1h-1zM42,15h1v1h-1zM43,15h1v1h-1zM12,16h1v1h-1zM14,16h1v1h-1zM16,16h1v1h-1zM18,16h1v1h-1zM20,16h1v1h-1zM21,16h1v1h-1zM22,16h1v1h-1zM23,16h1v1h-1zM24,16h1v1h-1zM25,16h1v1h-1zM26,16h1v1h-1zM27,16h1v1h-1zM28,16h1v1h-1zM29,16h1v1h-1zM30,16h1v1h-1zM31,16h1v1h-1zM33,16h1v1h-1zM35,16h1v1h-1zM37,16h1v1h-1zM39,16h1v1h-1zM41,16h1v1h-1zM43,16h1v1h-1zM17,17h1v1h-1zM19,17h1v1h-1zM21,17h1v1h-1zM23,17h1v1h-1zM24,17h1v1h-1zM25,17h1v1h-1zM26,17h1v1h-1zM27,17h1v1h-1zM28,17h1v1h-1zM29,17h1v1h-1zM30,17h1v1h-1zM31,17h1v1h-1zM32,17h1v1h-1zM33,17h1v1h-1zM34,17h1v1h-1zM35,17h1v1h-1zM36,17h1v1h-1zM37,17h1v1h-1zM38,17h1v1h-1zM39,17h1v1h-1zM40,17h1v1h-1zM42,17h1v1h-1zM43,17h1v1h-1zM44,17h1v1h-1zM45,17h1v1h-1zM10,18h1v1h-1zM12,18h1v1h-1zM14,18h1v1h-1zM16,18h1v1h-1zM18,18h1v1h-1zM19,18h1v1h-1zM20,18h1v1h-1zM21,18h1v1h-1zM22,18h1v1h-1zM23,18h1v1h-1zM24,18h1v1h-1zM25,18h1v1h-1zM26,18h1v1h-1zM27,18h1v1h-1zM28,18h1v1h-1zM29,18h1v1h-1zM31,18h1v1h-1zM33,18h1v1h-1zM35,18h1v1h-1zM37,18h1v1h-1zM39,18h1v1h-1zM41,18h1v1h-1zM43,18h1v1h-1zM45,18h1v1h-1zM15,19h1v1h-1zM17,19h1v1h-1zM19,19h1v1h-1zM21,19h1v1h-1zM22,19h1v1h-1zM23,19h1v1h-1zM24,19h1v1h-1zM25,19h1v1h-1zM26,19h1v1h-1zM27,19h1v1h-1zM28,19h1v1h-1zM29,19h1v1h-1zM30,19h1v1h-1zM31,19h1v1h-1zM32,19h1v1h-1zM33,19h1v1h-1zM34,19h1v1h-1zM36,19h1v1h-1zM37,19h1v1h-1zM38,19h1v1h-1zM40,19h1v1h-1zM41,19h1v1h-1zM42,19h1v1h-1zM44,19h1v1h-1zM45,19h1v1h-1zM10,20h1v1h-1zM12,20h1v1h-1zM14,20h1v1h-1zM16,20h1v1h-1zM17,20h1v1h-1zM18,20h1v1h-1zM19,20h1v1h-1zM20,20h1v1h-1zM21,20h1v1h-1zM22,20h1v1h-1zM23,20h1v1h-1zM25,20h1v1h-1zM26,20h1v1h-1zM27,20h1v1h-1zM29,20h1v1h-1zM31,20h1v1h-1zM33,20h1v1h-1zM35,20h1v1h-1zM37,20h1v1h-1zM39,20h1v1h-1zM41,20h1v1h-1zM43,20h1v1h-1zM45,20h1v1h-1zM13,21h1v1h-1zM15,21h1v1h-1zM17,21h1v1h-1zM19,21h1v1h-1zM20,21h1v1h-1zM21,21h1v1h-1zM22,21h1v1h-1zM23,21h1v1h-1zM24,21h1v1h-1zM25,21h1v1h-1zM26,21h1v1h-1zM27,21h1v1h-1zM28,21h1v1h-1zM30,21h1v1h-1zM31,21h1v1h-1zM32,21h1v1h-1zM34,21h1v1h-1zM36,21h1v1h-1zM38,21h1v1h-1zM40,21h1v1h-1zM42,21h1v1h-1zM44,21h1v1h-1zM10,22h1v1h-1zM12,22h1v1h-1zM14,22h1v1h-1zM15,22h1v1h-1zM16,22h1v1h-1zM17,22h1v1h-1zM18,22h1v1h-1zM19,22h1v1h-1zM20,22h1v1h-1zM21,22h1v1h-1zM22,22h1v1h-1zM23,22h1v1h-1zM24,22h1v1h-1zM25,22h1v1h-1zM27,22h1v1h-1zM29,22h1v1h-1zM31,22h1v1h-1zM33,22h1v1h-1zM35,22h1v1h-1zM37,22h1v1h-1zM41,22h1v1h-1zM43,22h1v1h-1zM45,22h1v1h-1zM11,23h1v1h-1zM13,23h1v1h-1zM15,23h1v1h-1zM17,23h1v1h-1zM18,23h1v1h-1zM19,23h1v1h-1zM20,23h1v1h-1zM21,23h1v1h-1zM22,23h1v1h-1zM23,23h1v1h-1zM24,23h1v1h-1zM25,23h1v1h-1zM26,23h1v1h-1zM27,23h1v1h-1zM28,23h1v1h-1zM29,23h1v1h-1zM30,23h1v1h-1zM32,23h1v1h-1zM34,23h1v1h-1zM36,23h1v1h-1zM38,23h1v1h-1zM40,23h1v1h-1zM42,23h1v1h-1zM44,23h1v1h-1zM8,24h1v1h-1zM10,24h1v1h-1zM12,24h1v1h-1zM13,24h1v1h-1zM14,24h1v1h-1zM15,24h1v1h-1zM16,24h1v1h-1zM17,24h1v1h-1zM18,24h1v1h-1zM19,24h1v1h-1zM21,24h1v1h-1zM23,24h1v1h-1zM25,24h1v1h-1zM27,24h1v1h-1zM29,24h1v1h-1zM31,24h1v1h-1zM45,24h1v1h-1zM9,25h1v1h-1zM11,25h1v1h-1zM13,25h1v1h-1zM15,25h1v1h-1zM16,25h1v1h-1zM17,25h1v1h-1zM18,25h1v1h-1zM19,25h1v1h-1zM20,25h1v1h-1zM21,25h1v1h-1zM22,25h1v1h-1zM23,25h1v1h-1zM24,25h1v1h-1zM26,25h1v1h-1zM28,25h1v1h-1zM30,25h1v1h-1zM32,25h1v1h-1zM34,25h1v1h-1zM36,25h1v1h-1zM38,25h1v1h-1zM40,25h1v1h-1zM42,25h1v1h-1zM44,25h1v1h-1zM6,26h1v1h-1zM8,26h1v1h-1zM10,26h1v1h-1zM12,26h1v1h-1zM14,26h1v1h-1zM15,26h1v1h-1zM16,26h1v1h-1zM17,26h1v1h-1zM18,26h1v1h-1zM19,26h1v1h-1zM20,26h1v1h-1zM21,26h1v1h-1zM23,26h1v1h-1zM25,26h1v1h-1zM27,26h1v1h-1zM29,26h1v1h-1zM33,26h1v1h-1zM45,26h1v1h-1zM11,27h1v1h-1zM13,27h1v1h-1zM15,27h1v1h-1zM16,27h1v1h-1zM17,27h1v1h-1zM18,27h1v1h-1zM19,27h1v1h-1zM20,27h1v1h-1zM21,27h1v1h-1zM22,27h1v1h-1zM23,27h1v1h-1zM24,27h1v1h-1zM25,27h1v1h-1zM26,27h1v1h-1zM28,27h1v1h-1zM30,27h1v1h-1zM32,27h1v1h-1zM34,27h1v1h-1zM36,27h1v1h-1zM38,27h1v1h-1zM40,27h1v1h-1zM42,27h1v1h-1zM44,27h1v1h-1zM6,28h1v1h-1zM8,28h1v1h-1zM10,28h1v1h-1zM12,28h1v1h-1zM13,28h1v1h-1zM14,28h1v1h-1zM15,28h1v1h-1zM16,28h1v1h-1zM17,28h1v1h-1zM18,28h1v1h-1zM19,28h1v1h-1zM21,28h1v1h-1zM23,28h1v1h-1zM25,28h1v1h-1zM27,28h1v1h-1zM9,29h1v1h-1zM11,29h1v1h-1zM13,29h1v1h-1zM14,29h1v1h-1zM15,29h1v1h-1zM16,29h1v1h-1zM17,29h1v1h-1zM18,29h1v1h-1zM19,29h1v1h-1zM20,29h1v1h-1zM22,29h1v1h-1zM24,29h1v1h-1zM26,29h1v1h-1zM28,29h1v1h-1zM30,29h1v1h-1zM32,29h1v1h-1zM34,29h1v1h-1zM38,29h1v1h-1zM42,29h1v1h-1zM44,29h1v1h-1zM6,30h1v1h-1zM8,30h1v1h-1zM10,30h1v1h-1zM11,30h1v1h-1zM12,30h1v1h-1zM13,30h1v1h-1zM14,30h1v1h-1zM15,30h1v1h-1zM16,30h1v1h-1zM17,30h1v1h-1zM19,30h1v1h-1zM21,30h1v1h-1zM23,30h1v1h-1zM25,30h1v1h-1zM29,30h1v1h-1zM45,30h1v1h-1zM7,31h1v1h-1zM9,31h1v1h-1zM11,31h1v1h-1zM13,31h1v1h-1zM14,31h1v1h-1zM15,31h1v1h-1zM16,31h1v1h-1zM17,31h1v1h-1zM18,31h1v1h-1zM19,31h1v1h-1zM20,31h1v1h-1zM21,31h1v1h-1zM22,31h1v1h-1zM24,31h1v1h-1zM26,31h1v1h-1zM28,31h1v1h-1zM30,31h1v1h-1zM32,31h1v1h-1zM36,31h1v1h-1zM40,31h1v1h-1zM44,31h1v1h-1zM6,32h1v1h-1zM8,32h1v1h-1zM9,32h1v1h-1zM10,32h1v1h-1zM11,32h1v1h-1zM12,32h1v1h-1zM13,32h1v1h-1zM14,32h1v1h-1zM15,32h1v1h-1zM17,32h1v1h-1zM19,32h1v1h-1zM21,32h1v1h-1zM23,32h1v1h-1zM9,33h1v1h-1zM11,33h1v1h-1zM12,33h1v1h-1zM13,33h1v1h-1zM14,33h1v1h-1zM15,33h1v1h-1zM16,33h1v1h-1zM17,33h1v1h-1zM18,33h1v1h-1zM19,33h1v1h-1zM20,33h1v1h-1zM22,33h1v1h-1zM24,33h1v1h-1zM26,33h1v1h-1zM28,33h1v1h-1zM30,33h1v1h-1zM6,34h1v1h-1zM8,34h1v1h-1zM10,34h1v1h-1zM11,34h1v1h-1zM12,34h1v1h-1zM13,34h1v1h-1zM14,34h1v1h-1zM15,34h1v1h-1zM16,34h1v1h-1zM17,34h1v1h-1zM19,34h1v1h-1zM21,34h1v1h-1zM23,34h1v1h-1zM25,34h1v1h-1zM7,35h1v1h-1zM9,35h1v1h-1zM11,35h1v1h-1zM13,35h1v1h-1zM14,35h1v1h-1zM15,35h1v1h-1zM16,35h1v1h-1zM17,35h1v1h-1zM18,35h1v1h-1zM20,35h1v1h-1zM22,35h1v1h-1zM24,35h1v1h-1zM26,35h1v1h-1zM28,35h1v1h-1zM32,35h1v1h-1zM6,36h1v1h-1zM8,36h1v1h-1zM9,36h1v1h-1zM10,36h1v1h-1zM11,36h1v1h-1zM12,36h1v1h-1zM13,36h1v1h-1zM14,36h1v1h-1zM15,36h1v1h-1zM17,36h1v1h-1zM19,36h1v1h-1zM21,36h1v1h-1zM23,36h1v1h-1zM9,37h1v1h-1zM11,37h1v1h-1zM12,37h1v1h-1zM13,37h1v1h-1zM14,37h1v1h-1zM15,37h1v1h-1zM16,37h1v1h-1zM17,37h1v1h-1zM18,37h1v1h-1zM19,37h1v1h-1zM20,37h1v1h-1zM22,37h1v1h-1zM24,37h1v1h-1zM26,37h1v1h-1zM30,37h1v1h-1zM8,38h1v1h-1zM10,38h1v1h-1zM11,38h1v1h-1zM12,38h1v1h-1zM13,38h1v1h-1zM14,38h1v1h-1zM15,38h1v1h-1zM16,38h1v1h-1zM17,38h1v1h-1zM19,38h1v1h-1zM21,38h1v1h-1zM25,38h1v1h-1zM9,39h1v1h-1zM11,39h1v1h-1zM13,39h1v1h-1zM14,39h1v1h-1zM15,39h1v1h-1zM16,39h1v1h-1zM17,39h1v1h-1zM18,39h1v1h-1zM20,39h1v1h-1zM22,39h1v1h-1zM24,39h1v1h-1zM26,39h1v1h-1zM28,39h1v1h-1zM32,39h1v1h-1zM10,40h1v1h-1zM11,40h1v1h-1zM12,40h1v1h-1zM13,40h1v1h-1zM14,40h1v1h-1zM15,40h1v1h-1zM17,40h1v1h-1zM19,40h1v1h-1zM21,40h1v1h-1zM23,40h1v1h-1zM11,41h1v1h-1zM12,41h1v1h-1zM13,41h1v1h-1zM14,41h1v1h-1zM15,41h1v1h-1zM16,41h1v1h-1zM18,41h1v1h-1zM20,41h1v1h-1zM22,41h1v1h-1zM24,41h1v1h-1zM26,41h1v1h-1zM30,41h1v1h-1zM11,42h1v1h-1zM12,42h1v1h-1zM13,42h1v1h-1zM14,42h1v1h-1zM15,42h1v1h-1zM16,42h1v1h-1zM17,42h1v1h-1zM19,42h1v1h-1zM21,42h1v1h-1zM13,43h1v1h-1zM14,43h1v1h-1zM15,43h1v1h-1zM16,43h1v1h-1zM17,43h1v1h-1zM18,43h1v1h-1zM20,43h1v1h-1zM22,43h1v1h-1zM24,43h1v1h-1zM26,43h1v1h-1zM28,43h1v1h-1zM30,43h1v1h-1zM32,43h1v1h-1zM34,43h1v1h-1zM15,44h1v1h-1zM16,44h1v1h-1zM17,44h1v1h-1zM19,44h1v1h-1zM21,44h1v1h-1zM23,44h1v1h-1zM17,45h1v1h-1zM18,45h1v1h-1zM19,45h1v1h-1zM20,45h1v1h-1zM22,45h1v1h-1zM24,45h1v1h-1zM26,45h1v1h-1zM28,45h1v1h-1zM30,45h1v1h-1z';
const PATH_L3 = 'M32,16h1v1h-1zM34,16h1v1h-1zM36,16h1v1h-1zM38,16h1v1h-1zM40,16h1v1h-1zM42,16h1v1h-1zM44,16h1v1h-1zM41,17h1v1h-1zM30,18h1v1h-1zM32,18h1v1h-1zM34,18h1v1h-1zM36,18h1v1h-1zM38,18h1v1h-1zM40,18h1v1h-1zM42,18h1v1h-1zM44,18h1v1h-1zM35,19h1v1h-1zM39,19h1v1h-1zM43,19h1v1h-1zM24,20h1v1h-1zM28,20h1v1h-1zM30,20h1v1h-1zM32,20h1v1h-1zM34,20h1v1h-1zM36,20h1v1h-1zM38,20h1v1h-1zM40,20h1v1h-1zM42,20h1v1h-1zM44,20h1v1h-1zM29,21h1v1h-1zM33,21h1v1h-1zM35,21h1v1h-1zM37,21h1v1h-1zM39,21h1v1h-1zM41,21h1v1h-1zM43,21h1v1h-1zM45,21h1v1h-1zM26,22h1v1h-1zM28,22h1v1h-1zM30,22h1v1h-1zM32,22h1v1h-1zM34,22h1v1h-1zM36,22h1v1h-1zM38,22h1v1h-1zM39,22h1v1h-1zM40,22h1v1h-1zM42,22h1v1h-1zM44,22h1v1h-1zM31,23h1v1h-1zM33,23h1v1h-1zM35,23h1v1h-1zM37,23h1v1h-1zM39,23h1v1h-1zM41,23h1v1h-1zM43,23h1v1h-1zM45,23h1v1h-1zM20,24h1v1h-1zM22,24h1v1h-1zM24,24h1v1h-1zM26,24h1v1h-1zM28,24h1v1h-1zM30,24h1v1h-1zM32,24h1v1h-1zM33,24h1v1h-1zM34,24h1v1h-1zM35,24h1v1h-1zM36,24h1v1h-1zM37,24h1v1h-1zM38,24h1v1h-1zM39,24h1v1h-1zM40,24h1v1h-1zM41,24h1v1h-1zM42,24h1v1h-1zM43,24h1v1h-1zM44,24h1v1h-1zM25,25h1v1h-1zM27,25h1v1h-1zM29,25h1v1h-1zM31,25h1v1h-1zM33,25h1v1h-1zM35,25h1v1h-1zM37,25h1v1h-1zM39,25h1v1h-1zM41,25h1v1h-1zM43,25h1v1h-1zM45,25h1v1h-1zM22,26h1v1h-1zM24,26h1v1h-1zM26,26h1v1h-1zM28,26h1v1h-1zM30,26h1v1h-1zM31,26h1v1h-1zM32,26h1v1h-1zM34,26h1v1h-1zM35,26h1v1h-1zM36,26h1v1h-1zM37,26h1v1h-1zM38,26h1v1h-1zM39,26h1v1h-1zM40,26h1v1h-1zM41,26h1v1h-1zM42,26h1v1h-1zM43,26h1v1h-1zM44,26h1v1h-1zM27,27h1v1h-1zM29,27h1v1h-1zM31,27h1v1h-1zM33,27h1v1h-1zM35,27h1v1h-1zM37,27h1v1h-1zM39,27h1v1h-1zM41,27h1v1h-1zM43,27h1v1h-1zM45,27h1v1h-1zM20,28h1v1h-1zM22,28h1v1h-1zM24,28h1v1h-1zM26,28h1v1h-1zM28,28h1v1h-1zM29,28h1v1h-1zM30,28h1v1h-1zM31,28h1v1h-1zM32,28h1v1h-1zM33,28h1v1h-1zM34,28h1v1h-1zM35,28h1v1h-1zM36,28h1v1h-1zM37,28h1v1h-1zM38,28h1v1h-1zM39,28h1v1h-1zM40,28h1v1h-1zM41,28h1v1h-1zM42,28h1v1h-1zM43,28h1v1h-1zM44,28h1v1h-1zM45,28h1v1h-1zM21,29h1v1h-1zM23,29h1v1h-1zM25,29h1v1h-1zM27,29h1v1h-1zM29,29h1v1h-1zM31,29h1v1h-1zM33,29h1v1h-1zM35,29h1v1h-1zM36,29h1v1h-1zM37,29h1v1h-1zM39,29h1v1h-1zM40,29h1v1h-1zM41,29h1v1h-1zM43,29h1v1h-1zM45,29h1v1h-1zM18,30h1v1h-1zM20,30h1v1h-1zM22,30h1v1h-1zM24,30h1v1h-1zM26,30h1v1h-1zM27,30h1v1h-1zM28,30h1v1h-1zM30,30h1v1h-1zM31,30h1v1h-1zM32,30h1v1h-1zM33,30h1v1h-1zM34,30h1v1h-1zM35,30h1v1h-1zM36,30h1v1h-1zM37,30h1v1h-1zM38,30h1v1h-1zM39,30h1v1h-1zM40,30h1v1h-1zM41,30h1v1h-1zM42,30h1v1h-1zM43,30h1v1h-1zM44,30h1v1h-1zM23,31h1v1h-1zM25,31h1v1h-1zM27,31h1v1h-1zM29,31h1v1h-1zM31,31h1v1h-1zM33,31h1v1h-1zM34,31h1v1h-1zM35,31h1v1h-1zM37,31h1v1h-1zM38,31h1v1h-1zM39,31h1v1h-1zM41,31h1v1h-1zM42,31h1v1h-1zM43,31h1v1h-1zM16,32h1v1h-1zM18,32h1v1h-1zM20,32h1v1h-1zM22,32h1v1h-1zM24,32h1v1h-1zM25,32h1v1h-1zM26,32h1v1h-1zM27,32h1v1h-1zM28,32h1v1h-1zM29,32h1v1h-1zM30,32h1v1h-1zM31,32h1v1h-1zM32,32h1v1h-1zM33,32h1v1h-1zM34,32h1v1h-1zM35,32h1v1h-1zM36,32h1v1h-1zM37,32h1v1h-1zM38,32h1v1h-1zM39,32h1v1h-1zM40,32h1v1h-1zM41,32h1v1h-1zM42,32h1v1h-1zM43,32h1v1h-1zM44,32h1v1h-1zM21,33h1v1h-1zM23,33h1v1h-1zM25,33h1v1h-1zM27,33h1v1h-1zM29,33h1v1h-1zM31,33h1v1h-1zM32,33h1v1h-1zM33,33h1v1h-1zM34,33h1v1h-1zM35,33h1v1h-1zM36,33h1v1h-1zM37,33h1v1h-1zM38,33h1v1h-1zM39,33h1v1h-1zM40,33h1v1h-1zM41,33h1v1h-1zM42,33h1v1h-1zM43,33h1v1h-1zM18,34h1v1h-1zM20,34h1v1h-1zM22,34h1v1h-1zM24,34h1v1h-1zM26,34h1v1h-1zM27,34h1v1h-1zM28,34h1v1h-1zM29,34h1v1h-1zM30,34h1v1h-1zM31,34h1v1h-1zM32,34h1v1h-1zM33,34h1v1h-1zM34,34h1v1h-1zM35,34h1v1h-1zM36,34h1v1h-1zM37,34h1v1h-1zM38,34h1v1h-1zM39,34h1v1h-1zM40,34h1v1h-1zM41,34h1v1h-1zM42,34h1v1h-1zM43,34h1v1h-1zM19,35h1v1h-1zM21,35h1v1h-1zM23,35h1v1h-1zM25,35h1v1h-1zM27,35h1v1h-1zM29,35h1v1h-1zM30,35h1v1h-1zM31,35h1v1h-1zM33,35h1v1h-1zM34,35h1v1h-1zM35,35h1v1h-1zM36,35h1v1h-1zM37,35h1v1h-1zM38,35h1v1h-1zM39,35h1v1h-1zM40,35h1v1h-1zM41,35h1v1h-1zM42,35h1v1h-1zM16,36h1v1h-1zM18,36h1v1h-1zM20,36h1v1h-1zM22,36h1v1h-1zM24,36h1v1h-1zM25,36h1v1h-1zM26,36h1v1h-1zM27,36h1v1h-1zM28,36h1v1h-1zM29,36h1v1h-1zM30,36h1v1h-1zM31,36h1v1h-1zM32,36h1v1h-1zM33,36h1v1h-1zM34,36h1v1h-1zM35,36h1v1h-1zM36,36h1v1h-1zM37,36h1v1h-1zM38,36h1v1h-1zM39,36h1v1h-1zM40,36h1v1h-1zM41,36h1v1h-1zM42,36h1v1h-1zM21,37h1v1h-1zM23,37h1v1h-1zM25,37h1v1h-1zM27,37h1v1h-1zM28,37h1v1h-1zM29,37h1v1h-1zM31,37h1v1h-1zM32,37h1v1h-1zM33,37h1v1h-1zM34,37h1v1h-1zM35,37h1v1h-1zM36,37h1v1h-1zM37,37h1v1h-1zM38,37h1v1h-1zM39,37h1v1h-1zM40,37h1v1h-1zM41,37h1v1h-1zM18,38h1v1h-1zM20,38h1v1h-1zM22,38h1v1h-1zM23,38h1v1h-1zM24,38h1v1h-1zM26,38h1v1h-1zM27,38h1v1h-1zM28,38h1v1h-1zM29,38h1v1h-1zM30,38h1v1h-1zM31,38h1v1h-1zM32,38h1v1h-1zM33,38h1v1h-1zM34,38h1v1h-1zM35,38h1v1h-1zM36,38h1v1h-1zM37,38h1v1h-1zM38,38h1v1h-1zM39,38h1v1h-1zM40,38h1v1h-1zM19,39h1v1h-1zM21,39h1v1h-1zM23,39h1v1h-1zM25,39h1v1h-1zM27,39h1v1h-1zM29,39h1v1h-1zM30,39h1v1h-1zM31,39h1v1h-1zM33,39h1v1h-1zM34,39h1v1h-1zM35,39h1v1h-1zM36,39h1v1h-1zM37,39h1v1h-1zM38,39h1v1h-1zM39,39h1v1h-1zM16,40h1v1h-1zM18,40h1v1h-1zM20,40h1v1h-1zM22,40h1v1h-1zM24,40h1v1h-1zM25,40h1v1h-1zM26,40h1v1h-1zM27,40h1v1h-1zM28,40h1v1h-1zM29,40h1v1h-1zM30,40h1v1h-1zM31,40h1v1h-1zM32,40h1v1h-1zM33,40h1v1h-1zM34,40h1v1h-1zM35,40h1v1h-1zM36,40h1v1h-1zM37,40h1v1h-1zM38,40h1v1h-1zM17,41h1v1h-1zM19,41h1v1h-1zM21,41h1v1h-1zM23,41h1v1h-1zM25,41h1v1h-1zM27,41h1v1h-1zM28,41h1v1h-1zM29,41h1v1h-1zM31,41h1v1h-1zM32,41h1v1h-1zM33,41h1v1h-1zM34,41h1v1h-1zM35,41h1v1h-1zM36,41h1v1h-1zM37,41h1v1h-1zM18,42h1v1h-1zM20,42h1v1h-1zM22,42h1v1h-1zM23,42h1v1h-1zM24,42h1v1h-1zM25,42h1v1h-1zM26,42h1v1h-1zM27,42h1v1h-1zM28,42h1v1h-1zM29,42h1v1h-1zM30,42h1v1h-1zM31,42h1v1h-1zM32,42h1v1h-1zM33,42h1v1h-1zM34,42h1v1h-1zM35,42h1v1h-1zM36,42h1v1h-1zM19,43h1v1h-1zM21,43h1v1h-1zM23,43h1v1h-1zM25,43h1v1h-1zM27,43h1v1h-1zM29,43h1v1h-1zM31,43h1v1h-1zM33,43h1v1h-1zM18,44h1v1h-1zM20,44h1v1h-1zM22,44h1v1h-1zM24,44h1v1h-1zM25,44h1v1h-1zM26,44h1v1h-1zM27,44h1v1h-1zM28,44h1v1h-1zM29,44h1v1h-1zM30,44h1v1h-1zM31,44h1v1h-1zM32,44h1v1h-1zM21,45h1v1h-1zM23,45h1v1h-1zM25,45h1v1h-1zM27,45h1v1h-1zM29,45h1v1h-1z';

export function getDitherColorFromSeed(seed: string): DitherColor {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % PALETTE_KEYS.length;
  return PALETTE_KEYS[index];
}

interface DitheredSphereProps {
  color?: DitherColor;
  seed?: string;
  index?: number;
  size?: number; // CSS size in px, default 32
  className?: string;
}

export default function DitheredSphere({
  color,
  seed,
  index,
  size = 32,
  className = '',
}: DitheredSphereProps) {
  const clipId = useId();

  const chosenColor: DitherColor = useMemo(() => {
    if (color && DITHER_PALETTES[color]) return color;
    if (typeof index === 'number') {
      return PALETTE_KEYS[Math.abs(index) % PALETTE_KEYS.length];
    }
    if (seed) return getDitherColorFromSeed(seed);
    return 'lime';
  }, [color, seed, index]);

  const palette = DITHER_PALETTES[chosenColor];

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative shrink-0 rounded-full select-none overflow-hidden ${className}`}
      title={`${palette.name} Sphere`}
    >
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        className="w-full h-full block"
        style={{
          imageRendering: 'pixelated',
          shapeRendering: 'crispEdges',
        }}
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx="23.5" cy="23.5" r="22.5" />
          </clipPath>
        </defs>

        <g clipPath={`url(#${clipId})`}>
          {/* Level 0: Deep Shadow background circle */}
          <circle cx="23.5" cy="23.5" r="22.5" fill={palette.l0} />

          {/* Level 1: Mid Shadow 8x8 Bayer dithered pixels */}
          <path d={PATH_L1} fill={palette.l1} />

          {/* Level 2: Mid Tone 8x8 Bayer dithered pixels */}
          <path d={PATH_L2} fill={palette.l2} />

          {/* Level 3: Highlight 8x8 Bayer dithered pixels */}
          <path d={PATH_L3} fill={palette.l3} />
        </g>

        {/* Subtle rim border */}
        <circle
          cx="23.5"
          cy="23.5"
          r="22.5"
          fill="none"
          stroke={palette.border}
          strokeWidth="0.75"
          shapeRendering="auto"
        />
      </svg>
    </div>
  );
}
