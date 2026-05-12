import React from 'react';
import { screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { IconRail } from '../IconRail';

describe('IconRail', () => {
  describe('navigation container', () => {
    it('has an accessible label on the nav container', () => {
      renderWithProviders(
        <IconRail activeProductId="dashboard" onSelectProduct={vi.fn()} />
      );
      expect(screen.getByRole('navigation', { name: 'Platform navigation' })).toBeInTheDocument();
    });
  });

  describe('active state', () => {
    it('marks the active product button with aria-current="page"', () => {
      renderWithProviders(
        <IconRail activeProductId="certcentral" onSelectProduct={vi.fn()} />
      );
      expect(screen.getByRole('button', { name: 'CertCentral' }))
        .toHaveAttribute('aria-current', 'page');
    });

    it('does not mark inactive product buttons with aria-current', () => {
      renderWithProviders(
        <IconRail activeProductId="certcentral" onSelectProduct={vi.fn()} />
      );
      expect(screen.getByRole('button', { name: 'Dashboard' }))
        .not.toHaveAttribute('aria-current');
    });

    it('only one button has aria-current="page" at a time', () => {
      renderWithProviders(
        <IconRail activeProductId="dashboard" onSelectProduct={vi.fn()} />
      );
      const currentButtons = screen
        .getAllByRole('button')
        .filter(btn => btn.getAttribute('aria-current') === 'page');
      expect(currentButtons).toHaveLength(1);
    });
  });

  describe('click behaviour', () => {
    it('calls onSelectProduct with the product id when clicked', () => {
      const onSelect = vi.fn();
      renderWithProviders(
        <IconRail activeProductId="dashboard" onSelectProduct={onSelect} />
      );
      fireEvent.click(screen.getByRole('button', { name: 'CertCentral' }));
      expect(onSelect).toHaveBeenCalledWith('certcentral');
    });
  });

  describe('tooltip', () => {
    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(() => { vi.useRealTimers(); });

    it('tooltip is not visible before hover', () => {
      renderWithProviders(
        <IconRail activeProductId="dashboard" onSelectProduct={vi.fn()} />
      );
      const tooltip = [...document.querySelectorAll('[role="tooltip"]')]
        .find(el => el.textContent === 'CertCentral');
      expect(tooltip).toHaveStyle({ opacity: '0' });
    });

    it('tooltip becomes visible after hover delay', async () => {
      renderWithProviders(
        <IconRail activeProductId="dashboard" onSelectProduct={vi.fn()} />
      );
      const btn = screen.getByRole('button', { name: 'CertCentral' });
      fireEvent.mouseEnter(btn);

      // Before delay — still hidden
      const tooltip = [...document.querySelectorAll('[role="tooltip"]')]
        .find(el => el.textContent === 'CertCentral')!;
      expect(tooltip).toHaveStyle({ opacity: '0' });

      // Advance timers inside act so React processes the resulting state update
      await act(async () => { vi.advanceTimersByTime(350); });
      expect(tooltip).toHaveStyle({ opacity: '1' });
    });

    it('tooltip is hidden immediately on mouse leave', async () => {
      renderWithProviders(
        <IconRail activeProductId="dashboard" onSelectProduct={vi.fn()} />
      );
      const btn = screen.getByRole('button', { name: 'CertCentral' });
      fireEvent.mouseEnter(btn);
      await act(async () => { vi.advanceTimersByTime(350); });

      await act(async () => { fireEvent.mouseLeave(btn); });

      const tooltip = [...document.querySelectorAll('[role="tooltip"]')]
        .find(el => el.textContent === 'CertCentral');
      expect(tooltip).toHaveStyle({ opacity: '0' });
    });

    it('shows tooltip immediately on keyboard focus (no delay)', async () => {
      renderWithProviders(
        <IconRail activeProductId="dashboard" onSelectProduct={vi.fn()} />
      );
      const btn = screen.getByRole('button', { name: 'CertCentral' });

      // btn.focus() sets document.activeElement and triggers React onFocus
      await act(async () => { btn.focus(); });

      const tooltip = [...document.querySelectorAll('[role="tooltip"]')]
        .find(el => el.textContent === 'CertCentral');
      expect(tooltip).toHaveStyle({ opacity: '1' });
    });

    it('Escape dismisses the tooltip without moving focus', async () => {
      renderWithProviders(
        <IconRail activeProductId="dashboard" onSelectProduct={vi.fn()} />
      );
      const btn = screen.getByRole('button', { name: 'CertCentral' });

      await act(async () => { btn.focus(); });

      const tooltip = [...document.querySelectorAll('[role="tooltip"]')]
        .find(el => el.textContent === 'CertCentral')!;
      expect(tooltip).toHaveStyle({ opacity: '1' });

      await act(async () => { fireEvent.keyDown(btn, { key: 'Escape' }); });
      expect(tooltip).toHaveStyle({ opacity: '0' });
      // Focus stays on the button — not moved to body or elsewhere
      expect(document.activeElement).toBe(btn);
    });

    it('cancels pending hover timer when mouse leaves before delay elapses', async () => {
      renderWithProviders(
        <IconRail activeProductId="dashboard" onSelectProduct={vi.fn()} />
      );
      const btn = screen.getByRole('button', { name: 'CertCentral' });
      fireEvent.mouseEnter(btn);
      await act(async () => { fireEvent.mouseLeave(btn); });
      await act(async () => { vi.advanceTimersByTime(350); });

      const tooltip = [...document.querySelectorAll('[role="tooltip"]')]
        .find(el => el.textContent === 'CertCentral');
      expect(tooltip).toHaveStyle({ opacity: '0' });
    });
  });
});
