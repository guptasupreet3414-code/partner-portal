import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { NavDrawer } from '../NavDrawer';

const defaultProps = {
  open: false,
  activeProductId: 'certcentral',
  onSelectProduct: vi.fn(),
  onClose: vi.fn(),
  isMobile: false,
};

describe('NavDrawer', () => {
  describe('closed state', () => {
    it('has aria-hidden="true" when closed', () => {
      renderWithProviders(<NavDrawer {...defaultProps} open={false} />);
      const panel = document.getElementById('nav-drawer');
      expect(panel).toHaveAttribute('aria-hidden', 'true');
    });

    it('has the inert attribute when closed', () => {
      renderWithProviders(<NavDrawer {...defaultProps} open={false} />);
      const panel = document.getElementById('nav-drawer');
      expect(panel).toHaveAttribute('inert');
    });
  });

  describe('open state', () => {
    it('does not have aria-hidden when open', () => {
      renderWithProviders(<NavDrawer {...defaultProps} open={true} />);
      const panel = document.getElementById('nav-drawer');
      expect(panel).not.toHaveAttribute('aria-hidden', 'true');
    });

    it('does not have inert when open', () => {
      renderWithProviders(<NavDrawer {...defaultProps} open={true} />);
      const panel = document.getElementById('nav-drawer');
      expect(panel).not.toHaveAttribute('inert');
    });

    it('has role="dialog"', () => {
      renderWithProviders(<NavDrawer {...defaultProps} open={true} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has aria-modal="true"', () => {
      renderWithProviders(<NavDrawer {...defaultProps} open={true} />);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('has an accessible label on the dialog', () => {
      renderWithProviders(<NavDrawer {...defaultProps} open={true} />);
      expect(screen.getByRole('dialog', { name: 'Navigation menu' })).toBeInTheDocument();
    });
  });

  describe('keyboard interaction', () => {
    it('calls onClose when Escape is pressed while open', () => {
      const onClose = vi.fn();
      renderWithProviders(<NavDrawer {...defaultProps} open={true} onClose={onClose} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when Escape is pressed while closed', () => {
      const onClose = vi.fn();
      renderWithProviders(<NavDrawer {...defaultProps} open={false} onClose={onClose} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('backdrop', () => {
    it('calls onClose when the backdrop is clicked', () => {
      const onClose = vi.fn();
      renderWithProviders(<NavDrawer {...defaultProps} open={true} onClose={onClose} />);
      // Backdrop is aria-hidden so query by its position in the DOM
      const backdrop = document.querySelector('[aria-hidden="true"]:not([role="tooltip"])');
      expect(backdrop).toBeInTheDocument();
      fireEvent.click(backdrop!);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('desktop flat list', () => {
    it('renders a product navigation list', () => {
      renderWithProviders(<NavDrawer {...defaultProps} open={true} isMobile={false} />);
      expect(screen.getByRole('navigation', { name: 'Product list' })).toBeInTheDocument();
    });

    it('renders product buttons for all rail items', () => {
      renderWithProviders(<NavDrawer {...defaultProps} open={true} isMobile={false} />);
      expect(screen.getByRole('button', { name: /CertCentral/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Trust Lifecycle/ })).toBeInTheDocument();
    });

    it('marks the active product with aria-current="page"', () => {
      renderWithProviders(
        <NavDrawer {...defaultProps} open={true} isMobile={false} activeProductId="certcentral" />
      );
      const activeBtn = screen.getByRole('button', { name: /CertCentral/ });
      expect(activeBtn).toHaveAttribute('aria-current', 'page');
    });
  });
});
