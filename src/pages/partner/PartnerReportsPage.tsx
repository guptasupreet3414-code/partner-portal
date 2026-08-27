import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { customers, entitlementRows } from '../../data/partnerData';

const PageWrapper = styled.main``;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0 0 4px;
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
  margin-bottom: 16px;
  flex-wrap: wrap;
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

  &:focus {
    border-color: ${({ theme }) => theme.colors.blue300};
  }
`;

const ExportButton = styled.button`
  padding: 8px 14px;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.neutral900};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  margin-left: auto;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
  }
`;

const TableWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const Th = styled.th`
  padding: 10px 14px;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.neutral600};
  background: ${({ theme }) => theme.colors.neutral50};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  white-space: nowrap;
`;

const Tr = styled.tr`
  &:not(:last-child) td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  }
  &:hover td {
    background: ${({ theme }) => theme.colors.neutral50};
  }
`;

const Td = styled.td`
  padding: 11px 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral900};
  background: ${({ theme }) => theme.colors.white};
  vertical-align: middle;
`;

const HealthBadge = styled.span<{ $health: string }>`
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $health }) =>
    $health === 'Healthy' ? '#D1FAE5' :
    $health === 'Needs attention' ? '#FEF3C7' : '#FEE2E2'};
  color: ${({ $health }) =>
    $health === 'Healthy' ? '#065F46' :
    $health === 'Needs attention' ? '#92400E' : '#991B1B'};
`;

const UtilBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  background: ${({ theme }) => theme.colors.neutral200};
  border-radius: 3px;
  overflow: hidden;
  min-width: 60px;
`;

const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => Math.min($pct, 100)}%;
  background: ${({ $pct }) =>
    $pct >= 100 ? '#DC2626' : $pct >= 80 ? '#F59E0B' : '#1976D2'};
  border-radius: 3px;
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

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 4px 10px;
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.blue300 : theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $active, theme }) => $active ? theme.colors.blue300 : theme.colors.white};
  color: ${({ $active }) => $active ? '#fff' : '#44484A'};
  font-size: 13px;
  cursor: pointer;
  margin-left: 4px;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

function getAvgUtilization(customerId: string): number {
  const rows = entitlementRows.filter(r => r.customerId === customerId);
  if (!rows.length) return 0;
  const avg = rows.reduce((sum, r) => sum + (r.consumed / r.allocated) * 100, 0) / rows.length;
  return Math.round(avg);
}

export const PartnerReportsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Reports — Partner workspace — DigiCert ONE';
  }, []);

  const [customerFilter, setCustomerFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');

  const uniqueProducts = [...new Set(customers.flatMap(c => c.services.filter(s => s.enabled).map(s => s.productLabel)))].sort();

  const rows = customers
    .filter(c => customerFilter === 'all' || c.id === customerFilter)
    .flatMap(c =>
      c.services.filter(s => s.enabled && (productFilter === 'all' || s.productLabel === productFilter)).map(s => ({
        customer: c,
        service: s,
        utilization: getAvgUtilization(c.id),
      }))
    );

  return (
    <PageWrapper>
      <PageTitle>Reports</PageTitle>
      <ContextLine>Partner workspace · ABC Security</ContextLine>

      <Toolbar>
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
          {uniqueProducts.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </FilterSelect>

        <ExportButton>↓ Export CSV</ExportButton>
      </Toolbar>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Customer</Th>
              <Th>Product</Th>
              <Th>Health</Th>
              <Th>Entitlement utilization</Th>
              <Th>Renewal date</Th>
              <Th>Region</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const util = row.utilization;
              return (
                <Tr key={idx}>
                  <Td style={{ fontWeight: 600 }}>{row.customer.name}</Td>
                  <Td>{row.service.productLabel}</Td>
                  <Td>
                    <HealthBadge $health={row.customer.health}>{row.customer.health}</HealthBadge>
                  </Td>
                  <Td>
                    <UtilBar>
                      <ProgressBar>
                        <ProgressFill $pct={util} />
                      </ProgressBar>
                      <span style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{util}%</span>
                    </UtilBar>
                  </Td>
                  <Td>
                    {row.customer.renewalDate
                      ? new Date(row.customer.renewalDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      : '—'}
                  </Td>
                  <Td>{row.customer.region}</Td>
                </Tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <Td colSpan={6} style={{ textAlign: 'center', color: '#757D82', padding: '32px' }}>
                  No data matches your filters.
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
        <Pagination>
          <span>Showing {rows.length} records</span>
          <div>
            <PageButton disabled>← Prev</PageButton>
            <PageButton $active>1</PageButton>
            <PageButton disabled>Next →</PageButton>
          </div>
        </Pagination>
      </TableWrapper>
    </PageWrapper>
  );
};
