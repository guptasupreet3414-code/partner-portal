import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import type { ColDef } from '@ag-grid-community/core';
import { entitlementRows, customers } from '../../data/partnerData';
import { AgTable, AgTableCard } from '../../components/AgTable/AgTable';
import { ProgressBarRenderer, StatusBadgeRenderer } from '../../components/AgTable/renderers';

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

/* ── Product summary cards (UX-12) ───────────────────────────────── */

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
`;

const SummaryCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 16px 18px;
  background: ${({ theme }) => theme.colors.white};
`;

const SummaryCardHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px;
`;

const SummaryCardProduct = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; font-weight: 600; color: ${({ theme }) => theme.colors.neutral900};
`;

const SummaryCardAtRisk = styled.div<{ $count: number }>`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px; font-weight: 600;
  padding: 2px 8px; border-radius: 100px;
  background: ${({ $count }) => $count > 0 ? '#FEF3C7' : '#D1FAE5'};
  color: ${({ $count }) => $count > 0 ? '#92400E' : '#065F46'};
`;

const SummaryAlloc = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 6px;
`;

const SummaryAllocLabel = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; color: ${({ theme }) => theme.colors.neutral500};
`;

const SummaryAllocValue = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; font-weight: 600; color: ${({ theme }) => theme.colors.neutral800};
`;

const SummaryBarWrap = styled.div`
  height: 8px; border-radius: 4px;
  background: ${({ theme }) => theme.colors.neutral100};
  overflow: hidden; margin-bottom: 6px; position: relative;
`;

const SummaryBarFill = styled.div<{ $pct: number }>`
  position: absolute; left: 0; top: 0; bottom: 0;
  width: ${({ $pct }) => Math.min($pct, 100)}%;
  background: ${({ $pct }) => $pct >= 95 ? '#DC2626' : $pct >= 80 ? '#F59E0B' : '#0174C3'};
  border-radius: 4px;
`;

const SummaryBarPct = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px; color: ${({ theme }) => theme.colors.neutral500};
  text-align: right;
`;

const SectionLabel = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: ${({ theme }) => theme.colors.neutral500};
  margin-bottom: 12px;
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

  const entitlementRowData = useMemo(() => filtered.map(row => ({
    customerName: row.customerName,
    productLabel: row.productLabel,
    entitlementLabel: row.entitlementLabel,
    allocated: row.allocated,
    consumed: row.consumed,
    remaining: row.allocated - row.consumed,
    pct: Math.round((row.consumed / row.allocated) * 100),
    status: row.status,
  })), [filtered]);

  const entitlementColDefs: ColDef[] = useMemo(() => [
    { field: 'customerName',    headerName: 'Customer',    flex: 1.5, minWidth: 140, cellStyle: { fontWeight: 600 } },
    { field: 'productLabel',    headerName: 'Product',     flex: 1, minWidth: 120 },
    { field: 'entitlementLabel', headerName: 'Entitlement', flex: 1.5, minWidth: 140 },
    { field: 'allocated',       headerName: 'Allocated',   width: 110, type: 'numericColumn', valueFormatter: p => p.value?.toLocaleString() },
    { field: 'consumed',        headerName: 'Consumed',    width: 110, type: 'numericColumn', valueFormatter: p => p.value?.toLocaleString() },
    { field: 'remaining',       headerName: 'Remaining',   width: 110, type: 'numericColumn', valueFormatter: p => p.value?.toLocaleString() },
    { field: 'pct',             headerName: 'Utilization', cellRenderer: ProgressBarRenderer, flex: 1, minWidth: 160 },
    { field: 'status',          headerName: 'Status',      cellRenderer: StatusBadgeRenderer, width: 160 },
  ], []);

  /* Compute per-product aggregates for summary cards */
  const productSummaries = uniqueProducts.map(product => {
    const rows = entitlementRows.filter(r => r.productLabel === product);
    const totalAllocated = rows.reduce((s, r) => s + r.allocated, 0);
    const totalConsumed = rows.reduce((s, r) => s + r.consumed, 0);
    const atRisk = rows.filter(r => r.status !== 'Healthy').length;
    const pct = totalAllocated > 0 ? Math.round((totalConsumed / totalAllocated) * 100) : 0;
    return { product, totalAllocated, totalConsumed, atRisk, pct };
  });

  return (
    <PageWrapper>
      <PageTitle>Entitlements</PageTitle>
      <ContextLine>Partner workspace · ABC Security · Last updated a few minutes ago</ContextLine>

      {/* UX-12 — Product-level visual summary */}
      <SectionLabel>Capacity overview by service</SectionLabel>
      <SummaryGrid>
        {productSummaries.map(({ product, totalAllocated, totalConsumed, atRisk, pct }) => (
          <SummaryCard key={product}>
            <SummaryCardHeader>
              <SummaryCardProduct>{product}</SummaryCardProduct>
              <SummaryCardAtRisk $count={atRisk}>
                {atRisk === 0 ? 'All healthy' : `${atRisk} at risk`}
              </SummaryCardAtRisk>
            </SummaryCardHeader>
            <SummaryAlloc>
              <SummaryAllocLabel>Allocated to customers</SummaryAllocLabel>
              <SummaryAllocValue>{totalAllocated.toLocaleString()}</SummaryAllocValue>
            </SummaryAlloc>
            <SummaryBarWrap>
              <SummaryBarFill $pct={pct} />
            </SummaryBarWrap>
            <SummaryAlloc>
              <SummaryAllocLabel>Consumed</SummaryAllocLabel>
              <SummaryAllocValue>{totalConsumed.toLocaleString()}</SummaryAllocValue>
            </SummaryAlloc>
            <SummaryBarPct>{pct}% consumed of allocated</SummaryBarPct>
          </SummaryCard>
        ))}
      </SummaryGrid>

      <SectionLabel>Entitlement details</SectionLabel>

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

      <AgTableCard>
        <AgTable rowData={entitlementRowData} columnDefs={entitlementColDefs} />
      </AgTableCard>
    </PageWrapper>
  );
};
