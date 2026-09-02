import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import type { ColDef, ICellRendererParams } from '@ag-grid-community/core';
import { customers, type Customer } from '../../data/partnerData';
import { AgTable, AgTableCard } from '../../components/AgTable/AgTable';
import {
  CustomerCellRenderer,
  ProgressBarRenderer,
  HealthBadgeRenderer,
} from '../../components/AgTable/renderers';
import { HierarchyDrawer } from '../../components/HierarchyDrawer/HierarchyDrawer';

/* ── Row action menu renderer ────────────────────────────────────────── */

interface RowMenuParams extends ICellRendererParams {
  onMenuOpen: (id: string, x: number, y: number) => void;
}

function RowMenuRenderer({ data, onMenuOpen }: RowMenuParams) {
  return (
    <button
      aria-label="Row actions"
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#B0BAC4', fontSize: 20, padding: '0 10px',
        borderRadius: 4, lineHeight: 1, display: 'flex', alignItems: 'center',
      }}
      onClick={e => {
        e.stopPropagation();
        const r = e.currentTarget.getBoundingClientRect();
        onMenuOpen(data.id, r.right - 192, r.bottom + 4);
      }}
    >
      ⋯
    </button>
  );
}

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

const PageSubtitle = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral500};
  margin-top: 3px;
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

const SecondaryButton = styled.button`
  padding: 8px 16px;
  background: transparent;
  color: ${({ theme }) => theme.colors.blue300};
  border: 1px solid ${({ theme }) => theme.colors.blue300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover { background: rgba(1, 116, 195, 0.06); }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ActionDropdown = styled.div<{ $x: number; $y: number }>`
  position: fixed;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  width: 192px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 400;
  overflow: hidden;
`;

const ActionDropdownItem = styled.button`
  display: block;
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  text-align: left;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral800};
  cursor: pointer;
  transition: background 0.12s;

  &:hover { background: ${({ theme }) => theme.colors.neutral50}; }
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


/* ── Component ───────────────────────────────────────────────────────── */

export const PartnerCustomersPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Customers — Partner workspace — DigiCert ONE';
  }, []);

  const [search, setSearch] = useState('');
  const [healthFilter, setHealthFilter] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [highlightCustomerId, setHighlightCustomerId] = useState<string | undefined>();
  const [menuState, setMenuState] = useState<{ id: string; x: number; y: number } | null>(null);
  const navigate = useNavigate();

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!menuState) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-action-menu]')) setMenuState(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuState]);

  const openHierarchy = useCallback((customerId?: string) => {
    setHighlightCustomerId(customerId);
    setDrawerOpen(true);
    setMenuState(null);
  }, []);

  const handleMenuOpen = useCallback((id: string, x: number, y: number) => {
    setMenuState({ id, x, y });
  }, []);

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchHealth = healthFilter === 'all' || c.health === healthFilter;
    return matchSearch && matchHealth;
  });

  const rowData = useMemo(() => filtered.map(c => {
    const meta = customerMeta[c.id] ?? { industry: '—', tier: '—', region: '—', contact: '—' };
    return {
      id: c.id,
      name: c.name,
      meta: `${meta.tier} · ${meta.region}`,
      industry: meta.industry,
      enabledCount: c.services.filter(s => s.enabled).length,
      peakPct: peakUtil(c),
      contact: meta.contact,
      renewalDate: c.renewalDate ? formatDate(c.renewalDate) : '—',
      health: c.health,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [search, healthFilter]);

  const colDefs = useMemo(() => ([
    { field: 'name',        headerName: 'Customer',         cellRenderer: CustomerCellRenderer, flex: 2, minWidth: 180 },
    { field: 'industry',    headerName: 'Industry',         flex: 1, minWidth: 140 },
    { field: 'enabledCount', headerName: 'Services',        width: 110, type: 'numericColumn' },
    { field: 'peakPct',     headerName: 'Peak Utilization', cellRenderer: ProgressBarRenderer, flex: 1, minWidth: 160 },
    { field: 'contact',     headerName: 'Primary Contact',  flex: 1.5, minWidth: 180 },
    { field: 'renewalDate', headerName: 'Next Renewal',     width: 150 },
    { field: 'health',      headerName: 'Status',           cellRenderer: HealthBadgeRenderer, width: 170 },
    {
      headerName: '',
      cellRenderer: RowMenuRenderer,
      cellRendererParams: { onMenuOpen: handleMenuOpen },
      width: 56, sortable: false, resizable: false, suppressHeaderMenuButton: true,
    },
  ] as ColDef[]), [handleMenuOpen]);

  return (
    <PageWrapper>
      <PageHeader>
        <div>
          <PageTitle>Customers</PageTitle>
          <PageSubtitle>{filtered.length} managed customers across all regions</PageSubtitle>
        </div>
        <HeaderActions>
          <SecondaryButton onClick={() => openHierarchy()}>View hierarchy</SecondaryButton>
          <AddButton onClick={() => navigate('/partner/customers/new')}>+ Add customer</AddButton>
        </HeaderActions>
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

      <AgTableCard>
        <AgTable
          rowData={rowData}
          columnDefs={colDefs}
          onRowClicked={e => {
            if (!e.event) return;
            const target = e.event.target as HTMLElement;
            if (target.closest('button')) return;
            navigate(`/partner/customers/${e.data?.id}`);
          }}
        />
      </AgTableCard>

      {menuState && (
        <ActionDropdown $x={menuState.x} $y={menuState.y} data-action-menu>
          <ActionDropdownItem onClick={() => openHierarchy(menuState.id)}>
            View in hierarchy
          </ActionDropdownItem>
        </ActionDropdown>
      )}

      {drawerOpen && (
        <HierarchyDrawer
          onClose={() => { setDrawerOpen(false); setHighlightCustomerId(undefined); }}
          highlightCustomerId={highlightCustomerId}
        />
      )}
    </PageWrapper>
  );
};
