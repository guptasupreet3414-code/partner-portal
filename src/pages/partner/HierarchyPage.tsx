import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faBuilding, faLayerGroup, faUsers, faCircleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { customers } from '../../data/partnerData';

/* ── Hierarchy mock data ─────────────────────────────────────────── */

const hierarchy = {
  id: 'abc-security',
  name: 'ABC Security',
  type: 'partner' as const,
  accountId: 'PRT-001',
  adminCount: 5,
  divisions: [
    {
      id: 'north-america',
      name: 'North America',
      type: 'division' as const,
      customerIds: ['acme-corp', 'contoso', 'initech'],
    },
    {
      id: 'europe',
      name: 'Europe',
      type: 'division' as const,
      customerIds: ['globex', 'umbrella'],
    },
  ],
};

/* ── Styled components ───────────────────────────────────────────── */

const PageWrapper = styled.main``;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 28px; font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0 0 6px;
`;

const PageSubtitle = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; color: ${({ theme }) => theme.colors.neutral500};
  margin: 0;
`;

const TreeCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.white};
  overflow: hidden;
`;

const TreeCardHeader = styled.div`
  display: flex; align-items: center; gap: 10px;
  padding: 14px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  background: ${({ theme }) => theme.colors.neutral50};
`;

const TreeCardTitle = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral700};
`;

const TreeCardMeta = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; color: ${({ theme }) => theme.colors.neutral500};
  margin-left: auto;
`;

/* Partner root node */

const PartnerNode = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral100};
`;

const PartnerNodeInner = styled.div`
  display: flex; align-items: center; gap: 14px;
`;

const PartnerIconWrap = styled.div`
  width: 44px; height: 44px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.blue300};
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  color: white; font-size: 18px;
`;

const PartnerInfo = styled.div``;

const PartnerName = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 16px; font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
  margin-bottom: 3px;
`;

const PartnerMeta = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; color: ${({ theme }) => theme.colors.neutral500};
`;

const PartnerBadge = styled.span`
  display: inline-flex; align-items: center;
  padding: 3px 10px;
  border-radius: 100px;
  background: #EEF6FF; color: ${({ theme }) => theme.colors.blue300};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px; font-weight: 600;
  margin-left: 10px;
`;

/* Division node */

const DivisionSection = styled.div`
  padding: 0 0 0 24px;
`;

const DivisionRow = styled.div`
  border-left: 2px solid ${({ theme }) => theme.colors.neutral200};
  margin-left: 20px;
  padding: 0 0 0 0;
`;

const DivisionHeader = styled.button<{ $expanded: boolean }>`
  width: 100%; display: flex; align-items: center; gap: 10px;
  padding: 14px 16px 14px 16px;
  background: transparent; border: none; cursor: pointer;
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral100};
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.neutral50}; }
`;

const DivisionChevron = styled.span<{ $open: boolean }>`
  color: ${({ theme }) => theme.colors.neutral400};
  font-size: 11px; flex-shrink: 0;
  transition: transform 0.18s;
  transform: ${({ $open }) => $open ? 'rotate(0deg)' : 'rotate(-90deg)'};
`;

const DivisionIconWrap = styled.div`
  width: 32px; height: 32px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.neutral100};
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.neutral600};
  font-size: 14px;
`;

const DivisionName = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px; font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral800};
  flex: 1;
`;

const DivisionMeta = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; color: ${({ theme }) => theme.colors.neutral500};
`;

/* Customer nodes */

const CustomerList = styled.div`
  border-left: 2px solid ${({ theme }) => theme.colors.neutral200};
  margin-left: 40px;
`;

const CustomerRow = styled.button`
  width: 100%; display: flex; align-items: center; gap: 12px;
  padding: 12px 16px;
  background: transparent; border: none; cursor: pointer;
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral100};
  transition: background 0.15s;
  &:last-child { border-bottom: none; }
  &:hover { background: #F0F6FF; }
`;

const CustomerIconWrap = styled.div`
  width: 28px; height: 28px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.neutral50};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.neutral500};
  font-size: 12px;
`;

const CustomerInfo = styled.div`
  flex: 1; min-width: 0;
`;

const CustomerName = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; font-weight: 500;
  color: ${({ theme }) => theme.colors.blue300};
`;

const CustomerSubMeta = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; color: ${({ theme }) => theme.colors.neutral500};
  margin-top: 2px;
`;

const HealthDot = styled.span<{ $health: string }>`
  display: inline-block;
  width: 7px; height: 7px; border-radius: 50%;
  margin-right: 5px;
  background: ${({ $health }) =>
    $health === 'Healthy' ? '#27A872' :
    $health === 'Needs attention' ? '#F5B517' : '#DC2626'};
`;

const CustomerServices = styled.div`
  display: flex; gap: 5px; flex-wrap: wrap;
`;

const ServicePip = styled.span`
  display: inline-block;
  padding: 2px 7px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.neutral100};
  color: ${({ theme }) => theme.colors.neutral700};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
`;

const CustomerArrow = styled.span`
  color: ${({ theme }) => theme.colors.neutral400};
  font-size: 11px; flex-shrink: 0;
`;

/* Summary stats */

const SummaryRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 20px;
  @media (max-width: 700px) { grid-template-columns: 1fr 1fr; }
`;

const StatCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.white};
`;

const StatLabel = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.05em; color: ${({ theme }) => theme.colors.neutral500};
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 28px; font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral900};
`;

const StatSub = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; color: ${({ theme }) => theme.colors.neutral500};
  margin-top: 3px;
`;

/* ── Component ───────────────────────────────────────────────────── */

const productLabelShort: Record<string, string> = {
  certcentral: 'CC',
  'trust-lifecycle': 'TLM',
  'private-ca': 'PCA',
  'software-trust': 'ST',
  'device-trust': 'DT',
  dns: 'DNS',
};

export const HierarchyPage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedDivisions, setExpandedDivisions] = useState<Set<string>>(
    new Set(hierarchy.divisions.map(d => d.id))
  );

  useEffect(() => {
    document.title = 'Hierarchy — Partner workspace — DigiCert ONE';
  }, []);

  const toggleDivision = (id: string) => {
    setExpandedDivisions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const healthyCnt = customers.filter(c => c.health === 'Healthy').length;
  const attentionCnt = customers.length - healthyCnt;

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Hierarchy</PageTitle>
        <PageSubtitle>Your partner organization structure — partner, divisions, and managed accounts.</PageSubtitle>
      </PageHeader>

      <SummaryRow>
        <StatCard>
          <StatLabel>Managed customers</StatLabel>
          <StatValue>{customers.length}</StatValue>
          <StatSub>Across {hierarchy.divisions.length} divisions</StatSub>
        </StatCard>
        <StatCard>
          <StatLabel>Healthy</StatLabel>
          <StatValue style={{ color: '#1C7852' }}>{healthyCnt}</StatValue>
          <StatSub>{attentionCnt} need attention</StatSub>
        </StatCard>
        <StatCard>
          <StatLabel>Partner admins</StatLabel>
          <StatValue>5</StatValue>
          <StatSub>ABC Security team</StatSub>
        </StatCard>
      </SummaryRow>

      <TreeCard>
        <TreeCardHeader>
          <FontAwesomeIcon icon={faLayerGroup} style={{ color: '#0174C3', fontSize: 14 }} />
          <TreeCardTitle>Organization tree</TreeCardTitle>
          <TreeCardMeta>{customers.length} managed accounts · {hierarchy.divisions.length} divisions</TreeCardMeta>
        </TreeCardHeader>

        {/* Partner root */}
        <PartnerNode>
          <PartnerNodeInner>
            <PartnerIconWrap>
              <FontAwesomeIcon icon={faBuilding} />
            </PartnerIconWrap>
            <PartnerInfo>
              <PartnerName>
                {hierarchy.name}
                <PartnerBadge>Partner</PartnerBadge>
              </PartnerName>
              <PartnerMeta>Account ID: {hierarchy.accountId} · {hierarchy.adminCount} administrators</PartnerMeta>
            </PartnerInfo>
          </PartnerNodeInner>
        </PartnerNode>

        {/* Divisions */}
        <DivisionSection>
          {hierarchy.divisions.map(division => {
            const divCustomers = customers.filter(c => division.customerIds.includes(c.id));
            const expanded = expandedDivisions.has(division.id);
            return (
              <DivisionRow key={division.id}>
                <DivisionHeader $expanded={expanded} onClick={() => toggleDivision(division.id)}>
                  <DivisionChevron $open={expanded}>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </DivisionChevron>
                  <DivisionIconWrap>
                    <FontAwesomeIcon icon={faLayerGroup} />
                  </DivisionIconWrap>
                  <DivisionName>{division.name}</DivisionName>
                  <DivisionMeta>{divCustomers.length} customers</DivisionMeta>
                </DivisionHeader>

                {expanded && (
                  <CustomerList>
                    {divCustomers.map(customer => {
                      const enabledSvcs = customer.services.filter(s => s.enabled);
                      return (
                        <CustomerRow
                          key={customer.id}
                          onClick={() => navigate(`/partner/customers/${customer.id}`)}
                        >
                          <CustomerIconWrap>
                            <FontAwesomeIcon icon={faBuilding} />
                          </CustomerIconWrap>
                          <CustomerInfo>
                            <CustomerName>
                              <HealthDot $health={customer.health} />
                              {customer.name}
                            </CustomerName>
                            <CustomerSubMeta>
                              {customer.health} · {customer.userCount} users
                            </CustomerSubMeta>
                          </CustomerInfo>
                          <CustomerServices>
                            {enabledSvcs.slice(0, 4).map(s => (
                              <ServicePip key={s.productId}>
                                {productLabelShort[s.productId] ?? s.productId}
                              </ServicePip>
                            ))}
                            {enabledSvcs.length > 4 && (
                              <ServicePip>+{enabledSvcs.length - 4}</ServicePip>
                            )}
                          </CustomerServices>
                          <CustomerArrow>
                            <FontAwesomeIcon icon={faChevronRight} />
                          </CustomerArrow>
                        </CustomerRow>
                      );
                    })}
                  </CustomerList>
                )}
              </DivisionRow>
            );
          })}
        </DivisionSection>
      </TreeCard>
    </PageWrapper>
  );
};
