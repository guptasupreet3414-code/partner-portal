import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { entitlementRows, customers } from '../../data/partnerData';

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

const CustomerCell = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
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

const PctLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral700};
  white-space: nowrap;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  background: ${({ $status }) =>
    $status === 'Healthy' ? '#D1FAE5' :
    $status === 'Near limit' ? '#FEF3C7' :
    $status === 'At limit' ? '#FEE2E2' : '#FEE2E2'};
  color: ${({ $status }) =>
    $status === 'Healthy' ? '#065F46' :
    $status === 'Near limit' ? '#92400E' :
    $status === 'At limit' ? '#991B1B' : '#991B1B'};
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
  flex-wrap: wrap;
  gap: 8px;
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
  color: ${({ $active }) => $active ? '#fff' : '#44484A'};
  font-size: 13px;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const uniqueProducts = [...new Set(entitlementRows.map(r => r.productLabel))].sort();

export const PartnerEntitlementsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Entitlements — Partner workspace — DigiCert ONE';
  }, []);

  const [customerFilter, setCustomerFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = entitlementRows.filter(row => {
    const matchCustomer = customerFilter === 'all' || row.customerId === customerFilter;
    const matchProduct = productFilter === 'all' || row.productLabel === productFilter;
    const matchStatus = statusFilter === 'all' || row.status === statusFilter;
    return matchCustomer && matchProduct && matchStatus;
  });

  return (
    <PageWrapper>
      <PageTitle>Entitlements</PageTitle>
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

        <FilterSelect
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="Healthy">Healthy</option>
          <option value="Near limit">Near limit</option>
          <option value="At limit">At limit</option>
          <option value="Over entitlement">Over entitlement</option>
        </FilterSelect>
      </Toolbar>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Customer</Th>
              <Th>Product</Th>
              <Th>Entitlement</Th>
              <Th>Allocated</Th>
              <Th>Consumed</Th>
              <Th>Remaining</Th>
              <Th>Utilization</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => {
              const pct = Math.round((row.consumed / row.allocated) * 100);
              const remaining = row.allocated - row.consumed;
              return (
                <Tr key={idx}>
                  <Td><CustomerCell>{row.customerName}</CustomerCell></Td>
                  <Td>{row.productLabel}</Td>
                  <Td>{row.entitlementLabel}</Td>
                  <Td>{row.allocated.toLocaleString()}</Td>
                  <Td>{row.consumed.toLocaleString()}</Td>
                  <Td>{remaining.toLocaleString()}</Td>
                  <Td>
                    <UtilBar>
                      <ProgressBar>
                        <ProgressFill $pct={pct} />
                      </ProgressBar>
                      <PctLabel>{pct}%</PctLabel>
                    </UtilBar>
                  </Td>
                  <Td>
                    <StatusBadge $status={row.status}>{row.status}</StatusBadge>
                  </Td>
                </Tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <Td colSpan={8} style={{ textAlign: 'center', color: '#757D82', padding: '32px' }}>
                  No entitlements match your filters.
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
        <Pagination>
          <span>Showing {filtered.length} of {entitlementRows.length} entitlements</span>
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
