import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight, faPlus, faArrowUpRightFromSquare, faEllipsis,
} from '@fortawesome/free-solid-svg-icons';
import {
  getCustomerById, activityEvents, formatNumber,
} from '../../data/partnerData';
import CertcentralIcon from '../../assets/certcentral.svg?react';
import TrustLifecycleIcon from '../../assets/trust-lifecycle.svg?react';
import PrivateCaIcon from '../../assets/private-ca.svg?react';
import SoftwareTrustIcon from '../../assets/software-trust.svg?react';
import DeviceTrustIcon from '../../assets/device-trust.svg?react';
import DigicertDnsIcon from '../../assets/digicert-dns.svg?react';

/* ── Product metadata ────────────────────────────────────────────── */

const productIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  certcentral:       CertcentralIcon,
  'trust-lifecycle': TrustLifecycleIcon,
  'private-ca':      PrivateCaIcon,
  'software-trust':  SoftwareTrustIcon,
  'device-trust':    DeviceTrustIcon,
  dns:               DigicertDnsIcon,
};

const productDescription: Record<string, string> = {
  certcentral:       'Public certificates',
  'trust-lifecycle': 'Digital trust automation',
  'private-ca':      'Internal PKI',
  'software-trust':  'Code signing',
  'device-trust':    'IoT device identities',
  dns:               'DNS management',
};

const customerStaticMeta: Record<string, { industry: string; tier: string; regionLabel: string; contact: string }> = {
  'acme-corp':  { industry: 'Manufacturing',      tier: 'Enterprise', regionLabel: 'NA · United States',  contact: 'j.doe@acmecorp.com' },
  globex:       { industry: 'Energy',             tier: 'Enterprise', regionLabel: 'EMEA · Germany',      contact: 'm.weber@globex.com' },
  contoso:      { industry: 'Financial services', tier: 'Business',   regionLabel: 'NA · Canada',         contact: 'd.park@contoso.com' },
  initech:      { industry: 'Software',           tier: 'Business',   regionLabel: 'NA · United States',  contact: 'l.torres@initech.com' },
  umbrella:     { industry: 'Healthcare',         tier: 'Enterprise', regionLabel: 'APAC · Singapore',    contact: 'a.kovacs@umbrella.com' },
};

/* ── Helpers ─────────────────────────────────────────────────────── */

function formatRelativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const h = Math.floor(ms / 3600000);
  if (h < 1) return '< 1h ago';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

/* ── Page shell ──────────────────────────────────────────────────── */

const PageWrapper = styled.main``;

const BackLink = styled.button`
  display: inline-flex; align-items: center; gap: 5px;
  padding: 0; border: none; background: transparent;
  color: ${({ theme }) => theme.colors.blue300};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; cursor: pointer; margin-bottom: 16px;
  &:hover { text-decoration: underline; }
`;

/* ── Page header ─────────────────────────────────────────────────── */

const PageHeader = styled.div`
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 20px; margin-bottom: 24px; flex-wrap: wrap;
`;

const TitleBlock = styled.div``;

const TitleRow = styled.div`
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 6px;
`;

const CustomerNameH1 = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 28px; font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900}; margin: 0;
`;

const HealthBadge = styled.span<{ $health: string }>`
  padding: 4px 12px; border-radius: 100px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; font-weight: 600; flex-shrink: 0;
  background: ${({ $health }) =>
    $health === 'Healthy' ? '#D1FAE5' : $health === 'Needs attention' ? '#FEF3C7' : '#FEE2E2'};
  color: ${({ $health }) =>
    $health === 'Healthy' ? '#065F46' : $health === 'Needs attention' ? '#92400E' : '#991B1B'};
`;

const MetaLine = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; color: ${({ theme }) => theme.colors.neutral500};
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
`;

const MetaDot = styled.span`color: ${({ theme }) => theme.colors.neutral300};`;

const HeaderActions = styled.div`
  display: flex; gap: 10px; align-items: center; flex-shrink: 0;
`;

const SecondaryBtn = styled.button`
  padding: 7px 14px;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.neutral900};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; font-weight: 500; cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  &:hover { background: ${({ theme }) => theme.colors.neutral100}; }
`;

const PrimaryBtn = styled(SecondaryBtn)`
  background: ${({ theme }) => theme.colors.blue300};
  border-color: ${({ theme }) => theme.colors.blue300};
  color: white;
  &:hover { background: ${({ theme }) => theme.colors.blue500}; border-color: ${({ theme }) => theme.colors.blue500}; }
`;

/* ── KPI cards ───────────────────────────────────────────────────── */

const KpiRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px; margin-bottom: 28px;
  @media (max-width: 800px) { grid-template-columns: repeat(2, 1fr); }
`;

const KpiCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 18px 20px;
  background: ${({ theme }) => theme.colors.white};
`;

const KpiLabel = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.05em; color: ${({ theme }) => theme.colors.neutral500};
  margin-bottom: 10px;
`;

const KpiValue = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 32px; font-weight: 700; color: ${({ theme }) => theme.colors.neutral900};
  line-height: 1.1; margin-bottom: 4px;
`;

const KpiValueSmall = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px; font-weight: 500; color: ${({ theme }) => theme.colors.neutral800};
  line-height: 1.4; margin-bottom: 4px;
`;

const KpiSub = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; color: ${({ theme }) => theme.colors.neutral600};
`;

/* ── Generic section card ────────────────────────────────────────── */

const SectionCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  margin-bottom: 16px;
  background: ${({ theme }) => theme.colors.white};
`;

const SectionHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  gap: 12px; flex-wrap: wrap;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px; font-weight: 600; color: ${({ theme }) => theme.colors.neutral900}; margin: 0;
`;

const SectionSubtitle = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; color: ${({ theme }) => theme.colors.neutral500};
`;

const AddServiceBtn = styled.button`
  padding: 6px 14px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.blue300};
  color: white;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; font-weight: 500; cursor: pointer; flex-shrink: 0;
  display: inline-flex; align-items: center; gap: 6px;
  transition: ${({ theme }) => theme.transitions.default};
  &:hover { background: ${({ theme }) => theme.colors.blue500}; }
`;

/* ── Service accordion rows ──────────────────────────────────────── */

const ServiceRow = styled.div<{ $expanded: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  &:last-of-type { border-bottom: none; }
`;

const ServiceRowTop = styled.div`
  display: flex; align-items: center; gap: 14px;
  padding: 16px 20px; cursor: pointer;
  &:hover { background: rgba(0,0,0,0.015); }
`;

const ExpandChevron = styled.div<{ $open: boolean }>`
  color: ${({ theme }) => theme.colors.neutral400};
  font-size: 11px; flex-shrink: 0; width: 14px;
  transition: transform 0.18s ease;
  transform: ${({ $open }) => $open ? 'rotate(90deg)' : 'rotate(0deg)'};
`;

const ServiceIconWrap = styled.div`
  width: 36px; height: 36px; border-radius: 8px;
  background: #F0F6FF; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  svg { width: 22px; height: 22px; }
`;

const ServiceRowInfo = styled.div`
  flex: 1; min-width: 0;
`;

const ServiceRowNameRow = styled.div`
  display: flex; align-items: center; gap: 8px; margin-bottom: 3px; flex-wrap: wrap;
`;

const ServiceRowName = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px; font-weight: 600; color: ${({ theme }) => theme.colors.neutral900};
`;

const ServiceStatusPill = styled.span<{ $status: string }>`
  padding: 2px 8px; border-radius: 100px; font-size: 11px; font-weight: 600; white-space: nowrap; flex-shrink: 0;
  background: ${({ $status }) =>
    $status === 'Active' ? '#D1FAE5' :
    $status === 'Provisioning' ? '#DBEAFE' :
    $status === 'Failed' ? '#FEE2E2' : '#F3F4F6'};
  color: ${({ $status }) =>
    $status === 'Active' ? '#065F46' :
    $status === 'Provisioning' ? '#1E40AF' :
    $status === 'Failed' ? '#991B1B' : '#6B7280'};
`;

const ServiceRowDesc = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; color: ${({ theme }) => theme.colors.neutral500};
`;

const ServiceRowRight = styled.div`
  display: flex; align-items: center; gap: 16px; flex-shrink: 0;
`;

const ServiceUtil = styled.div`
  text-align: right; min-width: 100px;
`;

const ServiceUtilBar = styled.div`
  height: 4px; width: 100px; border-radius: 2px;
  background: ${({ theme }) => theme.colors.neutral200}; overflow: hidden; margin-bottom: 3px;
`;

const ServiceUtilFill = styled.div<{ $pct: number }>`
  height: 100%; width: ${({ $pct }) => Math.min($pct, 100)}%;
  background: ${({ $pct }) => $pct >= 90 ? '#DC2626' : $pct >= 70 ? '#F59E0B' : '#1976D2'};
`;

const ServiceUtilText = styled.div<{ $pct: number }>`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; font-weight: 500; text-align: right;
  color: ${({ $pct }) => $pct >= 90 ? '#DC2626' : $pct >= 70 ? '#D97706' : '#4B5563'};
`;

const ServiceRowActions = styled.div`
  display: flex; align-items: center; gap: 8px;
`;

const OpenProductBtn = styled.button`
  padding: 5px 12px; border: 1px solid ${({ theme }) => theme.colors.blue300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: transparent; color: ${({ theme }) => theme.colors.blue300};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; font-weight: 500; cursor: pointer; flex-shrink: 0;
  display: inline-flex; align-items: center; gap: 5px;
  transition: ${({ theme }) => theme.transitions.default};
  &:hover { background: #F0F6FF; }
`;

const MoreBtn = styled.button`
  width: 30px; height: 30px; border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.neutral500};
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 12px;
  &:hover { background: ${({ theme }) => theme.colors.neutral100}; }
`;

const NoUtilText = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; color: ${({ theme }) => theme.colors.neutral400};
`;

/* ── Entitlement breakdown (expanded) ────────────────────────────── */

const EntBreakdown = styled.div`
  padding: 0 20px 20px 72px;
  background: ${({ theme }) => theme.colors.neutral50};
`;

const EntSectionLabel = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.neutral700};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral300};
  padding-top: 14px; margin-bottom: 14px;
`;

const EntItem = styled.div`
  margin-bottom: 14px;
  &:last-child { margin-bottom: 0; }
`;

const EntItemTop = styled.div`
  display: flex; align-items: baseline; justify-content: space-between;
  margin-bottom: 6px;
`;

const EntItemName = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; font-weight: 500; color: ${({ theme }) => theme.colors.neutral900};
`;

const EntItemCount = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; color: ${({ theme }) => theme.colors.neutral700};
  white-space: nowrap; margin-left: 12px;
`;

const EntBar = styled.div`
  height: 5px; background: ${({ theme }) => theme.colors.neutral200};
  border-radius: 3px; overflow: hidden; margin-bottom: 4px;
`;

const EntBarFill = styled.div<{ $pct: number }>`
  height: 100%; width: ${({ $pct }) => Math.min($pct, 100)}%;
  background: ${({ $pct }) => $pct >= 100 ? '#DC2626' : $pct >= 80 ? '#F59E0B' : '#1976D2'};
  border-radius: 3px;
`;

const EntItemSub = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px; color: ${({ theme }) => theme.colors.neutral600};
`;

/* ── Bottom 2-col: available services + activity ─────────────────── */

const BottomTwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 800px) { grid-template-columns: 1fr; }
`;

const AvailPadding = styled.div`
  padding: 16px 20px;
`;

const AvailChips = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px;
`;

const AvailChip = styled.button`
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  &:hover { border-color: ${({ theme }) => theme.colors.blue300}; background: #F0F6FF; }
`;

const AvailChipIcon = styled.div`
  width: 20px; height: 20px; opacity: 0.55;
  svg { width: 18px; height: 18px; }
`;

const AvailChipName = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; font-weight: 500; color: ${({ theme }) => theme.colors.neutral700};
`;

const AvailChipPlus = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 15px; font-weight: 300; color: ${({ theme }) => theme.colors.neutral400};
`;

/* ── Activity section (full width, no sticky) ────────────────────── */

const ActivityCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.white}; overflow: hidden;
`;

const ActivityCardHeader = styled.div`
  padding: 14px 20px; border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  display: flex; align-items: center; justify-content: space-between;
`;

const ActivityCardTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px; font-weight: 600; color: ${({ theme }) => theme.colors.neutral900}; margin: 0;
`;

const SeeAllLink = styled.button`
  background: none; border: none; padding: 0; cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; color: ${({ theme }) => theme.colors.blue300};
  &:hover { text-decoration: underline; }
`;

const ActivityGrid = styled.div``;

const ActivityItem = styled.div`
  padding: 14px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral100};
  &:last-child { border-bottom: none; }
`;

const ActivityTop = styled.div`
  display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 3px;
`;

const ActivityEventName = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; font-weight: 600; color: ${({ theme }) => theme.colors.neutral900}; line-height: 1.3;
`;

const ActivityBadge = styled.span<{ $status: string }>`
  padding: 2px 8px; border-radius: 100px; font-size: 11px; font-weight: 600; flex-shrink: 0;
  background: ${({ $status }) =>
    $status === 'Completed' ? '#D1FAE5' : $status === 'Failed' ? '#FEE2E2' :
    $status === 'Warning' ? '#FEF3C7' : '#DBEAFE'};
  color: ${({ $status }) =>
    $status === 'Completed' ? '#065F46' : $status === 'Failed' ? '#991B1B' :
    $status === 'Warning' ? '#92400E' : '#1E40AF'};
`;

const ActivityMeta = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; color: ${({ theme }) => theme.colors.neutral500};
`;

const NotFound = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 16px; color: ${({ theme }) => theme.colors.neutral700}; padding: 40px 0;
`;

/* ── Component ───────────────────────────────────────────────────── */

export const CustomerDetailPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const customer = getCustomerById(customerId ?? '');

  useEffect(() => {
    if (customer) document.title = `${customer.name} — Partner workspace — DigiCert ONE`;
  }, [customer]);

  if (!customer) return <PageWrapper><NotFound>Customer not found.</NotFound></PageWrapper>;

  const enabledServices  = customer.services.filter(s => s.enabled);
  const disabledServices = customer.services.filter(s => !s.enabled);
  const customerActivity = activityEvents.filter(e => e.customerId === customer.id);
  const staticMeta = customerStaticMeta[customer.id];
  const allActivity = [
    ...customerActivity,
    {
      id: 'static-1', timestamp: '2026-08-18T09:00:00Z',
      customerId: customer.id, customerName: customer.name,
      productId: 'platform', productLabel: 'Platform',
      activity: 'Customer account created',
      status: 'Completed' as const, performedBy: 'admin@abc-security.com',
    },
  ];

  const toggleExpand = (productId: string) => {
    setExpandedServices(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId); else next.add(productId);
      return next;
    });
  };

  const getUtil = (productId: string) => {
    const pe = customer.entitlements.find(e => e.productId === productId);
    if (!pe || pe.entitlements.length === 0) return null;
    const maxPct = Math.max(...pe.entitlements.map(e => Math.round((e.used / e.total) * 100)));
    return { pct: maxPct, pe };
  };

  /* Sub-text: "Public certificates · 3 entitlement types" */
  const getServiceDesc = (productId: string): string => {
    const desc = productDescription[productId] ?? '';
    const pe = customer.entitlements.find(e => e.productId === productId);
    if (!pe || pe.entitlements.length === 0) return desc;
    const n = pe.entitlements.length;
    return `${desc} · ${n} entitlement type${n !== 1 ? 's' : ''}`;
  };

  return (
    <PageWrapper>
      <BackLink onClick={() => navigate('/partner/customers')}>← Customers</BackLink>

      <PageHeader>
        <TitleBlock>
          <TitleRow>
            <CustomerNameH1>{customer.name}</CustomerNameH1>
            <HealthBadge $health={customer.health}>{customer.health}</HealthBadge>
          </TitleRow>
          <MetaLine>
            <span>{staticMeta?.tier ?? 'Enterprise'} plan</span>
            <MetaDot>·</MetaDot>
            <span>{staticMeta?.industry ?? 'Technology'}</span>
            <MetaDot>·</MetaDot>
            <span>{staticMeta?.regionLabel ?? customer.region}</span>
            <MetaDot>·</MetaDot>
            <span>Account ID: CUS-{customer.id.toUpperCase()}</span>
          </MetaLine>
        </TitleBlock>
        <HeaderActions>
          <SecondaryBtn onClick={() => navigate(`/settings/users?customer=${customer.id}`)}>
            Manage users
          </SecondaryBtn>
          <PrimaryBtn onClick={() => navigate('/settings/account')}>
            Account settings
          </PrimaryBtn>
        </HeaderActions>
      </PageHeader>

      {/* KPI cards */}
      <KpiRow>
        <KpiCard>
          <KpiLabel>Active services</KpiLabel>
          <KpiValue>{enabledServices.length}</KpiValue>
          <KpiSub>{disabledServices.length} available to enable</KpiSub>
        </KpiCard>
        <KpiCard>
          <KpiLabel>Users</KpiLabel>
          <KpiValue>{customer.userCount}</KpiValue>
          <KpiSub>Across all services</KpiSub>
        </KpiCard>
        <KpiCard>
          <KpiLabel>Primary contact</KpiLabel>
          <KpiValueSmall style={{ paddingTop: 4 }}>{staticMeta?.contact ?? '—'}</KpiValueSmall>
          <KpiSub>Account admin</KpiSub>
        </KpiCard>
        <KpiCard>
          <KpiLabel>Next renewal</KpiLabel>
          {customer.renewalDate ? (
            <>
              <KpiValueSmall style={{ paddingTop: 4, fontSize: 15 }}>
                {new Date(customer.renewalDate).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </KpiValueSmall>
              <KpiSub>
                {daysUntil(customer.renewalDate) > 0
                  ? `in ${daysUntil(customer.renewalDate)} days`
                  : 'Renewal overdue'}
              </KpiSub>
            </>
          ) : (
            <KpiValue>—</KpiValue>
          )}
        </KpiCard>
      </KpiRow>

      {/* Services & Entitlements accordion */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>Services &amp; entitlements</SectionTitle>
        </SectionHeader>

        {enabledServices.map(service => {
          const Icon = productIcons[service.productId];
          const util = getUtil(service.productId);
          const expanded = expandedServices.has(service.productId);
          const desc = getServiceDesc(service.productId);

          return (
            <ServiceRow key={service.productId} $expanded={expanded}>
              <ServiceRowTop onClick={() => toggleExpand(service.productId)}>
                <ExpandChevron $open={expanded}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </ExpandChevron>
                <ServiceIconWrap>
                  {Icon && <Icon aria-hidden="true" focusable="false" />}
                </ServiceIconWrap>
                <ServiceRowInfo>
                  <ServiceRowNameRow>
                    <ServiceRowName>{service.productLabel}</ServiceRowName>
                    <ServiceStatusPill $status={service.status ?? 'Active'}>
                      {service.status ?? 'Active'}
                    </ServiceStatusPill>
                  </ServiceRowNameRow>
                  <ServiceRowDesc>{desc}</ServiceRowDesc>
                </ServiceRowInfo>
                <ServiceRowRight>
                  {util ? (
                    <ServiceUtil>
                      <ServiceUtilBar>
                        <ServiceUtilFill $pct={util.pct} />
                      </ServiceUtilBar>
                      <ServiceUtilText $pct={util.pct}>{util.pct}% used</ServiceUtilText>
                    </ServiceUtil>
                  ) : (
                    <NoUtilText>No data</NoUtilText>
                  )}
                  <ServiceRowActions onClick={e => e.stopPropagation()}>
                    <OpenProductBtn onClick={() => navigate(`/${service.productId}`)}>
                      Open <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ fontSize: 10 }} />
                    </OpenProductBtn>
                    <MoreBtn aria-label="More actions">
                      <FontAwesomeIcon icon={faEllipsis} />
                    </MoreBtn>
                  </ServiceRowActions>
                </ServiceRowRight>
              </ServiceRowTop>

              {/* Expanded: entitlement breakdown */}
              {expanded && util && (
                <EntBreakdown>
                  <EntSectionLabel>Entitlements</EntSectionLabel>
                  {util.pe.entitlements.map(ent => {
                    const pct = Math.round((ent.used / ent.total) * 100);
                    return (
                      <EntItem key={ent.label}>
                        <EntItemTop>
                          <EntItemName>{ent.label}</EntItemName>
                          <EntItemCount>
                            {formatNumber(ent.used)} / {formatNumber(ent.total)}
                          </EntItemCount>
                        </EntItemTop>
                        <EntBar><EntBarFill $pct={pct} /></EntBar>
                        <EntItemSub>
                          {formatNumber(ent.total - ent.used)} remaining · {pct}% used
                        </EntItemSub>
                      </EntItem>
                    );
                  })}
                </EntBreakdown>
              )}
            </ServiceRow>
          );
        })}
      </SectionCard>

      {/* Available services + activity side by side */}
      <BottomTwoCol>

        {/* Left: available services */}
        <SectionCard style={{ marginBottom: 0 }}>
          <SectionHeader>
            <SectionTitle>Available services</SectionTitle>
            <AddServiceBtn>
              <FontAwesomeIcon icon={faPlus} style={{ fontSize: 10 }} /> Add service
            </AddServiceBtn>
          </SectionHeader>
          <AvailPadding>
            <AvailChips>
              {disabledServices.map(service => {
                const Icon = productIcons[service.productId];
                return (
                  <AvailChip key={service.productId}>
                    <AvailChipIcon>
                      {Icon && <Icon aria-hidden="true" focusable="false" />}
                    </AvailChipIcon>
                    <AvailChipName>{service.productLabel}</AvailChipName>
                    <AvailChipPlus>+</AvailChipPlus>
                  </AvailChip>
                );
              })}
            </AvailChips>
          </AvailPadding>
        </SectionCard>

        {/* Right: customer activity */}
        <ActivityCard>
          <ActivityCardHeader>
            <ActivityCardTitle>Customer activity</ActivityCardTitle>
            <SeeAllLink>See all →</SeeAllLink>
          </ActivityCardHeader>
          <ActivityGrid>
            {allActivity.map(item => (
              <ActivityItem key={item.id}>
                <ActivityTop>
                  <ActivityEventName>{item.activity}</ActivityEventName>
                  <ActivityBadge $status={item.status}>{item.status}</ActivityBadge>
                </ActivityTop>
                <ActivityMeta>
                  {item.productLabel} · {formatRelativeTime(item.timestamp)}
                  {item.performedBy !== 'System' && item.performedBy !== 'admin@abc-security.com'
                    ? ` · ${item.performedBy.split('@')[0]}`
                    : ''}
                </ActivityMeta>
              </ActivityItem>
            ))}
          </ActivityGrid>
        </ActivityCard>

      </BottomTwoCol>
    </PageWrapper>
  );
};
