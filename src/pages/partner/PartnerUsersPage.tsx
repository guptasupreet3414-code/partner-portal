import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faXmark, faCircleCheck, faCircleXmark,
  faPenToSquare, faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import type { ColDef } from '@ag-grid-community/core';
import { AgTable, AgTableCard } from '../../components/AgTable/AgTable';
import { UserCellRenderer, RoleBadgeRenderer, StatusBadgeRenderer } from '../../components/AgTable/renderers';

/* ── Mock data ───────────────────────────────────────────────────── */

type UserRole = 'Partner Administrator' | 'Service Administrator' | 'Read-only' | 'Billing Administrator';
type UserStatus = 'Active' | 'Pending' | 'Suspended';

interface PartnerUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  scopeLabel: string;
  scopeIds: string[] | 'all';
  services: string[];
  status: UserStatus;
  lastActive: string | null;
}

const allServices = [
  { id: 'certcentral', label: 'CertCentral' },
  { id: 'trust-lifecycle', label: 'Trust Lifecycle' },
  { id: 'private-ca', label: 'Private CA' },
  { id: 'software-trust', label: 'Software Trust' },
  { id: 'device-trust', label: 'Device Trust' },
  { id: 'dns', label: 'DigiCert DNS' },
];

const allRoles: UserRole[] = [
  'Partner Administrator',
  'Service Administrator',
  'Read-only',
  'Billing Administrator',
];

const roleDescriptions: Record<UserRole, string> = {
  'Partner Administrator': 'Full access to all customers, services, entitlements, and user management.',
  'Service Administrator': 'Can manage services and entitlements within their assigned customer scope.',
  'Read-only': 'Can view customers, services, and reports but cannot make changes.',
  'Billing Administrator': 'Can view and manage entitlement allocations and billing across all customers.',
};

const mockUsers: PartnerUser[] = [
  {
    id: 'u1',
    name: 'Jane Smith',
    email: 'jane.smith@abc-security.com',
    role: 'Partner Administrator',
    scopeLabel: 'All customers',
    scopeIds: 'all',
    services: ['certcentral', 'trust-lifecycle', 'private-ca', 'software-trust', 'device-trust', 'dns'],
    status: 'Active',
    lastActive: '2026-08-31T10:00:00Z',
  },
  {
    id: 'u2',
    name: 'Mike Johnson',
    email: 'mike.johnson@abc-security.com',
    role: 'Service Administrator',
    scopeLabel: 'Globex Corporation, Umbrella Inc.',
    scopeIds: ['globex', 'umbrella'],
    services: ['certcentral', 'trust-lifecycle'],
    status: 'Active',
    lastActive: '2026-08-30T14:30:00Z',
  },
  {
    id: 'u3',
    name: 'Sarah Chen',
    email: 'sarah.chen@abc-security.com',
    role: 'Service Administrator',
    scopeLabel: 'Acme Corp, Contoso Ltd.',
    scopeIds: ['acme-corp', 'contoso'],
    services: ['certcentral', 'private-ca'],
    status: 'Active',
    lastActive: '2026-08-29T09:15:00Z',
  },
  {
    id: 'u4',
    name: 'David Park',
    email: 'david.park@abc-security.com',
    role: 'Read-only',
    scopeLabel: 'All customers',
    scopeIds: 'all',
    services: ['certcentral', 'trust-lifecycle', 'private-ca'],
    status: 'Pending',
    lastActive: null,
  },
  {
    id: 'u5',
    name: 'Lisa Torres',
    email: 'lisa.torres@abc-security.com',
    role: 'Billing Administrator',
    scopeLabel: 'All customers',
    scopeIds: 'all',
    services: [],
    status: 'Active',
    lastActive: '2026-08-28T16:45:00Z',
  },
];

/* ── Permission logic ────────────────────────────────────────────── */

function getPermissions(user: PartnerUser): { can: string[]; cannot: string[] } {
  const scope = user.scopeLabel === 'All customers' ? 'all customers' : user.scopeLabel;
  const svcList = user.services.map(id => allServices.find(s => s.id === id)?.label ?? id).join(', ');

  if (user.role === 'Partner Administrator') {
    return {
      can: [
        'View and manage all customers',
        'Add, remove, and configure services for any customer',
        'Manage entitlement allocations across all customers',
        'Invite and manage partner users and roles',
        'View and export all reports',
      ],
      cannot: ['Modify partner-level billing contract'],
    };
  }
  if (user.role === 'Service Administrator') {
    return {
      can: [
        `View customers: ${scope}`,
        `Manage services: ${svcList || 'none assigned'}`,
        'View entitlement usage for assigned customers',
        'View activity and audit logs for assigned customers',
      ],
      cannot: [
        'Add or remove customers',
        'Manage partner users or roles',
        'Modify entitlement allocations',
        'Access customers outside their scope',
      ],
    };
  }
  if (user.role === 'Read-only') {
    return {
      can: [
        `View customers: ${scope}`,
        `View services: ${svcList || 'all services'}`,
        'View reports and usage data',
        'Export report data',
      ],
      cannot: [
        'Make any configuration changes',
        'Manage users or entitlements',
        'Add or remove services',
      ],
    };
  }
  // Billing Administrator
  return {
    can: [
      'View entitlement allocations across all customers',
      'Modify entitlement allocations for any customer',
      'View and export billing and usage reports',
    ],
    cannot: [
      'Manage users or roles',
      'Add or remove services',
      'Access customer configuration',
    ],
  };
}

function formatRelativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const h = Math.floor(ms / 3600000);
  if (h < 1) return '< 1h ago';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/* ── Styled components ───────────────────────────────────────────── */

const PageWrapper = styled.main``;

const PageHeader = styled.div`
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; margin-bottom: 24px; flex-wrap: wrap;
`;

const TitleBlock = styled.div``;

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

const InviteBtn = styled.button`
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 18px;
  background: ${({ theme }) => theme.colors.blue300};
  color: white; border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px; font-weight: 500; cursor: pointer; flex-shrink: 0;
  transition: ${({ theme }) => theme.transitions.default};
  &:hover { background: ${({ theme }) => theme.colors.blue500}; }
`;

const TableCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%; border-collapse: collapse;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const Th = styled.th`
  padding: 10px 16px; text-align: left;
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.neutral600};
  background: ${({ theme }) => theme.colors.neutral50};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  white-space: nowrap;
`;

const Tr = styled.tr<{ $selected?: boolean }>`
  cursor: pointer;
  background: ${({ $selected, theme }) => $selected ? '#EEF6FF' : 'transparent'};
  &:not(:last-child) td { border-bottom: 1px solid ${({ theme }) => theme.colors.neutral100}; }
  &:hover td { background: ${({ $selected }) => $selected ? '#E4F0FF' : '#F9FAFB'}; }
`;

const Td = styled.td`
  padding: 13px 16px; font-size: 13px; color: ${({ theme }) => theme.colors.neutral900};
  vertical-align: middle;
`;

const NameCell = styled.div``;
const NameText = styled.div`
  font-weight: 500; color: ${({ theme }) => theme.colors.neutral900};
  margin-bottom: 2px;
`;
const EmailText = styled.div`
  font-size: 12px; color: ${({ theme }) => theme.colors.neutral500};
`;

const RoleBadge = styled.span<{ $role: UserRole }>`
  display: inline-flex; align-items: center;
  padding: 3px 9px; border-radius: 4px;
  font-size: 11px; font-weight: 600;
  background: ${({ $role }) =>
    $role === 'Partner Administrator' ? '#EEF6FF' :
    $role === 'Service Administrator' ? '#F0FDF4' :
    $role === 'Billing Administrator' ? '#FFF7ED' : '#F3F4F6'};
  color: ${({ $role }) =>
    $role === 'Partner Administrator' ? '#0174C3' :
    $role === 'Service Administrator' ? '#065F46' :
    $role === 'Billing Administrator' ? '#92400E' : '#374151'};
`;

const StatusBadge = styled.span<{ $status: UserStatus }>`
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 9px; border-radius: 100px;
  font-size: 11px; font-weight: 600;
  background: ${({ $status }) =>
    $status === 'Active' ? '#DEF8DE' :
    $status === 'Pending' ? '#FEF3C7' : '#FEE2E2'};
  color: ${({ $status }) =>
    $status === 'Active' ? '#1C7852' :
    $status === 'Pending' ? '#92400E' : '#991B1B'};
`;

const ServicePip = styled.span`
  display: inline-block;
  padding: 2px 7px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.neutral100};
  color: ${({ theme }) => theme.colors.neutral700};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px; margin-right: 4px;
`;

const ArrowCell = styled.div`
  color: ${({ theme }) => theme.colors.neutral400}; font-size: 11px;
`;

/* ── Side panel ──────────────────────────────────────────────────── */

const PanelOverlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.2);
  z-index: 200;
`;

const Panel = styled.div`
  position: fixed; top: 0; right: 0; bottom: 0;
  width: 480px; max-width: 95vw;
  background: ${({ theme }) => theme.colors.white};
  border-left: 1px solid ${({ theme }) => theme.colors.neutral200};
  z-index: 201;
  display: flex; flex-direction: column;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  flex-shrink: 0;
`;

const PanelTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 16px; font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900}; margin: 0;
`;

const PanelClose = styled.button`
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  background: none; border: none; cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral500};
  border-radius: 6px;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.neutral100}; }
`;

const PanelBody = styled.div`
  flex: 1; overflow-y: auto; padding: 24px;
`;

const PanelSection = styled.div`
  margin-bottom: 24px;
`;

const PanelSectionTitle = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.neutral500};
  margin-bottom: 12px;
`;

const UserMeta = styled.div`
  display: flex; align-items: center; gap: 14px; margin-bottom: 16px;
`;

const UserAvatar = styled.div`
  width: 48px; height: 48px; border-radius: 50%;
  background: linear-gradient(135deg, #0174C3, #20CCDE);
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 18px; font-weight: 600;
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const UserMetaInfo = styled.div``;
const UserMetaName = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 15px; font-weight: 600; color: ${({ theme }) => theme.colors.neutral900};
  margin-bottom: 3px;
`;
const UserMetaEmail = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; color: ${({ theme }) => theme.colors.neutral500};
`;

const FieldLabel = styled.label`
  display: block;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral700};
  margin-bottom: 6px;
`;

const FieldSelect = styled.select`
  width: 100%; padding: 9px 12px;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; color: ${({ theme }) => theme.colors.neutral900};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer; outline: none;
  margin-bottom: 6px;
  &:focus { border-color: ${({ theme }) => theme.colors.blue300}; }
`;

const FieldDesc = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; color: ${({ theme }) => theme.colors.neutral500};
  margin-bottom: 16px;
`;

const ServiceCheckGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
`;

const ServiceCheck = styled.label<{ $checked: boolean }>`
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px;
  border: 1px solid ${({ $checked, theme }) => $checked ? theme.colors.blue300 : theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $checked }) => $checked ? '#EEF6FF' : 'transparent'};
  cursor: pointer; transition: all 0.15s;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; color: ${({ theme }) => theme.colors.neutral800};
`;

const ServiceCheckbox = styled.input`accent-color: #0174C3;`;

/* ── Permission preview ──────────────────────────────────────────── */

const PermPreviewBox = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const PermPreviewHdr = styled.div`
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.neutral50};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; font-weight: 600; color: ${({ theme }) => theme.colors.neutral700};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
`;

const PermList = styled.div`
  padding: 12px 14px;
`;

const PermItem = styled.div<{ $allow: boolean }>`
  display: flex; align-items: flex-start; gap: 8px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; color: ${({ $allow, theme }) => $allow ? theme.colors.neutral800 : theme.colors.neutral500};
  margin-bottom: 7px;
  &:last-child { margin-bottom: 0; }
`;

const PermIcon = styled.span<{ $allow: boolean }>`
  color: ${({ $allow }) => $allow ? '#27A872' : '#DC2626'};
  flex-shrink: 0; margin-top: 1px;
`;

const PermDivider = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.neutral100};
  margin: 10px 0;
`;

/* ── Panel footer ────────────────────────────────────────────────── */

const PanelFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral200};
  display: flex; gap: 10px; justify-content: flex-end;
  flex-shrink: 0;
`;

const SaveBtn = styled.button`
  padding: 8px 20px;
  background: ${({ theme }) => theme.colors.blue300}; color: white; border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; font-weight: 500; cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  &:hover { background: ${({ theme }) => theme.colors.blue500}; }
`;

const CancelBtn = styled.button`
  padding: 8px 16px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; color: ${({ theme }) => theme.colors.neutral700}; cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  &:hover { background: ${({ theme }) => theme.colors.neutral100}; }
`;

/* ── Component ───────────────────────────────────────────────────── */

const serviceShort: Record<string, string> = {
  certcentral: 'CC',
  'trust-lifecycle': 'TLM',
  'private-ca': 'PCA',
  'software-trust': 'ST',
  'device-trust': 'DT',
  dns: 'DNS',
};

export const PartnerUsersPage: React.FC = () => {
  const [users, setUsers] = useState<PartnerUser[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<PartnerUser | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('Read-only');
  const [editServices, setEditServices] = useState<string[]>([]);

  useEffect(() => {
    document.title = 'Users — Partner workspace — DigiCert ONE';
  }, []);

  const openPanel = (user: PartnerUser) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditServices([...user.services]);
  };

  const closePanel = () => setSelectedUser(null);

  const toggleService = (svcId: string) => {
    setEditServices(prev =>
      prev.includes(svcId) ? prev.filter(s => s !== svcId) : [...prev, svcId]
    );
  };

  const handleSave = () => {
    if (!selectedUser) return;
    setUsers(prev => prev.map(u =>
      u.id === selectedUser.id
        ? { ...u, role: editRole, services: editServices }
        : u
    ));
    closePanel();
  };

  const previewUser: PartnerUser | null = selectedUser
    ? { ...selectedUser, role: editRole, services: editServices }
    : null;

  const perms = previewUser ? getPermissions(previewUser) : null;

  const usersRowData = useMemo(() => users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    scopeLabel: u.scopeLabel,
    servicesText: u.services.length === 0
      ? 'All services'
      : u.services.map(s => serviceShort[s] ?? s).join(' · '),
    status: u.status,
    lastActive: u.lastActive ? formatRelativeTime(u.lastActive) : '—',
  })), [users]);

  const usersColDefs = useMemo(() => ([
    { field: 'name',         headerName: 'User',            cellRenderer: UserCellRenderer, flex: 1.5, minWidth: 180 },
    { field: 'role',         headerName: 'Role',            cellRenderer: RoleBadgeRenderer, width: 200 },
    { field: 'scopeLabel',   headerName: 'Customer scope',  flex: 1, minWidth: 150 },
    { field: 'servicesText', headerName: 'Services',        flex: 1, minWidth: 130 },
    { field: 'status',       headerName: 'Status',          cellRenderer: StatusBadgeRenderer, width: 120 },
    { field: 'lastActive',   headerName: 'Last active',     width: 130 },
    { headerName: '', width: 50, sortable: false, resizable: false, suppressHeaderMenuButton: true,
      cellRenderer: () => <span style={{ color: '#A0AAB0', fontSize: 11 }}>›</span> },
  ] as ColDef[]), []);

  return (
    <PageWrapper>
      <PageHeader>
        <TitleBlock>
          <PageTitle>Users</PageTitle>
          <PageSubtitle>Partner team members and their access scope across your managed customers.</PageSubtitle>
        </TitleBlock>
        <InviteBtn>
          <FontAwesomeIcon icon={faPlus} style={{ fontSize: 12 }} />
          Invite user
        </InviteBtn>
      </PageHeader>

      <AgTableCard>
        <AgTable
          rowData={usersRowData}
          columnDefs={usersColDefs}
          onRowClicked={e => {
            const user = users.find(u => u.id === e.data?.id);
            if (user) openPanel(user);
          }}
        />
      </AgTableCard>

      {/* Side panel */}
      {selectedUser && (
        <>
          <PanelOverlay onClick={closePanel} />
          <Panel>
            <PanelHeader>
              <PanelTitle>Edit user access</PanelTitle>
              <PanelClose onClick={closePanel} aria-label="Close">
                <FontAwesomeIcon icon={faXmark} />
              </PanelClose>
            </PanelHeader>

            <PanelBody>
              {/* User identity */}
              <PanelSection>
                <UserMeta>
                  <UserAvatar>{selectedUser.name.charAt(0)}</UserAvatar>
                  <UserMetaInfo>
                    <UserMetaName>{selectedUser.name}</UserMetaName>
                    <UserMetaEmail>{selectedUser.email}</UserMetaEmail>
                  </UserMetaInfo>
                </UserMeta>
              </PanelSection>

              {/* Role */}
              <PanelSection>
                <PanelSectionTitle>Role</PanelSectionTitle>
                <FieldLabel htmlFor="edit-role">Assigned role</FieldLabel>
                <FieldSelect
                  id="edit-role"
                  value={editRole}
                  onChange={e => setEditRole(e.target.value as UserRole)}
                >
                  {allRoles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </FieldSelect>
                <FieldDesc>{roleDescriptions[editRole]}</FieldDesc>
              </PanelSection>

              {/* Customer scope */}
              <PanelSection>
                <PanelSectionTitle>Customer scope</PanelSectionTitle>
                <FieldLabel>Access scope</FieldLabel>
                <FieldSelect disabled value={selectedUser.scopeLabel}>
                  <option>{selectedUser.scopeLabel}</option>
                </FieldSelect>
                <FieldDesc>Customer scope is managed by a Partner Administrator.</FieldDesc>
              </PanelSection>

              {/* Service access */}
              <PanelSection>
                <PanelSectionTitle>Service access</PanelSectionTitle>
                <FieldLabel as="div">Services this user can manage</FieldLabel>
                <ServiceCheckGrid>
                  {allServices.map(svc => {
                    const checked = editServices.includes(svc.id);
                    return (
                      <ServiceCheck key={svc.id} $checked={checked}>
                        <ServiceCheckbox
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleService(svc.id)}
                        />
                        {svc.label}
                      </ServiceCheck>
                    );
                  })}
                </ServiceCheckGrid>
              </PanelSection>

              {/* Permission preview */}
              {perms && (
                <PanelSection>
                  <PanelSectionTitle>Permission preview</PanelSectionTitle>
                  <PermPreviewBox>
                    <PermPreviewHdr>This user will be able to:</PermPreviewHdr>
                    <PermList>
                      {perms.can.map(p => (
                        <PermItem key={p} $allow={true}>
                          <PermIcon $allow={true}>
                            <FontAwesomeIcon icon={faCircleCheck} />
                          </PermIcon>
                          {p}
                        </PermItem>
                      ))}
                      {perms.cannot.length > 0 && (
                        <>
                          <PermDivider />
                          <FieldDesc style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 11, color: '#636A6E' }}>
                            NOT able to:
                          </FieldDesc>
                          {perms.cannot.map(p => (
                            <PermItem key={p} $allow={false}>
                              <PermIcon $allow={false}>
                                <FontAwesomeIcon icon={faCircleXmark} />
                              </PermIcon>
                              {p}
                            </PermItem>
                          ))}
                        </>
                      )}
                    </PermList>
                  </PermPreviewBox>
                </PanelSection>
              )}
            </PanelBody>

            <PanelFooter>
              <CancelBtn onClick={closePanel}>Cancel</CancelBtn>
              <SaveBtn onClick={handleSave}>Save changes</SaveBtn>
            </PanelFooter>
          </Panel>
        </>
      )}
    </PageWrapper>
  );
};
