import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faTriangleExclamation, faChartPie, faCalendarDays,
  faStar, faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  customers, portfolioAlerts, activityEvents, formatNumber,
  type Customer,
} from '../../data/partnerData';

/* ── Helpers ─────────────────────────────────────────────────────────── */

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatRelativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const h = Math.floor(ms / 3600000);
  if (h < 1) return '< 1h ago';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const peakUtil = (c: Customer): number => {
  const pcts = c.entitlements.flatMap(pe =>
    pe.entitlements.map(e => Math.round((e.used / e.total) * 100))
  );
  return pcts.length ? Math.max(...pcts) : 0;
};

const initials = (name: string): string =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

const customerMeta: Record<string, { tier: string; regionLabel: string }> = {
  'acme-corp':  { tier: 'Enterprise', regionLabel: 'NA · United States' },
  globex:       { tier: 'Enterprise', regionLabel: 'EMEA · Germany' },
  contoso:      { tier: 'Business',   regionLabel: 'NA · Canada' },
  initech:      { tier: 'Business',   regionLabel: 'NA · United States' },
  umbrella:     { tier: 'Enterprise', regionLabel: 'APAC · Singapore' },
};

/* ── Computed values ─────────────────────────────────────────────────── */

const attentionCount = customers.filter(c => c.health !== 'Healthy').length;
const avgPeakUtil = Math.round(
  customers.reduce((s, c) => s + peakUtil(c), 0) / customers.length
);
const upcomingRenewals = customers.filter(
  c => c.renewalDate && daysUntil(c.renewalDate) > 0 && daysUntil(c.renewalDate) <= 90
).length;

/* ── Styled components ───────────────────────────────────────────────── */

const PageWrapper = styled.main``;

const PageHeader = styled.div`
  margin-bottom: 20px;
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0 0 4px;
`;

const PageSubtitle = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral500};
`;

/* ── AI Insight Banner ───────────────────────────────────────────────── */

const AIBanner = styled.div`
  border: 1px solid #BFDBFE;
  border-left: 4px solid ${({ theme }) => theme.colors.blue300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: #EFF6FF;
  padding: 16px 20px;
  margin-bottom: 24px;
`;

const AIBannerTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
`;

const AIStarIcon = styled.div`
  color: ${({ theme }) => theme.colors.blue300};
  font-size: 16px;
  flex-shrink: 0;
  line-height: 1;
`;

/* Tag style — rectangular, not pill */
const AIInsightTag = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: ${({ theme }) => theme.colors.blue300};
  color: #fff;
  border-radius: 4px;
  padding: 2px 7px;
  flex-shrink: 0;
`;

const AIHeadline = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
  margin-bottom: 6px;
`;

const AIDetail = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral600};
  line-height: 1.55;
  margin-bottom: 10px;
`;

const AITagsRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const AIFilterTag = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.blue300};
  border: 1px solid #BFDBFE;
  border-radius: 100px;
  padding: 2px 10px;
  background: #fff;
`;

const AITimestamp = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.neutral400};
  text-align: right;
`;

/* ── KPI Row ─────────────────────────────────────────────────────────── */

const KpiRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

const KpiCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 18px 20px;
  background: ${({ theme }) => theme.colors.white};
`;

const KpiTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const KpiLabel = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.neutral500};
`;

const KpiIconCircle = styled.div<{ $bg: string; $color: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
`;

const KpiValue = styled.div<{ $color?: string }>`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 36px;
  font-weight: 700;
  color: ${({ $color, theme }) => $color ?? theme.colors.neutral900};
  line-height: 1;
  margin-bottom: 4px;
`;

const KpiSub = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral500};
`;

/* ── Section card ────────────────────────────────────────────────────── */

const SectionCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`;

const SectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  flex-wrap: wrap;
  gap: 8px;
`;

const SectionTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0;
`;

const AmberCountBadge = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  font-weight: 600;
  background: #FEF3C7;
  color: #92400E;
  border-radius: 100px;
  padding: 2px 8px;
`;

const SectionSubtitle = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral500};
`;

const HeaderLinkBtn = styled.button`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.blue300};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover { text-decoration: underline; }
`;

/* ── Table ───────────────────────────────────────────────────────────── */

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.neutral50};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
`;

const Th = styled.th`
  padding: 9px 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.neutral500};
  text-align: left;
  white-space: nowrap;
`;

const ClickableTr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral100};
  cursor: pointer;

  &:last-child { border-bottom: none; }
  &:hover td { background: ${({ theme }) => theme.colors.neutral50}; }
`;

const Td = styled.td`
  padding: 12px 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral800};
  vertical-align: middle;
`;

/* ── Attention table cells ───────────────────────────────────────────── */

const AvatarCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CustomerAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #EFF6FF;
  color: #1D4ED8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const CustomerNameText = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
`;

const SeverityBadge = styled.span<{ $severity: 'error' | 'warning' | 'info' }>`
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  background: ${({ $severity }) =>
    $severity === 'error' ? '#FEE2E2' :
    $severity === 'warning' ? '#FEF3C7' : '#F3F4F6'};
  color: ${({ $severity }) =>
    $severity === 'error' ? '#991B1B' :
    $severity === 'warning' ? '#92400E' : '#6B7280'};
`;

const ReviewBtn = styled.button`
  padding: 4px 12px;
  border: 1px solid ${({ theme }) => theme.colors.blue300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.blue300};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover { background: #EFF6FF; }
`;

/* ── Health badge ────────────────────────────────────────────────────── */

const HealthBadge = styled.span<{ $health: string }>`
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  background: ${({ $health }) =>
    $health === 'Healthy' ? '#D1FAE5' :
    $health === 'Needs attention' ? '#FEF3C7' : '#FEE2E2'};
  color: ${({ $health }) =>
    $health === 'Healthy' ? '#065F46' :
    $health === 'Needs attention' ? '#92400E' : '#991B1B'};
`;

/* ── Utilization bar ─────────────────────────────────────────────────── */

const UtilBar = styled.div`
  background: ${({ theme }) => theme.colors.neutral200};
  border-radius: 100px;
  overflow: hidden;
  flex-shrink: 0;
`;

const UtilFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => Math.min($pct, 100)}%;
  background: ${({ $pct }) => $pct >= 90 ? '#DC2626' : $pct >= 70 ? '#F59E0B' : '#1976D2'};
`;

/* ── 2-column layout ─────────────────────────────────────────────────── */

const TwoColGrid = styled.div`
  display: grid;
  grid-template-columns: 55fr 45fr;
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

/* ── Renewal list items (card-list style, same as activity) ──────────── */

const RenewalItem = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px 16px;
  gap: 12px;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral100};

  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.colors.neutral50}; }
`;

const RenewalLeft = styled.div`
  flex: 1; min-width: 0;
`;

const RenewalCustomerName = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
  margin-bottom: 2px;
`;

const RenewalMeta = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral500};
`;

const RenewalDaysChip = styled.div<{ $overdue: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  flex-shrink: 0;
  background: ${({ $overdue }) => $overdue ? '#FEE2E2' : '#DBEAFE'};
  color: ${({ $overdue }) => $overdue ? '#991B1B' : '#1E40AF'};
  white-space: nowrap;
`;

/* ── Activity feed ───────────────────────────────────────────────────── */

const ActivityItem = styled.div`
  padding: 11px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral100};

  &:last-child { border-bottom: none; }
`;

const ActivityTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 2px;
`;

const ActivityCustomerLabel = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
`;

const ActivityStatusBadge = styled.span<{ $status: string }>`
  padding: 1px 7px;
  border-radius: 100px;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
  background: ${({ $status }) =>
    $status === 'Completed' ? '#D1FAE5' :
    $status === 'Failed' ? '#FEE2E2' :
    $status === 'Warning' ? '#FEF3C7' : '#DBEAFE'};
  color: ${({ $status }) =>
    $status === 'Completed' ? '#065F46' :
    $status === 'Failed' ? '#991B1B' :
    $status === 'Warning' ? '#92400E' : '#1E40AF'};
`;

const ActivityDetail = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral600};
  margin-bottom: 2px;
`;

const ActivityMeta = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.neutral400};
`;

/* ── Portfolio table cells ───────────────────────────────────────────── */

const PortfolioCustomerName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue300};
`;

const PortfolioCustomerMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral500};
  margin-top: 2px;
`;

const OpenLinkSpan = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.blue300};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SectionSpacerBottom = styled.div`
  margin-bottom: 24px;
`;

/* ── Component ───────────────────────────────────────────────────────── */

const AI_FILTER_TAGS = ['CertCentral usage', 'TLM entitlement history', 'Customer renewal dates'];

export const PartnerPortfolioPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Overview — Partner workspace — DigiCert ONE';
  }, []);

  const navigate = useNavigate();

  const renewalSorted = [...customers]
    .filter(c => c.renewalDate)
    .sort((a, b) => new Date(a.renewalDate!).getTime() - new Date(b.renewalDate!).getTime());

  const portfolioSorted = [...customers].sort((a, b) => peakUtil(b) - peakUtil(a));

  return (
    <PageWrapper>

      {/* ── Header ── */}
      <PageHeader>
        <PageTitle>Hello, John</PageTitle>
        <PageSubtitle>
          Manage and monitor your customers, track their entitlements and usage, upcoming renewals, and respond to alerts.
        </PageSubtitle>
      </PageHeader>

      {/* ── AI Insight Banner ── */}
      <AIBanner>
        <AIBannerTopRow>
          <AIStarIcon>
            <FontAwesomeIcon icon={faStar} />
          </AIStarIcon>
          <AIInsightTag>AI Insight</AIInsightTag>
        </AIBannerTopRow>
        <AIHeadline>
          3 customers likely to exceed certificate capacity in the next 60 days
        </AIHeadline>
        <AIDetail>
          Acme Corp (80% consumed), Globex Corporation (93% consumed), and Contoso Ltd. (provisioning) are
          trending toward capacity limits. Consider reviewing allocations before renewal season.
        </AIDetail>
        <AITagsRow>
          {AI_FILTER_TAGS.map(tag => <AIFilterTag key={tag}>{tag}</AIFilterTag>)}
        </AITagsRow>
        <AITimestamp>Data current as of Aug 25, 12:42 PM</AITimestamp>
      </AIBanner>

      {/* ── KPI Row ── */}
      <KpiRow>
        <KpiCard>
          <KpiTopRow>
            <KpiLabel>Total customers</KpiLabel>
            <KpiIconCircle $bg="#DBEAFE" $color="#1D4ED8">
              <FontAwesomeIcon icon={faUsers} />
            </KpiIconCircle>
          </KpiTopRow>
          <KpiValue>{formatNumber(customers.length)}</KpiValue>
          <KpiSub>Across all regions</KpiSub>
        </KpiCard>

        <KpiCard>
          <KpiTopRow>
            <KpiLabel>Customers with issues</KpiLabel>
            <KpiIconCircle $bg="#FEF3C7" $color="#D97706">
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </KpiIconCircle>
          </KpiTopRow>
          <KpiValue $color="#D97706">{attentionCount}</KpiValue>
          <KpiSub>Review and follow up</KpiSub>
        </KpiCard>

        <KpiCard>
          <KpiTopRow>
            <KpiLabel>Average entitlement utilization</KpiLabel>
            <KpiIconCircle $bg="#DBEAFE" $color="#1D4ED8">
              <FontAwesomeIcon icon={faChartPie} />
            </KpiIconCircle>
          </KpiTopRow>
          <KpiValue>{avgPeakUtil}%</KpiValue>
          <KpiSub>Weighted across all products</KpiSub>
        </KpiCard>

        <KpiCard>
          <KpiTopRow>
            <KpiLabel>Renewals in 90 days</KpiLabel>
            <KpiIconCircle $bg="#D1FAE5" $color="#065F46">
              <FontAwesomeIcon icon={faCalendarDays} />
            </KpiIconCircle>
          </KpiTopRow>
          <KpiValue>{upcomingRenewals}</KpiValue>
          <KpiSub>Schedule review now</KpiSub>
        </KpiCard>
      </KpiRow>

      {/* ── Attention Required ── */}
      <SectionSpacerBottom>
        <SectionCard>
          <SectionHeaderRow>
            <SectionTitleGroup>
              <SectionTitle>Attention required</SectionTitle>
              <AmberCountBadge>{portfolioAlerts.length}</AmberCountBadge>
              <SectionSubtitle>open issues across {attentionCount} customers</SectionSubtitle>
            </SectionTitleGroup>
            <HeaderLinkBtn onClick={() => navigate('/partner/customers')}>
              View all →
            </HeaderLinkBtn>
          </SectionHeaderRow>

          <StyledTable>
            <Thead>
              <tr>
                <Th>Customer</Th>
                <Th>Issue</Th>
                <Th>Service</Th>
                <Th>Severity</Th>
                <Th>Action</Th>
              </tr>
            </Thead>
            <tbody>
              {portfolioAlerts.map((alert, idx) => (
                <ClickableTr
                  key={idx}
                  onClick={() => navigate(`/partner/customers/${alert.customerId}`)}
                >
                  <Td>
                    <AvatarCell>
                      <CustomerAvatar>{initials(alert.customerName)}</CustomerAvatar>
                      <CustomerNameText>{alert.customerName}</CustomerNameText>
                    </AvatarCell>
                  </Td>
                  <Td style={{ color: '#636A6E' }}>{alert.message}</Td>
                  <Td style={{ color: '#757D82' }}>{alert.productLabel}</Td>
                  <Td>
                    <SeverityBadge $severity={alert.severity}>
                      {alert.severity === 'error' ? 'High' : alert.severity === 'warning' ? 'Medium' : 'Low'}
                    </SeverityBadge>
                  </Td>
                  <Td onClick={e => e.stopPropagation()}>
                    <ReviewBtn onClick={() => navigate(`/partner/customers/${alert.customerId}`)}>
                      Review →
                    </ReviewBtn>
                  </Td>
                </ClickableTr>
              ))}
            </tbody>
          </StyledTable>
        </SectionCard>
      </SectionSpacerBottom>

      {/* ── Bottom 2-column ── */}
      <TwoColGrid>

        {/* Left: Upcoming renewals — card-list style */}
        <SectionCard>
          <SectionHeaderRow>
            <SectionTitleGroup>
              <SectionTitle>Upcoming renewals</SectionTitle>
              <SectionSubtitle>{renewalSorted.length} customers</SectionSubtitle>
            </SectionTitleGroup>
            <HeaderLinkBtn onClick={() => navigate('/partner/customers')}>
              View all →
            </HeaderLinkBtn>
          </SectionHeaderRow>

          {renewalSorted.map(c => {
            const meta = customerMeta[c.id];
            const days = daysUntil(c.renewalDate!);
            const enabledLabels = c.services
              .filter(s => s.enabled)
              .slice(0, 2)
              .map(s => s.productLabel)
              .join(', ');
            const overdue = days <= 0;
            return (
              <RenewalItem
                key={c.id}
                onClick={() => navigate(`/partner/customers/${c.id}`)}
              >
                <RenewalLeft>
                  <RenewalCustomerName>{c.name}</RenewalCustomerName>
                  <RenewalMeta>
                    {enabledLabels}
                    {c.services.filter(s => s.enabled).length > 2 && ` +${c.services.filter(s => s.enabled).length - 2} more`}
                    {' · '}
                    {meta?.tier} · {formatDate(c.renewalDate!)}
                  </RenewalMeta>
                </RenewalLeft>
                <RenewalDaysChip $overdue={overdue}>
                  {overdue ? 'Overdue' : `${days}d`}
                </RenewalDaysChip>
              </RenewalItem>
            );
          })}
        </SectionCard>

        {/* Right: Recent activity */}
        <SectionCard>
          <SectionHeaderRow>
            <SectionTitle>Recent activity</SectionTitle>
            <HeaderLinkBtn onClick={() => navigate('/partner/activity')}>
              View all →
            </HeaderLinkBtn>
          </SectionHeaderRow>
          <div>
            {activityEvents.map(event => (
              <ActivityItem key={event.id}>
                <ActivityTopRow>
                  <ActivityCustomerLabel>
                    {event.customerName} · {event.productLabel}
                  </ActivityCustomerLabel>
                  <ActivityStatusBadge $status={event.status}>{event.status}</ActivityStatusBadge>
                </ActivityTopRow>
                <ActivityDetail>{event.activity}</ActivityDetail>
                <ActivityMeta>
                  {formatRelativeTime(event.timestamp)} · {event.performedBy}
                </ActivityMeta>
              </ActivityItem>
            ))}
          </div>
        </SectionCard>

      </TwoColGrid>

      {/* ── Customer portfolio table ── */}
      <SectionCard>
        <SectionHeaderRow>
          <SectionTitle>Customer portfolio</SectionTitle>
          <HeaderLinkBtn onClick={() => navigate('/partner/customers')}>
            All customers →
          </HeaderLinkBtn>
        </SectionHeaderRow>
        <div style={{
          padding: '6px 18px 8px',
          fontSize: '12px',
          color: '#757D82',
          fontFamily: 'Roboto, sans-serif',
        }}>
          Sorted by peak utilization
        </div>

        <StyledTable>
          <Thead>
            <tr>
              <Th>Customer</Th>
              <Th>Services</Th>
              <Th>Peak Utilization</Th>
              <Th>Next Renewal</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </Thead>
          <tbody>
            {portfolioSorted.map(c => {
              const pct = peakUtil(c);
              const enabledCount = c.services.filter(s => s.enabled).length;
              const meta = customerMeta[c.id];
              return (
                <ClickableTr
                  key={c.id}
                  onClick={() => navigate(`/partner/customers/${c.id}`)}
                >
                  <Td>
                    <PortfolioCustomerName>{c.name}</PortfolioCustomerName>
                    <PortfolioCustomerMeta>
                      {meta?.tier} · {meta?.regionLabel ?? c.region}
                    </PortfolioCustomerMeta>
                  </Td>
                  <Td style={{ color: '#636A6E' }}>{enabledCount}</Td>
                  <Td>
                    <UtilBar style={{ width: '120px', height: '6px', marginBottom: '4px' }}>
                      <UtilFill $pct={pct} />
                    </UtilBar>
                    <span style={{
                      fontSize: '12px',
                      color: pct >= 90 ? '#DC2626' : pct >= 70 ? '#F59E0B' : '#1976D2',
                    }}>
                      {pct}%
                    </span>
                  </Td>
                  <Td style={{ fontSize: '13px' }}>
                    {c.renewalDate ? formatDate(c.renewalDate) : '—'}
                  </Td>
                  <Td>
                    <HealthBadge $health={c.health}>{c.health}</HealthBadge>
                  </Td>
                  <Td>
                    <OpenLinkSpan>
                      Open
                      <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '11px' }} />
                    </OpenLinkSpan>
                  </Td>
                </ClickableTr>
              );
            })}
          </tbody>
        </StyledTable>
      </SectionCard>

    </PageWrapper>
  );
};
