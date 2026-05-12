import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { TopNav } from '../TopNav';
import type { ActiveTopNav } from '../../../hooks/useNavState';

const defaultProps = {
  isDrawerOpen: false,
  onToggleDrawer: vi.fn(),
  activeTopNav: null as ActiveTopNav,
  onOpenTopNav: vi.fn(),
  onCloseTopNav: vi.fn(),
  onSelectProduct: vi.fn(),
};

describe('TopNav', () => {
  describe('landmark and structure', () => {
    it('renders a banner landmark', () => {
      renderWithProviders(<TopNav {...defaultProps} />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders the DigiCert ONE logo with an accessible label', () => {
      renderWithProviders(<TopNav {...defaultProps} />);
      expect(screen.getByLabelText('DigiCert ONE')).toBeInTheDocument();
    });
  });

  // The hamburger is CSS-hidden on desktop (display:none via media query).
  // Tests use { hidden: true } to include it regardless of visual visibility.
  describe('hamburger button', () => {
    it('has an accessible label', () => {
      renderWithProviders(<TopNav {...defaultProps} />);
      expect(
        screen.getByRole('button', { name: 'Open navigation menu', hidden: true })
      ).toBeInTheDocument();
    });

    it('has aria-controls="nav-drawer"', () => {
      renderWithProviders(<TopNav {...defaultProps} />);
      const btn = screen.getByRole('button', { name: 'Open navigation menu', hidden: true });
      expect(btn).toHaveAttribute('aria-controls', 'nav-drawer');
    });

    it('reflects isDrawerOpen=false with aria-expanded="false"', () => {
      renderWithProviders(<TopNav {...defaultProps} isDrawerOpen={false} />);
      const btn = screen.getByRole('button', { name: 'Open navigation menu', hidden: true });
      expect(btn).toHaveAttribute('aria-expanded', 'false');
    });

    it('reflects isDrawerOpen=true with aria-expanded="true"', () => {
      renderWithProviders(<TopNav {...defaultProps} isDrawerOpen={true} />);
      const btn = screen.getByRole('button', { name: 'Open navigation menu', hidden: true });
      expect(btn).toHaveAttribute('aria-expanded', 'true');
    });

    it('calls onToggleDrawer when clicked', () => {
      const onToggle = vi.fn();
      renderWithProviders(<TopNav {...defaultProps} onToggleDrawer={onToggle} />);
      fireEvent.click(
        screen.getByRole('button', { name: 'Open navigation menu', hidden: true })
      );
      expect(onToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('cart button', () => {
    it('has an accessible label', () => {
      renderWithProviders(<TopNav {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Open cart' })).toBeInTheDocument();
    });

    it('has aria-expanded="false" when cart is not active', () => {
      renderWithProviders(<TopNav {...defaultProps} activeTopNav={null} />);
      expect(screen.getByRole('button', { name: 'Open cart' }))
        .toHaveAttribute('aria-expanded', 'false');
    });

    it('has aria-expanded="true" when cart is active', () => {
      renderWithProviders(<TopNav {...defaultProps} activeTopNav="cart" />);
      expect(screen.getByRole('button', { name: 'Open cart' }))
        .toHaveAttribute('aria-expanded', 'true');
    });

    it('has aria-haspopup="dialog"', () => {
      renderWithProviders(<TopNav {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Open cart' }))
        .toHaveAttribute('aria-haspopup', 'dialog');
    });

    it('shows a badge with the cart count and marks it aria-hidden', () => {
      renderWithProviders(<TopNav {...defaultProps} cartCount={3} />);
      const badge = screen.getByText('3');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute('aria-hidden', 'true');
    });

    it('calls onOpenTopNav("cart") when clicked', () => {
      const onOpen = vi.fn();
      renderWithProviders(<TopNav {...defaultProps} onOpenTopNav={onOpen} />);
      fireEvent.click(screen.getByRole('button', { name: 'Open cart' }));
      expect(onOpen).toHaveBeenCalledWith('cart');
    });
  });

  describe('settings button', () => {
    it('has an accessible label', () => {
      renderWithProviders(<TopNav {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
    });

    it('has aria-haspopup="menu"', () => {
      renderWithProviders(<TopNav {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Settings' }))
        .toHaveAttribute('aria-haspopup', 'menu');
    });

    it('has aria-expanded="false" when settings dropdown is closed', () => {
      renderWithProviders(<TopNav {...defaultProps} activeTopNav={null} />);
      expect(screen.getByRole('button', { name: 'Settings' }))
        .toHaveAttribute('aria-expanded', 'false');
    });

    it('has aria-expanded="true" when settings dropdown is open', () => {
      renderWithProviders(<TopNav {...defaultProps} activeTopNav="settings" />);
      expect(screen.getByRole('button', { name: 'Settings' }))
        .toHaveAttribute('aria-expanded', 'true');
    });

    it('calls onOpenTopNav("settings") when clicked', () => {
      const onOpen = vi.fn();
      renderWithProviders(<TopNav {...defaultProps} onOpenTopNav={onOpen} />);
      fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
      expect(onOpen).toHaveBeenCalledWith('settings');
    });
  });

  describe('AI Assist button', () => {
    it('has an accessible label', () => {
      renderWithProviders(<TopNav {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Open AI Assist' })).toBeInTheDocument();
    });

    it('has aria-expanded="false" when AI panel is closed', () => {
      renderWithProviders(<TopNav {...defaultProps} activeTopNav={null} />);
      expect(screen.getByRole('button', { name: 'Open AI Assist' }))
        .toHaveAttribute('aria-expanded', 'false');
    });

    it('has aria-expanded="true" when AI panel is open', () => {
      renderWithProviders(<TopNav {...defaultProps} activeTopNav="ai-assist" />);
      expect(screen.getByRole('button', { name: 'Open AI Assist' }))
        .toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('user avatar button', () => {
    it('has an accessible label', () => {
      renderWithProviders(<TopNav {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'User profile' })).toBeInTheDocument();
    });

    it('has aria-haspopup="menu"', () => {
      renderWithProviders(<TopNav {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'User profile' }))
        .toHaveAttribute('aria-haspopup', 'menu');
    });
  });
});
