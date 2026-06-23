import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
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
      expect(screen.getByRole('button', { name: 'Overview' }))
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

    it('drops focus when the pointer leaves so the overlay can collapse on mouse-out', () => {
      renderWithProviders(
        <IconRail activeProductId="dashboard" onSelectProduct={vi.fn()} />
      );
      const nav = screen.getByRole('navigation', { name: 'Platform navigation' });
      const btn = screen.getByRole('button', { name: 'CertCentral' });

      // A click leaves focus on the button (which would hold the rail open via
      // :focus-within); mouse-out should release it.
      btn.focus();
      expect(document.activeElement).toBe(btn);

      fireEvent.mouseLeave(nav);
      expect(document.activeElement).not.toBe(btn);
    });
  });

  describe('expandable labels', () => {
    // The rail is icon-only at rest and expands on hover/focus to reveal the
    // full product label next to each icon. The label is always in the DOM
    // (CSS toggles its opacity); aria-label remains authoritative for a11y.
    it('renders the full product label text for every product', () => {
      renderWithProviders(
        <IconRail activeProductId="dashboard" onSelectProduct={vi.fn()} />
      );
      // "Software Trust" previously showed an abbreviated "Software" caption —
      // now the full label is rendered, ready to reveal on expand.
      const btn = screen.getByRole('button', { name: 'Software Trust' });
      expect(btn).toHaveTextContent('Software Trust');
    });
  });
});
