import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { NavSection } from '../NavSection';
import type { NavSection as NavSectionType } from '../../../data/navConfig';

const dashboardSection: NavSectionType = {
  title: '',
  defaultExpanded: true,
  items: [
    { label: 'Value dashboard', route: '/dashboard' },
    { label: 'Client tools insights', route: '/dashboard/clients-tools' },
  ],
};

const certSection: NavSectionType = {
  title: 'OVERVIEW',
  defaultExpanded: true,
  items: [
    { label: 'Dashboard', route: '/certcentral/dashboard' },
    { label: 'Reports', route: '/certcentral/reports' },
  ],
};

describe('NavSection', () => {
  describe('link semantics', () => {
    it('renders each item as an anchor element', () => {
      renderWithProviders(
        <NavSection section={dashboardSection} index={0} />,
        { initialPath: '/dashboard' }
      );
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
    });

    it('does not assign role="listitem" to nav links', () => {
      renderWithProviders(
        <NavSection section={dashboardSection} index={0} />,
        { initialPath: '/dashboard' }
      );
      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
    });
  });

  describe('active state', () => {
    it('marks the exact matching route with aria-current="page"', () => {
      renderWithProviders(
        <NavSection section={dashboardSection} index={0} />,
        { initialPath: '/dashboard' }
      );
      const activeLink = screen.getByRole('link', { name: 'Value dashboard' });
      expect(activeLink).toHaveAttribute('aria-current', 'page');
    });

    it('does not mark a non-active route with aria-current', () => {
      renderWithProviders(
        <NavSection section={dashboardSection} index={0} />,
        { initialPath: '/dashboard' }
      );
      const inactiveLink = screen.getByRole('link', { name: 'Client tools insights' });
      expect(inactiveLink).not.toHaveAttribute('aria-current');
    });

    it('does not mark /dashboard active when at a child route /dashboard/clients-tools', () => {
      renderWithProviders(
        <NavSection section={dashboardSection} index={0} />,
        { initialPath: '/dashboard/clients-tools' }
      );
      const parentLink = screen.getByRole('link', { name: 'Value dashboard' });
      const childLink = screen.getByRole('link', { name: 'Client tools insights' });
      expect(parentLink).not.toHaveAttribute('aria-current', 'page');
      expect(childLink).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('accordion behaviour', () => {
    it('renders items as visible when defaultExpanded is true', () => {
      renderWithProviders(
        <NavSection section={certSection} index={0} />,
        { initialPath: '/certcentral/dashboard' }
      );
      expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    });

    it('section header button has aria-expanded="true" when open', () => {
      renderWithProviders(
        <NavSection section={certSection} index={0} />,
        { initialPath: '/certcentral/dashboard' }
      );
      const header = screen.getByRole('button', { name: /OVERVIEW/i });
      expect(header).toHaveAttribute('aria-expanded', 'true');
    });

    it('collapses items and sets aria-expanded="false" when header is clicked', () => {
      renderWithProviders(
        <NavSection section={certSection} index={0} />,
        { initialPath: '/certcentral/dashboard' }
      );
      const header = screen.getByRole('button', { name: /OVERVIEW/i });
      fireEvent.click(header);
      expect(header).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggles back open on a second click', () => {
      renderWithProviders(
        <NavSection section={certSection} index={0} />,
        { initialPath: '/certcentral/dashboard' }
      );
      const header = screen.getByRole('button', { name: /OVERVIEW/i });
      fireEvent.click(header);
      fireEvent.click(header);
      expect(header).toHaveAttribute('aria-expanded', 'true');
    });

    it('section header has aria-controls pointing to the items container', () => {
      renderWithProviders(
        <NavSection section={certSection} index={0} />,
        { initialPath: '/certcentral/dashboard' }
      );
      const header = screen.getByRole('button', { name: /OVERVIEW/i });
      const controlsId = header.getAttribute('aria-controls');
      expect(controlsId).toBeTruthy();
      expect(document.getElementById(controlsId!)).toBeInTheDocument();
    });
  });

  describe('section without a title', () => {
    it('renders items directly without a toggle button', () => {
      renderWithProviders(
        <NavSection section={dashboardSection} index={0} />,
        { initialPath: '/dashboard' }
      );
      // No button — title is empty string so SectionHeader is display:none
      const buttons = screen.queryAllByRole('button');
      expect(buttons).toHaveLength(0);
    });
  });
});
