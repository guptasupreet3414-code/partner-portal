import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import type { ColDef } from '@ag-grid-community/core';
import { customers, entitlementRows } from '../../data/partnerData';
import { AgTable, AgTableCard } from '../../components/AgTable/AgTable';
import { HealthBadgeRenderer, ProgressBarRenderer } from '../../components/AgTable/renderers';

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

/* ── Report categories (UX-19) ───────────────────────────────────── */

type CategoryId = 'capacity' | 'renewal' | 'adoption' | 'expiring' | 'provisioning' | 'audit';

interface ReportCategory {
  id: CategoryId;
  label: string;
  description: string;
  icon: string;
}

const reportCategories: ReportCategory[] = [
  {
    id: 'capacity',
    label: 'Capacity & usage',
    icon: '📊',
    description: 'Entitlement utilization and capacity across all customers and services.',
  },
  {
    id: 'renewal',
    label: 'Renewal readiness',
    icon: '📅',
    description: 'Customers with upcoming renewals in the next 90, 60, and 30 days.',
  },
  {
    id: 'adoption',
    label: 'Service adoption',
    icon: '🔌',
    description: 'Which customers have adopted which services — and who hasn\'t.',
  },
  {
    id: 'expiring',
    label: 'Expiring services',
    icon: '⏰',
    description: 'Services and certificates approaching expiration.',
  },
  {
    id: 'provisioning',
    label: 'Provisioning health',
    icon: '⚙️',
    description: 'Active, failed, and in-progress provisioning tasks across your customers.',
  },
  {
    id: 'audit',
    label: 'Audit activity',
    icon: '🔍',
    description: 'Changes, access events, and admin actions across all managed accounts.',
  },
];

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 28px;
`;

const CategoryCard = styled.button<{ $selected: boolean }>`
  display: flex; flex-direction: column; align-items: flex-start;
  padding: 14px 16px; text-align: left;
  border: 1px solid ${({ $selected, theme }) => $selected ? theme.colors.blue300 : theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ $selected }) => $selected ? '#EEF6FF' : 'white'};
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.blue300};
    background: #F5F9FF;
  }
`;

const CategoryIcon = styled.div`
  font-size: 18px; margin-bottom: 8px;
`;

const CategoryLabel = styled.div<{ $selected: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; font-weight: ${({ $selected }) => $selected ? '600' : '500'};
  color: ${({ $selected, theme }) => $selected ? theme.colors.blue300 : theme.colors.neutral900};
  margin-bottom: 4px;
`;

const CategoryDesc = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px; color: ${({ theme }) => theme.colors.neutral500};
  line-height: 1.4;
`;

const CategoryInfoBanner = styled.div`
  padding: 12px 16px;
  background: #EEF6FF;
  border: 1px solid #BEDAF4;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 16px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; color: #004A80;
`;

const AuditLinkBtn = styled.button`
  background: none; border: none; padding: 0; cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; color: ${({ theme }) => theme.colors.blue300}; font-weight: 500;
  &:hover { text-decoration: underline; }
`;

function getAvgUtilization(customerId: string): number {
  const rows = entitlementRows.filter(r => r.customerId === customerId);
  if (!rows.length) return 0;
  const avg = rows.reduce((sum, r) => sum + (r.consumed / r.allocated) * 100, 0) / rows.length;
  return Math.round(avg);
}

export const PartnerReportsPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Reports — Partner workspace — DigiCert ONE';
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('capacity');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');

  const selectedCat = reportCategories.find(c => c.id === selectedCategory)!;

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

  const reportRowData = useMemo(() => rows.map(r => ({
    customerName: r.customer.name,
    productLabel: r.service.productLabel,
    health: r.customer.health,
    utilization: r.utilization,
    renewalDate: r.customer.renewalDate
      ? new Date(r.customer.renewalDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : '—',
    region: r.customer.region,
  })), [rows]);

  const reportColDefs = useMemo(() => ([
    { field: 'customerName', headerName: 'Customer',                flex: 1.5, minWidth: 140 },
    { field: 'productLabel', headerName: 'Product',                 flex: 1, minWidth: 120 },
    { field: 'health',       headerName: 'Health',                  cellRenderer: HealthBadgeRenderer, width: 160 },
    { field: 'utilization',  headerName: 'Entitlement utilization', cellRenderer: ProgressBarRenderer, flex: 1, minWidth: 180 },
    { field: 'renewalDate',  headerName: 'Renewal date',            width: 150 },
    { field: 'region',       headerName: 'Region',                  flex: 1, minWidth: 120 },
  ] as ColDef[]), []);

  return (
    <PageWrapper>
      <PageTitle>Reports</PageTitle>
      <ContextLine>Partner workspace · ABC Security</ContextLine>

      {/* UX-19 — Category grid */}
      <CategoryGrid>
        {reportCategories.map(cat => (
          <CategoryCard
            key={cat.id}
            $selected={selectedCategory === cat.id}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <CategoryIcon>{cat.icon}</CategoryIcon>
            <CategoryLabel $selected={selectedCategory === cat.id}>{cat.label}</CategoryLabel>
            <CategoryDesc>{cat.description}</CategoryDesc>
          </CategoryCard>
        ))}
      </CategoryGrid>

      {selectedCategory === 'audit' ? (
        <CategoryInfoBanner>
          Detailed audit activity is available on the{' '}
          <AuditLinkBtn onClick={() => navigate('/partner/activity')}>
            Activity page →
          </AuditLinkBtn>
        </CategoryInfoBanner>
      ) : (
        <CategoryInfoBanner>
          <strong>{selectedCat.label}</strong> — {selectedCat.description}
        </CategoryInfoBanner>
      )}

      {selectedCategory !== 'audit' && (
      <>
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

      <AgTableCard>
        <AgTable rowData={reportRowData} columnDefs={reportColDefs} />
      </AgTableCard>
      </>
      )}
    </PageWrapper>
  );
};
