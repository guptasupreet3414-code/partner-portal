import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWorkspace } from '../context/WorkspaceContext';
import { customers } from '../data/partnerData';
import CertcentralIcon from '../assets/certcentral.svg?react';
import TrustLifecycleIcon from '../assets/trust-lifecycle.svg?react';
import PrivateCaIcon from '../assets/private-ca.svg?react';
import SoftwareTrustIcon from '../assets/software-trust.svg?react';
import DeviceTrustIcon from '../assets/device-trust.svg?react';

/* ─── Shared layout ─────────────────────────────────────────────────────── */

const PageWrapper = styled.main``;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0 0 4px;
`;

const PageSubtitle = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral600};
  margin: 0 0 6px;
`;

const ContextLine = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral500};
  margin-bottom: 20px;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 7px 12px;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral900};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.blue300};
  }
`;

/* ─── Two-column subscription card grid ─────────────────────────────────── */

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const SubscriptionCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.white};
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 16px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral100};
`;

const CardProductInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex: 1;
  min-width: 0;
`;

const ProductIconWrap = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 26px;
    height: 26px;
  }
`;

const CardProductName = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
  line-height: 1.2;
  margin-bottom: 3px;
`;

const CardAccountLabel = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral600};
`;

const RenewalBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 100px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  font-weight: 600;
  background: #D1FAE5;
  color: #065F46;
  white-space: nowrap;
  margin-top: 2px;
`;

const OverflowButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.neutral600};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
  transition: background 0.12s;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
  }
`;

const CardMeta = styled.div`
  padding: 10px 16px;
  display: flex;
  gap: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral100};
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const MetaLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.neutral500};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
`;

const MetaValue = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral900};
  font-weight: 500;
  margin-top: 1px;
`;

const CardEntitlements = styled.div`
  padding: 12px 16px;
`;

const EntitlementRow = styled.div`
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const EntitlementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const EntitlementLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral800};
`;

const EntitlementCount = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral700};
`;

const ProgressBar = styled.div`
  height: 6px;
  background: ${({ theme }) => theme.colors.neutral200};
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 3px;
`;

const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => Math.min($pct, 100)}%;
  background: ${({ $pct }) =>
    $pct >= 100 ? '#DC2626' : $pct >= 80 ? '#F59E0B' : '#1976D2'};
  border-radius: 3px;
`;

const EntitlementRemaining = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.neutral500};
`;

const CardFooter = styled.div`
  padding: 8px 16px 12px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral500};
  font-style: italic;
`;

/* ─── My workspace subscription data ───────────────────────────────────── */

interface MySubscription {
  productId: string;
  productLabel: string;
  accountLabel: string;
  accountName?: string;
  accountId?: string;
  tier: string;
  plan?: string;
  renewal?: string;
  managedBy: 'self' | 'account-manager';
  entitlements: { label: string; used: number; total: number }[];
}

const mySubscriptions: MySubscription[] = [
  {
    productId: 'certcentral',
    productLabel: 'CertCentral',
    accountLabel: 'Acme — US production',
    accountName: 'ACME DevOps',
    accountId: '3007234',
    tier: 'E-commerce',
    renewal: 'Renews Aug 1, 2026',
    managedBy: 'self',
    entitlements: [
      { label: 'SSL/TLS certificates', used: 3, total: 8 },
      { label: 'Code signing certificates', used: 2, total: 5 },
    ],
  },
  {
    productId: 'trust-lifecycle',
    productLabel: 'Trust Lifecycle',
    accountLabel: 'Acme — US production',
    tier: 'Enterprise',
    plan: 'Advanced',
    managedBy: 'account-manager',
    entitlements: [
      { label: 'Seats', used: 30, total: 75 },
    ],
  },
  {
    productId: 'software-trust',
    productLabel: 'Software Trust',
    accountLabel: 'Acme — US production',
    tier: 'Enterprise',
    plan: 'Premium',
    managedBy: 'account-manager',
    entitlements: [
      { label: 'Signatures', used: 124210, total: 250000 },
      { label: 'HSM keypairs', used: 2, total: 4 },
    ],
  },
  {
    productId: 'private-ca',
    productLabel: 'Private CA',
    accountLabel: 'Acme — US production',
    tier: 'Enterprise',
    managedBy: 'account-manager',
    entitlements: [
      { label: 'Private root certificates', used: 9, total: 10 },
      { label: 'Private intermediate CA certificates', used: 20, total: 25 },
      { label: 'Dynamic intermediate CAs', used: 38500, total: 50000 },
    ],
  },
  {
    productId: 'certcentral',
    productLabel: 'CertCentral',
    accountLabel: 'Acme — US production',
    accountName: 'ACME Global Security',
    accountId: '1001445',
    tier: 'Enterprise',
    managedBy: 'account-manager',
    entitlements: [
      { label: 'SSL/TLS certificates', used: 108, total: 100 },
      { label: 'Code signing certificates', used: 16, total: 24 },
      { label: 'S/MIME certificates', used: 140, total: 200 },
    ],
  },
  {
    productId: 'certcentral',
    productLabel: 'CertCentral',
    accountLabel: 'Acme — US production',
    accountName: 'ACME Marketing',
    accountId: '2003891',
    tier: 'Enterprise',
    managedBy: 'account-manager',
    entitlements: [
      { label: 'SSL/TLS certificates', used: 34, total: 50 },
      { label: 'Code signing certificates', used: 4, total: 10 },
      { label: 'S/MIME certificates', used: 62, total: 100 },
    ],
  },
  {
    productId: 'certcentral',
    productLabel: 'CertCentral',
    accountLabel: 'Acme — US production',
    accountName: 'ACME Enterprise',
    accountId: '5001298',
    tier: 'Enterprise',
    managedBy: 'account-manager',
    entitlements: [
      { label: 'SSL/TLS certificates', used: 55, total: 120 },
      { label: 'Code signing certificates', used: 18, total: 40 },
      { label: 'S/MIME certificates', used: 210, total: 300 },
    ],
  },
];

/* ─── Partner subscription data ─────────────────────────────────────────── */

interface PartnerSubscription {
  productId: string;
  productLabel: string;
  customerId: string;
  customerName: string;
  accountId?: string;
  tier: string;
  plan?: string;
  renewal?: string;
  managedBy: 'self' | 'account-manager';
  entitlements: { label: string; used: number; total: number }[];
}

const partnerSubscriptions: PartnerSubscription[] = [
  {
    productId: 'certcentral',
    productLabel: 'CertCentral',
    customerId: 'acme-corp',
    customerName: 'Acme Corp',
    accountId: '3007254',
    tier: 'Enterprise',
    plan: 'Advanced',
    renewal: 'Renews Mar 1, 2026',
    managedBy: 'account-manager',
    entitlements: [
      { label: 'SSL/TLS certificates', used: 108, total: 150 },
      { label: 'Code signing certificates', used: 12, total: 20 },
      { label: 'S/MIME certificates', used: 68, total: 100 },
    ],
  },
  {
    productId: 'trust-lifecycle',
    productLabel: 'Trust Lifecycle',
    customerId: 'globex',
    customerName: 'Globex Corporation',
    tier: 'Enterprise',
    plan: 'Advanced',
    renewal: 'Renews Nov 8, 2026',
    managedBy: 'account-manager',
    entitlements: [
      { label: 'Seats', used: 70, total: 75 },
    ],
  },
  {
    productId: 'private-ca',
    productLabel: 'Private CA',
    customerId: 'contoso',
    customerName: 'Contoso Ltd.',
    tier: 'Enterprise',
    managedBy: 'account-manager',
    entitlements: [
      { label: 'Private root certificates', used: 10, total: 10 },
      { label: 'Private intermediate CA certificates', used: 20, total: 25 },
      { label: 'Dynamic intermediate CAs', used: 38500, total: 50000 },
    ],
  },
  {
    productId: 'software-trust',
    productLabel: 'Software Trust',
    customerId: 'initech',
    customerName: 'Initech',
    tier: 'Enterprise',
    plan: 'Premium',
    managedBy: 'account-manager',
    entitlements: [
      { label: 'Signatures', used: 99400, total: 250000 },
      { label: 'HSM keypairs', used: 1, total: 4 },
    ],
  },
  {
    productId: 'certcentral',
    productLabel: 'CertCentral',
    customerId: 'umbrella',
    customerName: 'Umbrella Inc.',
    tier: 'Enterprise',
    plan: 'Advanced',
    managedBy: 'account-manager',
    entitlements: [
      { label: 'SSL/TLS certificates', used: 55, total: 100 },
      { label: 'Code signing certificates', used: 18, total: 40 },
      { label: 'S/MIME certificates', used: 210, total: 300 },
    ],
  },
  {
    productId: 'certcentral',
    productLabel: 'CertCentral',
    customerId: 'contoso',
    customerName: 'Contoso Ltd.',
    tier: 'Enterprise',
    managedBy: 'account-manager',
    entitlements: [
      { label: 'SSL/TLS certificates', used: 55, total: 120 },
      { label: 'Code signing certificates', used: 18, total: 40 },
      { label: 'S/MIME certificates', used: 210, total: 300 },
    ],
  },
];

const productIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  certcentral: CertcentralIcon,
  'trust-lifecycle': TrustLifecycleIcon,
  'private-ca': PrivateCaIcon,
  'software-trust': SoftwareTrustIcon,
  'device-trust': DeviceTrustIcon,
};

const uniquePartnerProducts = [...new Set(partnerSubscriptions.map(s => s.productLabel))].sort();

export const MySubscriptionsPage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const isPartner = activeWorkspace === 'partner';
  const [customerFilter, setCustomerFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');

  useEffect(() => {
    document.title = isPartner
      ? 'Customer subscriptions — DigiCert ONE'
      : 'My subscriptions — DigiCert ONE';
  }, [isPartner]);

  const filteredPartner = partnerSubscriptions.filter(s => {
    const matchCustomer = customerFilter === 'all' || s.customerId === customerFilter;
    const matchProduct = productFilter === 'all' || s.productLabel === productFilter;
    return matchCustomer && matchProduct;
  });

  return (
    <PageWrapper>
      <PageTitle>{isPartner ? 'Customer subscriptions' : 'My subscriptions'}</PageTitle>
      <PageSubtitle>
        {isPartner
          ? 'View product subscriptions, entitlement usage, and renewal information across your managed customers.'
          : 'View your active product subscriptions, entitlement usage, and renewal information.'}
      </PageSubtitle>
      <ContextLine>
        {isPartner ? 'Partner workspace · ABC Security' : 'My workspace · ABC Security'}
      </ContextLine>

      <Toolbar>
        {isPartner ? (
          <>
            <FilterSelect
              value={customerFilter}
              onChange={e => setCustomerFilter(e.target.value)}
              aria-label="Filter by customer"
            >
              <option value="all">All customers</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </FilterSelect>
            <FilterSelect
              value={productFilter}
              onChange={e => setProductFilter(e.target.value)}
              aria-label="Filter by product"
            >
              <option value="all">All products</option>
              {uniquePartnerProducts.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </FilterSelect>
          </>
        ) : (
          <>
            <FilterSelect defaultValue="acme-us" aria-label="Select environment">
              <option value="acme-us">Acme — US production</option>
            </FilterSelect>
            <FilterSelect defaultValue="all" aria-label="Filter by product">
              <option value="all">All products</option>
            </FilterSelect>
          </>
        )}
      </Toolbar>

      {isPartner ? (
        <CardsGrid>
          {filteredPartner.map((sub, idx) => {
            const Icon = productIcons[sub.productId];
            return (
              <SubscriptionCard key={idx}>
                <CardHeader>
                  <CardProductInfo>
                    <ProductIconWrap>
                      {Icon && <Icon aria-hidden="true" focusable="false" />}
                    </ProductIconWrap>
                    <div>
                      <CardProductName>{sub.productLabel}</CardProductName>
                      <CardAccountLabel>{sub.customerName}</CardAccountLabel>
                      {sub.renewal && <RenewalBadge>{sub.renewal}</RenewalBadge>}
                    </div>
                  </CardProductInfo>
                  <OverflowButton aria-label="More options">⋯</OverflowButton>
                </CardHeader>

                <CardMeta>
                  <MetaItem>
                    <MetaLabel>Tier</MetaLabel>
                    <MetaValue>{sub.tier}</MetaValue>
                  </MetaItem>
                  {sub.plan && (
                    <MetaItem>
                      <MetaLabel>Plan</MetaLabel>
                      <MetaValue>{sub.plan}</MetaValue>
                    </MetaItem>
                  )}
                  {sub.accountId && (
                    <MetaItem>
                      <MetaLabel>Account ID</MetaLabel>
                      <MetaValue>{sub.accountId}</MetaValue>
                    </MetaItem>
                  )}
                </CardMeta>

                <CardEntitlements>
                  {sub.entitlements.map(ent => {
                    const pct = Math.round((ent.used / ent.total) * 100);
                    const remaining = ent.total - ent.used;
                    const isOver = ent.used > ent.total;
                    return (
                      <EntitlementRow key={ent.label}>
                        <EntitlementHeader>
                          <EntitlementLabel>{ent.label}</EntitlementLabel>
                          <EntitlementCount>
                            {ent.used.toLocaleString()} / {ent.total.toLocaleString()}
                          </EntitlementCount>
                        </EntitlementHeader>
                        <ProgressBar>
                          <ProgressFill $pct={pct} />
                        </ProgressBar>
                        <EntitlementRemaining>
                          {isOver
                            ? `Over by ${Math.abs(remaining).toLocaleString()}`
                            : `${remaining.toLocaleString()} remaining`}
                        </EntitlementRemaining>
                      </EntitlementRow>
                    );
                  })}
                </CardEntitlements>

                <CardFooter>
                  {sub.managedBy === 'account-manager'
                    ? 'Managed by your Account Manager'
                    : 'Self-service subscription'}
                </CardFooter>
              </SubscriptionCard>
            );
          })}
          {filteredPartner.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#757D82', padding: '40px', fontFamily: 'Roboto, sans-serif' }}>
              No subscriptions match your filters.
            </div>
          )}
        </CardsGrid>
      ) : (
        <CardsGrid>
          {mySubscriptions.map((sub, idx) => {
            const Icon = productIcons[sub.productId];
            return (
              <SubscriptionCard key={idx}>
                <CardHeader>
                  <CardProductInfo>
                    <ProductIconWrap>
                      {Icon && <Icon aria-hidden="true" focusable="false" />}
                    </ProductIconWrap>
                    <div>
                      <CardProductName>{sub.productLabel}</CardProductName>
                      <CardAccountLabel>{sub.accountLabel}</CardAccountLabel>
                      {sub.renewal && <RenewalBadge>{sub.renewal}</RenewalBadge>}
                    </div>
                  </CardProductInfo>
                  <OverflowButton aria-label="More options">⋯</OverflowButton>
                </CardHeader>

                <CardMeta>
                  <MetaItem>
                    <MetaLabel>Tier</MetaLabel>
                    <MetaValue>{sub.tier}</MetaValue>
                  </MetaItem>
                  {sub.plan && (
                    <MetaItem>
                      <MetaLabel>Plan</MetaLabel>
                      <MetaValue>{sub.plan}</MetaValue>
                    </MetaItem>
                  )}
                  {sub.accountName && (
                    <MetaItem>
                      <MetaLabel>Account name</MetaLabel>
                      <MetaValue>{sub.accountName}</MetaValue>
                    </MetaItem>
                  )}
                  {sub.accountId && (
                    <MetaItem>
                      <MetaLabel>Account ID</MetaLabel>
                      <MetaValue>{sub.accountId}</MetaValue>
                    </MetaItem>
                  )}
                </CardMeta>

                <CardEntitlements>
                  {sub.entitlements.map(ent => {
                    const pct = Math.round((ent.used / ent.total) * 100);
                    const remaining = ent.total - ent.used;
                    const isOver = ent.used > ent.total;
                    return (
                      <EntitlementRow key={ent.label}>
                        <EntitlementHeader>
                          <EntitlementLabel>{ent.label}</EntitlementLabel>
                          <EntitlementCount>
                            {ent.used.toLocaleString()} / {ent.total.toLocaleString()}
                          </EntitlementCount>
                        </EntitlementHeader>
                        <ProgressBar>
                          <ProgressFill $pct={pct} />
                        </ProgressBar>
                        <EntitlementRemaining>
                          {isOver
                            ? `Over by ${Math.abs(remaining).toLocaleString()}`
                            : `${remaining.toLocaleString()} remaining`}
                        </EntitlementRemaining>
                      </EntitlementRow>
                    );
                  })}
                </CardEntitlements>

                <CardFooter>
                  {sub.managedBy === 'account-manager'
                    ? 'Managed by your Account Manager'
                    : 'Self-service subscription'}
                </CardFooter>
              </SubscriptionCard>
            );
          })}
        </CardsGrid>
      )}
    </PageWrapper>
  );
};
