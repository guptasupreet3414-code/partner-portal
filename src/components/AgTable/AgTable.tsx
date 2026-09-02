import React from 'react';
import styled from 'styled-components';
import { AgGridReact } from '@ag-grid-community/react';
import { ModuleRegistry } from '@ag-grid-community/core';
import type { ColDef, RowClickedEvent } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import './AgTable.css';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const AgTableCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`;

interface AgTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowData: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnDefs: ColDef<any>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowClicked?: (e: RowClickedEvent<any>) => void;
  height?: number;
}

export function AgTable({ rowData, columnDefs, onRowClicked, height }: AgTableProps) {
  const clickable = !!onRowClicked;
  return (
    <div
      className={`ag-theme-quartz dco-ag-table${clickable ? ' dco-ag-clickable' : ''}`}
      style={{ width: '100%', height: height ? `${height}px` : undefined }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        domLayout={height ? 'normal' : 'autoHeight'}
        rowHeight={44}
        headerHeight={40}
        suppressMovableColumns
        suppressCellFocus
        onRowClicked={onRowClicked}
      />
    </div>
  );
}
