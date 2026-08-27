import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { activityEvents, customers } from '../../data/partnerData';

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

const StatusBadge = styled.span<{ $status: string }>`
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  background: ${({ $status }) =>
    $status === 'Completed' ? '#D1FAE5' :
    $status === 'Failed' ? '#FEE2E2' :
    $status === 'Warning' ? '#FEF3C7' : '#DBEAFE'};
  color: ${({ $status }) =>
    $status === 'Completed' ? '#065F46' :
    $status === 'Failed' ? '#991B1B' :
    $status === 'Warning' ? '#92400E' : '#1E40AF'};
`;

const TimeCell = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral700};
  white-space: nowrap;
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

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const PartnerActivityPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Activity — Partner workspace — DigiCert ONE';
  }, []);

  const [customerFilter, setCustomerFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = activityEvents.filter(ev => {
    const matchCustomer = customerFilter === 'all' || ev.customerId === customerFilter;
    const matchStatus = statusFilter === 'all' || ev.status === statusFilter;
    return matchCustomer && matchStatus;
  });

  return (
    <PageWrapper>
      <PageTitle>Activity</PageTitle>
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
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
          <option value="Warning">Warning</option>
          <option value="In progress">In progress</option>
        </FilterSelect>
      </Toolbar>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Time</Th>
              <Th>Customer</Th>
              <Th>Product / Service</Th>
              <Th>Activity</Th>
              <Th>Status</Th>
              <Th>Performed by</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(event => (
              <Tr key={event.id}>
                <Td><TimeCell>{formatTime(event.timestamp)}</TimeCell></Td>
                <Td style={{ fontWeight: 600 }}>{event.customerName}</Td>
                <Td>{event.productLabel}</Td>
                <Td>{event.activity}</Td>
                <Td><StatusBadge $status={event.status}>{event.status}</StatusBadge></Td>
                <Td style={{ color: '#757D82', fontSize: 12 }}>{event.performedBy}</Td>
              </Tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <Td colSpan={6} style={{ textAlign: 'center', color: '#757D82', padding: '32px' }}>
                  No activity matches your filters.
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
        <Pagination>
          <span>Showing {filtered.length} of {activityEvents.length} events</span>
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
