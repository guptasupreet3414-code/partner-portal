import React from 'react';
import type { ICellRendererParams } from '@ag-grid-community/core';

/* ── Utility ──────────────────────────────────────────────────────── */

function badge(bg: string, color: string, label: string) {
  return (
    <span style={{
      padding: '3px 10px',
      borderRadius: 100,
      fontSize: 11,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      background: bg,
      color,
      display: 'inline-block',
    }}>
      {label}
    </span>
  );
}

/* ── Health badge: Healthy / Needs attention / At risk ────────────── */

export function HealthBadgeRenderer({ value }: ICellRendererParams) {
  if (!value) return null;
  const bg = value === 'Healthy' ? '#D1FAE5' : value === 'Needs attention' ? '#FEF3C7' : '#FEE2E2';
  const color = value === 'Healthy' ? '#065F46' : value === 'Needs attention' ? '#92400E' : '#991B1B';
  return badge(bg, color, value);
}

/* ── Status badge: covers entitlement, activity, user statuses ─────── */

const STATUS_MAP: Record<string, { bg: string; color: string }> = {
  'Healthy':          { bg: '#D1FAE5', color: '#065F46' },
  'Near limit':       { bg: '#FEF3C7', color: '#92400E' },
  'At limit':         { bg: '#FEE2E2', color: '#991B1B' },
  'Over entitlement': { bg: '#FEE2E2', color: '#991B1B' },
  'Completed':        { bg: '#D1FAE5', color: '#065F46' },
  'Failed':           { bg: '#FEE2E2', color: '#991B1B' },
  'Warning':          { bg: '#FEF3C7', color: '#92400E' },
  'In progress':      { bg: '#DBEAFE', color: '#1E40AF' },
  'Active':           { bg: '#D1FAE5', color: '#065F46' },
  'Pending':          { bg: '#FEF3C7', color: '#92400E' },
  'Suspended':        { bg: '#FEE2E2', color: '#991B1B' },
};

export function StatusBadgeRenderer({ value }: ICellRendererParams) {
  if (!value) return null;
  const s = STATUS_MAP[value] ?? { bg: '#F3F4F6', color: '#374151' };
  return badge(s.bg, s.color, value);
}

/* ── Role badge ───────────────────────────────────────────────────── */

const ROLE_MAP: Record<string, { bg: string; color: string }> = {
  'Partner Administrator': { bg: '#EEF6FF', color: '#0174C3' },
  'Service Administrator': { bg: '#F3E8FF', color: '#7C3AED' },
  'Read-only':             { bg: '#F3F4F6', color: '#4B5563' },
  'Billing Administrator': { bg: '#FFF7ED', color: '#C2410C' },
};

export function RoleBadgeRenderer({ value }: ICellRendererParams) {
  if (!value) return null;
  const s = ROLE_MAP[value] ?? { bg: '#F3F4F6', color: '#374151' };
  return badge(s.bg, s.color, value);
}

/* ── Severity badge: error / warning / info ───────────────────────── */

export function SeverityBadgeRenderer({ value }: ICellRendererParams) {
  if (!value) return null;
  const label = value === 'error' ? 'High' : value === 'warning' ? 'Medium' : 'Low';
  const bg    = value === 'error' ? '#FEE2E2' : value === 'warning' ? '#FEF3C7' : '#DBEAFE';
  const color = value === 'error' ? '#991B1B' : value === 'warning' ? '#92400E' : '#1E40AF';
  return badge(bg, color, label);
}

/* ── Progress bar: value = 0–100 ──────────────────────────────────── */

export function ProgressBarRenderer({ value }: ICellRendererParams) {
  const pct = typeof value === 'number' ? value : 0;
  const barColor = pct >= 100 ? '#DC2626' : pct >= 80 ? '#F59E0B' : '#1976D2';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
      <div style={{ flex: 1, height: 6, background: '#E7EBEF', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
        <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: barColor, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: barColor, whiteSpace: 'nowrap' }}>{pct}%</span>
    </div>
  );
}

/* ── Customer cell: blue name + grey meta line ────────────────────── */

export function CustomerCellRenderer({ value, data }: ICellRendererParams) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#0174C3', lineHeight: 1.3 }}>{value}</div>
      {data?.meta && (
        <div style={{ fontSize: 12, color: '#757D82', marginTop: 2, lineHeight: 1.3 }}>{data.meta}</div>
      )}
    </div>
  );
}

/* ── User cell: name + email ──────────────────────────────────────── */

export function UserCellRenderer({ value, data }: ICellRendererParams) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1F24', lineHeight: 1.3 }}>{value}</div>
      {data?.email && (
        <div style={{ fontSize: 12, color: '#757D82', marginTop: 2, lineHeight: 1.3 }}>{data.email}</div>
      )}
    </div>
  );
}

/* ── Avatar + customer name (portfolio attention table) ───────────── */

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export function AvatarNameRenderer({ value }: ICellRendererParams) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: '#EDF6FC', color: '#0174C3',
        fontSize: 11, fontWeight: 700, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {initials(value)}
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1F24' }}>{value}</span>
    </div>
  );
}

/* ── Open arrow ───────────────────────────────────────────────────── */

export function OpenArrowRenderer() {
  return <span style={{ fontSize: 13, fontWeight: 500, color: '#0174C3' }}>Open →</span>;
}

/* ── Review link ──────────────────────────────────────────────────── */

export function ReviewLinkRenderer() {
  return <span style={{ fontSize: 13, fontWeight: 500, color: '#0174C3' }}>Review →</span>;
}
