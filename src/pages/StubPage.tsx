import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { findItemByRoute, getBreadcrumbs } from '../data/navConfig';

const PageWrapper = styled.main``;

const Breadcrumbs = styled.nav`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral600};
  margin: 0 0 16px;

  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }

  li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  a {
    color: ${({ theme }) => theme.colors.neutral600};
    text-decoration: none;
    border-radius: 2px;

    &:hover {
      color: ${({ theme }) => theme.colors.neutral900};
      text-decoration: underline;
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.blue300};
      outline-offset: 2px;
    }
  }

  [aria-current='page'] {
    color: ${({ theme }) => theme.colors.neutral900};
  }
`;

const Separator = styled.span`
  color: ${({ theme }) => theme.colors.neutral400};
  user-select: none;
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 32px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0 0 8px;
`;

const PageSubtitle = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral600};
  margin: 0;
`;

/* Fallback labels for routes that aren't items in productNavConfig (settings, profile, etc.) */
const fallbackLabels: Record<string, string> = {
  '/': 'Home',
  '/settings/users': 'Users',
  '/settings/users/groups': 'Groups',
  '/settings/billing': 'My subscriptions',
  '/settings/billing/receipts': 'Receipts',
  '/settings/billing/payment-details': 'Payment details',
  '/settings/account': 'Identity and access',
  '/settings/product': 'Product settings',
  '/settings/integrations': 'Integrations',
  '/settings/api': 'API access',
  '/settings/audit-logs': 'Audit logs',
  '/profile': 'My profile',
};

export const StubPage: React.FC = () => {
  const location = useLocation();
  const match = findItemByRoute(location.pathname);
  const label = match?.item.label ?? fallbackLabels[location.pathname] ?? location.pathname;
  const crumbs = getBreadcrumbs(location.pathname);

  useEffect(() => {
    document.title = `${label} — DigiCert ONE`;
  }, [label]);

  return (
    <PageWrapper>
      {crumbs.length > 0 && (
        <Breadcrumbs aria-label="Breadcrumb">
          <ol>
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <li key={`${crumb.label}-${i}`}>
                  {!isLast && crumb.route ? (
                    <Link to={crumb.route}>{crumb.label}</Link>
                  ) : (
                    <span aria-current={isLast ? 'page' : undefined}>{crumb.label}</span>
                  )}
                  {!isLast && <Separator aria-hidden="true">/</Separator>}
                </li>
              );
            })}
          </ol>
        </Breadcrumbs>
      )}

      <PageTitle>{label}</PageTitle>
      {location.pathname === '/profile' && (
        <PageSubtitle style={{ marginBottom: '8px', fontWeight: 500, color: '#353535' }}>
          Deepika Chauhan
        </PageSubtitle>
      )}
      <PageSubtitle>This is a stub page for <code>{location.pathname}</code></PageSubtitle>
    </PageWrapper>
  );
};
