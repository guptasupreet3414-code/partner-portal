import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { managedUsers, customers, type ManagedUser } from '../data/partnerData';

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

const SummaryRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SummaryCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.white};
  min-width: 110px;
`;

const SummaryValue = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral900};
  line-height: 1;
  margin-bottom: 4px;
`;

const SummaryLabel = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral600};
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
  min-width: 220px;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral500};
  }

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

  &:focus {
    border-color: ${({ theme }) => theme.colors.blue300};
  }
`;

const RightActions = styled.div`
  margin-left: auto;
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 14px;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.neutral900};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
  }
`;

const CreateButton = styled(ActionButton)`
  background: ${({ theme }) => theme.colors.blue300};
  color: #ffffff;
  border-color: transparent;

  &:hover {
    background: ${({ theme }) => theme.colors.blue500};
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

const UserName = styled.div`
  font-weight: 600;
`;

const UserEmail = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral600};
  margin-top: 1px;
`;

const CustomerBadge = styled.span`
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  background: #EFF6FF;
  color: #1E40AF;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $status }) =>
    $status === 'Active' ? '#D1FAE5' :
    $status === 'Pending' ? '#FEF3C7' : '#FEE2E2'};
  color: ${({ $status }) =>
    $status === 'Active' ? '#065F46' :
    $status === 'Pending' ? '#92400E' : '#991B1B'};
`;

const PillList = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const Pill = styled.span`
  padding: 2px 7px;
  background: ${({ theme }) => theme.colors.neutral100};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 100px;
  font-size: 11px;
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

const ownOrgUsers = [
  { id: 'own1', username: 'jdoe', fullName: 'John Doe', email: 'j.doe@abc-security.com', status: 'Active' as const, services: ['CertCentral', 'Trust Lifecycle'], roles: ['Admin'], groups: ['Platform Admins'], lastUpdatedBy: 'System' },
  { id: 'own2', username: 'swilson', fullName: 'Sarah Wilson', email: 's.wilson@abc-security.com', status: 'Active' as const, services: ['CertCentral'], roles: ['User'], groups: ['Certificate Ops'], lastUpdatedBy: 'j.doe@abc-security.com' },
  { id: 'own3', username: 'mlee', fullName: 'Michael Lee', email: 'm.lee@abc-security.com', status: 'Active' as const, services: ['Trust Lifecycle', 'Private CA'], roles: ['Manager'], groups: ['PKI Ops'], lastUpdatedBy: 'j.doe@abc-security.com' },
  { id: 'own4', username: 'abrown', fullName: 'Amy Brown', email: 'a.brown@abc-security.com', status: 'Pending' as const, services: [], roles: ['User'], groups: [], lastUpdatedBy: 'System' },
  { id: 'own5', username: 'rsmith', fullName: 'Robert Smith', email: 'r.smith@abc-security.com', status: 'Locked' as const, services: ['CertCentral'], roles: ['User'], groups: ['Certificate Ops'], lastUpdatedBy: 'System' },
];

export const UsersPage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const isPartner = activeWorkspace === 'partner';

  useEffect(() => {
    document.title = `Users — DigiCert ONE`;

    const params = new URLSearchParams(location.search);
    const prefilterCustomer = params.get('customer');
    if (prefilterCustomer && isPartner) {
      setCustomerFilter(prefilterCustomer);
    }
  }, [location.search, isPartner]);

  const users = isPartner ? managedUsers : ownOrgUsers;

  const filtered = users.filter(u => {
    const matchSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchCustomer =
      !isPartner || customerFilter === 'all' ||
      (u as ManagedUser).customerId === customerFilter;
    return matchSearch && matchStatus && matchCustomer;
  });

  const contextCustomer = isPartner && customerFilter !== 'all'
    ? customers.find(c => c.id === customerFilter)
    : null;

  const contextLabel = isPartner
    ? contextCustomer
      ? `${contextCustomer.name} · Managed by ABC Security`
      : 'Partner workspace · ABC Security'
    : 'My workspace · ABC Security';

  const totalCount = users.length;
  const activeCount = users.filter(u => u.status === 'Active').length;
  const pendingCount = users.filter(u => u.status === 'Pending').length;
  const lockedCount = users.filter(u => u.status === 'Locked').length;

  return (
    <PageWrapper>
      <PageTitle>Users</PageTitle>
      {contextCustomer && (
        <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, fontWeight: 600, color: '#353535', marginBottom: 4 }}>
          {contextCustomer.name}
        </div>
      )}
      <ContextLine>{contextLabel}</ContextLine>

      <SummaryRow>
        <SummaryCard>
          <SummaryValue>{totalCount}</SummaryValue>
          <SummaryLabel>{isPartner ? 'Total managed users' : 'Total users'}</SummaryLabel>
        </SummaryCard>
        <SummaryCard>
          <SummaryValue style={{ color: '#27A872' }}>{activeCount}</SummaryValue>
          <SummaryLabel>Active</SummaryLabel>
        </SummaryCard>
        <SummaryCard>
          <SummaryValue style={{ color: '#F5B517' }}>{pendingCount}</SummaryValue>
          <SummaryLabel>Pending</SummaryLabel>
        </SummaryCard>
        <SummaryCard>
          <SummaryValue style={{ color: '#DC2626' }}>{lockedCount}</SummaryValue>
          <SummaryLabel>Locked</SummaryLabel>
        </SummaryCard>
      </SummaryRow>

      <Toolbar>
        <SearchInput
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search users"
        />

        {isPartner && (
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
        )}

        <FilterSelect
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Locked">Locked</option>
        </FilterSelect>

        <RightActions>
          <ActionButton>↓ Download CSV</ActionButton>
          <CreateButton>+ Create user</CreateButton>
        </RightActions>
      </Toolbar>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Username</Th>
              <Th>Full name</Th>
              <Th>Email</Th>
              {isPartner && <Th>Customer</Th>}
              <Th>Status</Th>
              <Th>Services</Th>
              <Th>Roles</Th>
              <Th>Groups</Th>
              <Th>Last updated by</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <Tr key={user.id}>
                <Td><UserName>{user.username}</UserName></Td>
                <Td>{user.fullName}</Td>
                <Td><UserEmail>{user.email}</UserEmail></Td>
                {isPartner && (
                  <Td>
                    <CustomerBadge>{(user as ManagedUser).customerName}</CustomerBadge>
                  </Td>
                )}
                <Td>
                  <StatusBadge $status={user.status}>{user.status}</StatusBadge>
                </Td>
                <Td>
                  <PillList>
                    {user.services.slice(0, 2).map(s => (
                      <Pill key={s}>{s}</Pill>
                    ))}
                    {user.services.length > 2 && <Pill>+{user.services.length - 2}</Pill>}
                  </PillList>
                </Td>
                <Td>
                  <PillList>
                    {user.roles.map(r => <Pill key={r}>{r}</Pill>)}
                  </PillList>
                </Td>
                <Td>
                  <PillList>
                    {user.groups.slice(0, 2).map(g => <Pill key={g}>{g}</Pill>)}
                    {user.groups.length > 2 && <Pill>+{user.groups.length - 2}</Pill>}
                  </PillList>
                </Td>
                <Td style={{ fontSize: 12, color: '#757D82' }}>{user.lastUpdatedBy}</Td>
              </Tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <Td colSpan={isPartner ? 9 : 8} style={{ textAlign: 'center', color: '#757D82', padding: '32px' }}>
                  No users match your search.
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
        <Pagination>
          <span>Showing {filtered.length} of {totalCount} users</span>
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
