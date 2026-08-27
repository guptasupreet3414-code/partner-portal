import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { customers, type Customer } from '../../data/partnerData';

/* ── Metadata ────────────────────────────────────────────────────────── */

const customerMeta: Record<string, { industry: string; tier: string; region: string; contact: string }> = {
  'acme-corp': { industry: 'Manufacturing',      tier: 'Enterprise', region: 'NA · United States', contact: 'j.doe@acmecorp.com' },
  globex:      { industry: 'Energy',             tier: 'Enterprise', region: 'EMEA · Germany',     contact: 'm.weber@globex.com' },
  contoso:     { industry: 'Financial services', tier: 'Business',   region: 'NA · Canada',        contact: 'd.park@contoso.com' },
  initech:     { industry: 'Software',           tier: 'Business',   region: 'NA · United States', contact: 'l.torres@initech.com' },
  umbrella:    { industry: 'Healthcare',         tier: 'Enterprise', region: 'APAC · Singapore',   contact: 'a.kovacs@umbrella.com' },
};

const peakUtil = (c: Customer): number => {
  const pcts = c.entitlements.flatMap(pe =>
    pe.entitlements.map(e => Math.round((e.used / e.total) * 100))
  );
  return pcts.length ? Math.max(...pcts) : 0;
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* ── Styled components ───────────────────────────────────────────────── */

const PageWrapper = styled.main``;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0;
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.blue300};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover { background: ${({ theme }) => theme.colors.blue500}; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral900};
  background: ${({ theme }) => theme.colors.white};
  min-width: 240px;
  outline: none;

  &::placeholder { color: ${({ theme }) => theme.colors.neutral500}; }
  &:focus {
    border-color: ${({ theme }) => theme.colors.blue300};
    box-shadow: 0 0 0 2px rgba(1, 116, 195, 0.15);
  }
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral900};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  outline: none;

  &:focus { border-color: ${({ theme }) => theme.colors.blue300}; }
`;

const TableWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  overflow-x: auto;
`;

const TableSubHeading = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral700};
  padding: 12px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const Th = styled.th`
  padding: 10px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.neutral500};
  background: ${({ theme }) => theme.colors.neutral50};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  white-space: nowrap;
`;

const Tr = styled.tr`
  cursor: pointer;

  &:hover td { background: ${({ theme }) => theme.colors.neutral50}; }
  &:not(:last-child) td { border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200}; }
`;

const Td = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral900};
  background: ${({ theme }) => theme.colors.white};
  vertical-align: middle;
`;

const CustomerName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue300};
`;

const CustomerMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral500};
  margin-top: 2px;
`;

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

const UtilContainer = styled.div`
  width: 120px;
`;

const UtilBar = styled.div`
  width: 100%;
  height: 5px;
  background: ${({ theme }) => theme.colors.neutral200};
  border-radius: 100px;
  overflow: hidden;
  margin-bottom: 4px;
`;

const UtilFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => Math.min($pct, 100)}%;
  background: ${({ $pct }) => $pct >= 90 ? '#DC2626' : $pct >= 70 ? '#F59E0B' : '#1976D2'};
`;

const UtilPct = styled.div<{ $pct: number }>`
  font-size: 12px;
  color: ${({ $pct }) => $pct >= 90 ? '#DC2626' : $pct >= 70 ? '#F59E0B' : '#1976D2'};
`;

const ContactText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral600};
`;

const OpenLink = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.blue300};

  &:hover { text-decoration: underline; }
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral200};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral600};
  background: ${({ theme }) => theme.colors.neutral50};
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 4px 10px;
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.blue300 : theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $active, theme }) => $active ? theme.colors.blue300 : theme.colors.white};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.neutral700};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover:not(:disabled) {
    background: ${({ $active, theme }) => $active ? theme.colors.blue500 : theme.colors.neutral100};
  }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

/* ── Component ───────────────────────────────────────────────────────── */

export const PartnerCustomersPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Customers — Partner workspace — DigiCert ONE';
  }, []);

  const [search, setSearch] = useState('');
  const [healthFilter, setHealthFilter] = useState('all');
  const navigate = useNavigate();

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchHealth = healthFilter === 'all' || c.health === healthFilter;
    return matchSearch && matchHealth;
  });

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Customers</PageTitle>
        <AddButton>+ Add customer</AddButton>
      </PageHeader>

      <Toolbar>
        <SearchInput
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search customers"
        />
        <FilterSelect
          value={healthFilter}
          onChange={e => setHealthFilter(e.target.value)}
          aria-label="Filter by health"
        >
          <option value="all">All health statuses</option>
          <option value="Healthy">Healthy</option>
          <option value="Needs attention">Needs attention</option>
          <option value="At risk">At risk</option>
        </FilterSelect>
      </Toolbar>

      <TableWrapper>
        <TableSubHeading>{filtered.length} managed customers</TableSubHeading>
        <Table>
          <thead>
            <tr>
              <Th>Customer</Th>
              <Th>Industry</Th>
              <Th>Services</Th>
              <Th>Peak Utilization</Th>
              <Th>Primary Contact</Th>
              <Th>Next Renewal</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(customer => {
              const meta = customerMeta[customer.id] ?? {
                industry: '—', tier: '—', region: '—', contact: '—',
              };
              const pct = peakUtil(customer);
              const enabledCount = customer.services.filter(s => s.enabled).length;
              return (
                <Tr
                  key={customer.id}
                  onClick={() => navigate(`/partner/customers/${customer.id}`)}
                >
                  <Td>
                    <CustomerName>{customer.name}</CustomerName>
                    <CustomerMeta>{meta.tier} · {meta.region}</CustomerMeta>
                  </Td>
                  <Td style={{ fontSize: '13px', color: '#636A6E' }}>{meta.industry}</Td>
                  <Td style={{ fontSize: '13px', color: '#636A6E' }}>{enabledCount}</Td>
                  <Td>
                    <UtilContainer>
                      <UtilBar><UtilFill $pct={pct} /></UtilBar>
                      <UtilPct $pct={pct}>{pct}%</UtilPct>
                    </UtilContainer>
                  </Td>
                  <Td>
                    <ContactText>{meta.contact}</ContactText>
                  </Td>
                  <Td style={{ fontSize: '13px' }}>
                    {customer.renewalDate ? formatDate(customer.renewalDate) : '—'}
                  </Td>
                  <Td>
                    <HealthBadge $health={customer.health}>{customer.health}</HealthBadge>
                  </Td>
                  <Td>
                    <OpenLink>Open →</OpenLink>
                  </Td>
                </Tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <Td colSpan={8} style={{ textAlign: 'center', color: '#757D82', padding: '32px' }}>
                  No customers match your search.
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
        <Pagination>
          <span>Showing {filtered.length} of {customers.length} customers</span>
          <PaginationButtons>
            <PageButton disabled>← Prev</PageButton>
            <PageButton $active>1</PageButton>
            <PageButton disabled>Next →</PageButton>
          </PaginationButtons>
        </Pagination>
      </TableWrapper>
    </PageWrapper>
  );
};
