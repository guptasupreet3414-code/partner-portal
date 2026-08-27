export type CustomerHealth = 'Healthy' | 'Needs attention' | 'At risk';

export interface CustomerService {
  productId: string;
  productLabel: string;
  enabled: boolean;
  status?: 'Active' | 'Provisioning' | 'Failed' | 'Suspended';
}

export interface EntitlementItem {
  label: string;
  used: number;
  total: number;
  unit?: string;
}

export interface ProductEntitlement {
  productId: string;
  productLabel: string;
  entitlements: EntitlementItem[];
  status: 'Healthy' | 'Near limit' | 'At limit' | 'Over entitlement';
}

export interface Customer {
  id: string;
  name: string;
  region: string;
  accountOwner: string;
  createdDate: string;
  health: CustomerHealth;
  services: CustomerService[];
  entitlements: ProductEntitlement[];
  userCount: number;
  renewalDate?: string;
}

export const customers: Customer[] = [
  {
    id: 'acme-corp',
    name: 'Acme Corp',
    region: 'US',
    accountOwner: 'Sarah Chen',
    createdDate: '2022-03-15',
    health: 'Needs attention',
    userCount: 48,
    renewalDate: '2026-03-01',
    services: [
      { productId: 'certcentral', productLabel: 'CertCentral', enabled: true, status: 'Active' },
      { productId: 'trust-lifecycle', productLabel: 'Trust Lifecycle', enabled: true, status: 'Active' },
      { productId: 'private-ca', productLabel: 'Private CA', enabled: true, status: 'Active' },
      { productId: 'software-trust', productLabel: 'Software Trust', enabled: false },
      { productId: 'dns', productLabel: 'DigiCert DNS', enabled: false },
      { productId: 'device-trust', productLabel: 'Device Trust', enabled: false },
    ],
    entitlements: [
      {
        productId: 'certcentral',
        productLabel: 'CertCentral',
        status: 'Near limit',
        entitlements: [
          { label: 'SSL/TLS certificates', used: 108, total: 150 },
          { label: 'Code signing certificates', used: 12, total: 20 },
          { label: 'S/MIME certificates', used: 68, total: 100 },
        ],
      },
      {
        productId: 'trust-lifecycle',
        productLabel: 'Trust Lifecycle',
        status: 'Healthy',
        entitlements: [
          { label: 'Seats', used: 42, total: 75 },
        ],
      },
      {
        productId: 'private-ca',
        productLabel: 'Private CA',
        status: 'Healthy',
        entitlements: [
          { label: 'Private root certificates', used: 8, total: 10 },
          { label: 'Private intermediate CA certificates', used: 15, total: 25 },
          { label: 'Dynamic intermediate CAs', used: 21000, total: 50000 },
        ],
      },
    ],
  },
  {
    id: 'globex',
    name: 'Globex Corporation',
    region: 'EU',
    accountOwner: 'Marcus Weber',
    createdDate: '2021-11-08',
    health: 'Needs attention',
    userCount: 92,
    renewalDate: '2026-11-08',
    services: [
      { productId: 'certcentral', productLabel: 'CertCentral', enabled: true, status: 'Active' },
      { productId: 'trust-lifecycle', productLabel: 'Trust Lifecycle', enabled: true, status: 'Failed' },
      { productId: 'software-trust', productLabel: 'Software Trust', enabled: true, status: 'Active' },
      { productId: 'private-ca', productLabel: 'Private CA', enabled: false },
      { productId: 'dns', productLabel: 'DigiCert DNS', enabled: false },
      { productId: 'device-trust', productLabel: 'Device Trust', enabled: false },
    ],
    entitlements: [
      {
        productId: 'certcentral',
        productLabel: 'CertCentral',
        status: 'Healthy',
        entitlements: [
          { label: 'SSL/TLS certificates', used: 34, total: 50 },
          { label: 'Code signing certificates', used: 4, total: 10 },
          { label: 'S/MIME certificates', used: 62, total: 100 },
        ],
      },
      {
        productId: 'trust-lifecycle',
        productLabel: 'Trust Lifecycle',
        status: 'Near limit',
        entitlements: [
          { label: 'Seats', used: 70, total: 75 },
        ],
      },
      {
        productId: 'software-trust',
        productLabel: 'Software Trust',
        status: 'Healthy',
        entitlements: [
          { label: 'Signatures', used: 124210, total: 250000 },
          { label: 'HSM keypairs', used: 2, total: 4 },
        ],
      },
    ],
  },
  {
    id: 'contoso',
    name: 'Contoso Ltd.',
    region: 'US',
    accountOwner: 'David Park',
    createdDate: '2023-01-20',
    health: 'Needs attention',
    userCount: 35,
    renewalDate: '2026-01-20',
    services: [
      { productId: 'certcentral', productLabel: 'CertCentral', enabled: true, status: 'Active' },
      { productId: 'private-ca', productLabel: 'Private CA', enabled: true, status: 'Active' },
      { productId: 'trust-lifecycle', productLabel: 'Trust Lifecycle', enabled: false },
      { productId: 'software-trust', productLabel: 'Software Trust', enabled: false },
      { productId: 'dns', productLabel: 'DigiCert DNS', enabled: false },
      { productId: 'device-trust', productLabel: 'Device Trust', enabled: false },
    ],
    entitlements: [
      {
        productId: 'certcentral',
        productLabel: 'CertCentral',
        status: 'Healthy',
        entitlements: [
          { label: 'SSL/TLS certificates', used: 55, total: 120 },
          { label: 'Code signing certificates', used: 18, total: 40 },
          { label: 'S/MIME certificates', used: 210, total: 300 },
        ],
      },
      {
        productId: 'private-ca',
        productLabel: 'Private CA',
        status: 'At limit',
        entitlements: [
          { label: 'Private root certificates', used: 10, total: 10 },
          { label: 'Private intermediate CA certificates', used: 20, total: 25 },
          { label: 'Dynamic intermediate CAs', used: 38500, total: 50000 },
        ],
      },
    ],
  },
  {
    id: 'initech',
    name: 'Initech',
    region: 'US',
    accountOwner: 'Lisa Torres',
    createdDate: '2022-07-01',
    health: 'Needs attention',
    userCount: 27,
    renewalDate: '2026-07-01',
    services: [
      { productId: 'software-trust', productLabel: 'Software Trust', enabled: true, status: 'Active' },
      { productId: 'certcentral', productLabel: 'CertCentral', enabled: true, status: 'Active' },
      { productId: 'trust-lifecycle', productLabel: 'Trust Lifecycle', enabled: false },
      { productId: 'private-ca', productLabel: 'Private CA', enabled: false },
      { productId: 'dns', productLabel: 'DigiCert DNS', enabled: false },
      { productId: 'device-trust', productLabel: 'Device Trust', enabled: false },
    ],
    entitlements: [
      {
        productId: 'software-trust',
        productLabel: 'Software Trust',
        status: 'Near limit',
        entitlements: [
          { label: 'Signatures', used: 99400, total: 250000 },
          { label: 'HSM keypairs', used: 1, total: 4 },
        ],
      },
      {
        productId: 'certcentral',
        productLabel: 'CertCentral',
        status: 'Healthy',
        entitlements: [
          { label: 'SSL/TLS certificates', used: 18, total: 50 },
          { label: 'Code signing certificates', used: 5, total: 15 },
        ],
      },
    ],
  },
  {
    id: 'umbrella',
    name: 'Umbrella Inc.',
    region: 'EU',
    accountOwner: 'Anna Kovacs',
    createdDate: '2023-06-12',
    health: 'Healthy',
    userCount: 61,
    renewalDate: '2026-06-12',
    services: [
      { productId: 'certcentral', productLabel: 'CertCentral', enabled: true, status: 'Active' },
      { productId: 'trust-lifecycle', productLabel: 'Trust Lifecycle', enabled: true, status: 'Active' },
      { productId: 'device-trust', productLabel: 'Device Trust', enabled: true, status: 'Active' },
      { productId: 'private-ca', productLabel: 'Private CA', enabled: false },
      { productId: 'software-trust', productLabel: 'Software Trust', enabled: false },
      { productId: 'dns', productLabel: 'DigiCert DNS', enabled: false },
    ],
    entitlements: [
      {
        productId: 'certcentral',
        productLabel: 'CertCentral',
        status: 'Healthy',
        entitlements: [
          { label: 'SSL/TLS certificates', used: 55, total: 100 },
          { label: 'Code signing certificates', used: 18, total: 40 },
          { label: 'S/MIME certificates', used: 210, total: 300 },
        ],
      },
      {
        productId: 'trust-lifecycle',
        productLabel: 'Trust Lifecycle',
        status: 'Healthy',
        entitlements: [
          { label: 'Seats', used: 30, total: 75 },
        ],
      },
      {
        productId: 'device-trust',
        productLabel: 'Device Trust',
        status: 'Healthy',
        entitlements: [
          { label: 'Devices', used: 1240, total: 5000 },
        ],
      },
    ],
  },
];

export const getCustomerById = (id: string): Customer | undefined =>
  customers.find(c => c.id === id);

export interface PortfolioAlert {
  customerId: string;
  customerName: string;
  productId: string;
  productLabel: string;
  message: string;
  severity: 'warning' | 'error' | 'info';
}

export const portfolioAlerts: PortfolioAlert[] = [
  {
    customerId: 'acme-corp',
    customerName: 'Acme Corp',
    productId: 'certcentral',
    productLabel: 'CertCentral',
    message: 'SSL/TLS certificate entitlement at 72%',
    severity: 'warning',
  },
  {
    customerId: 'globex',
    customerName: 'Globex Corporation',
    productId: 'trust-lifecycle',
    productLabel: 'Trust Lifecycle',
    message: 'Provisioning failed',
    severity: 'error',
  },
  {
    customerId: 'contoso',
    customerName: 'Contoso Ltd.',
    productId: 'private-ca',
    productLabel: 'Private CA',
    message: 'Private root certificates at limit (10/10)',
    severity: 'error',
  },
  {
    customerId: 'initech',
    customerName: 'Initech',
    productId: 'software-trust',
    productLabel: 'Software Trust',
    message: 'High signature utilization (99,400 / 250,000)',
    severity: 'warning',
  },
  {
    customerId: 'globex',
    customerName: 'Globex Corporation',
    productId: 'trust-lifecycle',
    productLabel: 'Trust Lifecycle',
    message: 'Seat entitlement near limit (70 / 75)',
    severity: 'warning',
  },
];

export interface ActivityEvent {
  id: string;
  timestamp: string;
  customerId: string;
  customerName: string;
  productId: string;
  productLabel: string;
  activity: string;
  status: 'Completed' | 'Failed' | 'In progress' | 'Warning';
  performedBy: string;
}

export const activityEvents: ActivityEvent[] = [
  {
    id: '1',
    timestamp: '2026-08-24T10:30:00Z',
    customerId: 'acme-corp',
    customerName: 'Acme Corp',
    productId: 'certcentral',
    productLabel: 'CertCentral',
    activity: 'SSL/TLS entitlement threshold reached (72%)',
    status: 'Warning',
    performedBy: 'System',
  },
  {
    id: '2',
    timestamp: '2026-08-24T09:15:00Z',
    customerId: 'globex',
    customerName: 'Globex Corporation',
    productId: 'trust-lifecycle',
    productLabel: 'Trust Lifecycle',
    activity: 'Service provisioning failed',
    status: 'Failed',
    performedBy: 'System',
  },
  {
    id: '3',
    timestamp: '2026-08-23T16:45:00Z',
    customerId: 'umbrella',
    customerName: 'Umbrella Inc.',
    productId: 'certcentral',
    productLabel: 'CertCentral',
    activity: 'User created',
    status: 'Completed',
    performedBy: 'j.smith@abc-security.com',
  },
  {
    id: '4',
    timestamp: '2026-08-23T14:20:00Z',
    customerId: 'contoso',
    customerName: 'Contoso Ltd.',
    productId: 'private-ca',
    productLabel: 'Private CA',
    activity: 'Private root certificate at limit',
    status: 'Warning',
    performedBy: 'System',
  },
  {
    id: '5',
    timestamp: '2026-08-23T11:05:00Z',
    customerId: 'initech',
    customerName: 'Initech',
    productId: 'software-trust',
    productLabel: 'Software Trust',
    activity: 'Service provisioning completed',
    status: 'Completed',
    performedBy: 'l.torres@abc-security.com',
  },
  {
    id: '6',
    timestamp: '2026-08-22T15:30:00Z',
    customerId: 'globex',
    customerName: 'Globex Corporation',
    productId: 'certcentral',
    productLabel: 'CertCentral',
    activity: 'User updated',
    status: 'Completed',
    performedBy: 'm.weber@abc-security.com',
  },
  {
    id: '7',
    timestamp: '2026-08-22T10:00:00Z',
    customerId: 'umbrella',
    customerName: 'Umbrella Inc.',
    productId: 'device-trust',
    productLabel: 'Device Trust',
    activity: 'Service enabled',
    status: 'Completed',
    performedBy: 'a.kovacs@abc-security.com',
  },
  {
    id: '8',
    timestamp: '2026-08-21T09:00:00Z',
    customerId: 'acme-corp',
    customerName: 'Acme Corp',
    productId: 'certcentral',
    productLabel: 'CertCentral',
    activity: 'Customer added to partner portal',
    status: 'Completed',
    performedBy: 's.chen@abc-security.com',
  },
];

export interface ManagedUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  customerId: string;
  customerName: string;
  status: 'Active' | 'Pending' | 'Locked';
  services: string[];
  roles: string[];
  groups: string[];
  lastUpdatedBy: string;
}

export const managedUsers: ManagedUser[] = [
  {
    id: 'u1',
    username: 'jdoe',
    fullName: 'John Doe',
    email: 'j.doe@acmecorp.com',
    customerId: 'acme-corp',
    customerName: 'Acme Corp',
    status: 'Active',
    services: ['CertCentral', 'Trust Lifecycle'],
    roles: ['Admin'],
    groups: ['Certificate Admins'],
    lastUpdatedBy: 's.chen@abc-security.com',
  },
  {
    id: 'u2',
    username: 'asmith',
    fullName: 'Alice Smith',
    email: 'a.smith@acmecorp.com',
    customerId: 'acme-corp',
    customerName: 'Acme Corp',
    status: 'Active',
    services: ['CertCentral'],
    roles: ['User'],
    groups: ['Standard Users'],
    lastUpdatedBy: 'j.doe@acmecorp.com',
  },
  {
    id: 'u3',
    username: 'mweber',
    fullName: 'Marcus Weber',
    email: 'm.weber@globex.com',
    customerId: 'globex',
    customerName: 'Globex Corporation',
    status: 'Active',
    services: ['CertCentral', 'Trust Lifecycle', 'Software Trust'],
    roles: ['Admin'],
    groups: ['Globex Admins'],
    lastUpdatedBy: 'm.weber@abc-security.com',
  },
  {
    id: 'u4',
    username: 'rjones',
    fullName: 'Robert Jones',
    email: 'r.jones@globex.com',
    customerId: 'globex',
    customerName: 'Globex Corporation',
    status: 'Pending',
    services: ['Trust Lifecycle'],
    roles: ['User'],
    groups: [],
    lastUpdatedBy: 'm.weber@globex.com',
  },
  {
    id: 'u5',
    username: 'dpark',
    fullName: 'David Park',
    email: 'd.park@contoso.com',
    customerId: 'contoso',
    customerName: 'Contoso Ltd.',
    status: 'Active',
    services: ['CertCentral', 'Private CA'],
    roles: ['Admin'],
    groups: ['CA Admins'],
    lastUpdatedBy: 'd.park@abc-security.com',
  },
  {
    id: 'u6',
    username: 'ltorres',
    fullName: 'Lisa Torres',
    email: 'l.torres@initech.com',
    customerId: 'initech',
    customerName: 'Initech',
    status: 'Active',
    services: ['Software Trust'],
    roles: ['Admin'],
    groups: ['DevOps'],
    lastUpdatedBy: 'l.torres@abc-security.com',
  },
  {
    id: 'u7',
    username: 'bwhite',
    fullName: 'Brian White',
    email: 'b.white@initech.com',
    customerId: 'initech',
    customerName: 'Initech',
    status: 'Locked',
    services: ['Software Trust'],
    roles: ['User'],
    groups: ['DevOps'],
    lastUpdatedBy: 'System',
  },
  {
    id: 'u8',
    username: 'akovacs',
    fullName: 'Anna Kovacs',
    email: 'a.kovacs@umbrella.com',
    customerId: 'umbrella',
    customerName: 'Umbrella Inc.',
    status: 'Active',
    services: ['CertCentral', 'Trust Lifecycle', 'Device Trust'],
    roles: ['Admin'],
    groups: ['Umbrella Admins'],
    lastUpdatedBy: 'a.kovacs@abc-security.com',
  },
];

export interface EntitlementRow {
  customerId: string;
  customerName: string;
  productId: string;
  productLabel: string;
  entitlementLabel: string;
  allocated: number;
  consumed: number;
  unit?: string;
  status: 'Healthy' | 'Near limit' | 'At limit' | 'Over entitlement';
}

export const entitlementRows: EntitlementRow[] = [
  { customerId: 'acme-corp', customerName: 'Acme Corp', productId: 'certcentral', productLabel: 'CertCentral', entitlementLabel: 'SSL/TLS certificates', allocated: 150, consumed: 108, status: 'Healthy' },
  { customerId: 'acme-corp', customerName: 'Acme Corp', productId: 'certcentral', productLabel: 'CertCentral', entitlementLabel: 'Code signing certificates', allocated: 20, consumed: 12, status: 'Healthy' },
  { customerId: 'acme-corp', customerName: 'Acme Corp', productId: 'certcentral', productLabel: 'CertCentral', entitlementLabel: 'S/MIME certificates', allocated: 100, consumed: 68, status: 'Healthy' },
  { customerId: 'acme-corp', customerName: 'Acme Corp', productId: 'trust-lifecycle', productLabel: 'Trust Lifecycle', entitlementLabel: 'Seats', allocated: 75, consumed: 42, status: 'Healthy' },
  { customerId: 'acme-corp', customerName: 'Acme Corp', productId: 'private-ca', productLabel: 'Private CA', entitlementLabel: 'Private root certificates', allocated: 10, consumed: 8, status: 'Healthy' },
  { customerId: 'acme-corp', customerName: 'Acme Corp', productId: 'private-ca', productLabel: 'Private CA', entitlementLabel: 'Private intermediate CA certificates', allocated: 25, consumed: 15, status: 'Healthy' },
  { customerId: 'acme-corp', customerName: 'Acme Corp', productId: 'private-ca', productLabel: 'Private CA', entitlementLabel: 'Dynamic intermediate CAs', allocated: 50000, consumed: 21000, status: 'Healthy' },
  { customerId: 'globex', customerName: 'Globex Corporation', productId: 'certcentral', productLabel: 'CertCentral', entitlementLabel: 'SSL/TLS certificates', allocated: 50, consumed: 34, status: 'Healthy' },
  { customerId: 'globex', customerName: 'Globex Corporation', productId: 'certcentral', productLabel: 'CertCentral', entitlementLabel: 'S/MIME certificates', allocated: 100, consumed: 62, status: 'Healthy' },
  { customerId: 'globex', customerName: 'Globex Corporation', productId: 'trust-lifecycle', productLabel: 'Trust Lifecycle', entitlementLabel: 'Seats', allocated: 75, consumed: 70, status: 'Near limit' },
  { customerId: 'globex', customerName: 'Globex Corporation', productId: 'software-trust', productLabel: 'Software Trust', entitlementLabel: 'Signatures', allocated: 250000, consumed: 124210, status: 'Healthy' },
  { customerId: 'contoso', customerName: 'Contoso Ltd.', productId: 'certcentral', productLabel: 'CertCentral', entitlementLabel: 'SSL/TLS certificates', allocated: 120, consumed: 55, status: 'Healthy' },
  { customerId: 'contoso', customerName: 'Contoso Ltd.', productId: 'certcentral', productLabel: 'CertCentral', entitlementLabel: 'S/MIME certificates', allocated: 300, consumed: 210, status: 'Healthy' },
  { customerId: 'contoso', customerName: 'Contoso Ltd.', productId: 'private-ca', productLabel: 'Private CA', entitlementLabel: 'Private root certificates', allocated: 10, consumed: 10, status: 'At limit' },
  { customerId: 'contoso', customerName: 'Contoso Ltd.', productId: 'private-ca', productLabel: 'Private CA', entitlementLabel: 'Private intermediate CA certificates', allocated: 25, consumed: 20, status: 'Healthy' },
  { customerId: 'contoso', customerName: 'Contoso Ltd.', productId: 'private-ca', productLabel: 'Private CA', entitlementLabel: 'Dynamic intermediate CAs', allocated: 50000, consumed: 38500, status: 'Near limit' },
  { customerId: 'initech', customerName: 'Initech', productId: 'software-trust', productLabel: 'Software Trust', entitlementLabel: 'Signatures', allocated: 250000, consumed: 99400, status: 'Healthy' },
  { customerId: 'initech', customerName: 'Initech', productId: 'software-trust', productLabel: 'Software Trust', entitlementLabel: 'HSM keypairs', allocated: 4, consumed: 1, status: 'Healthy' },
  { customerId: 'umbrella', customerName: 'Umbrella Inc.', productId: 'certcentral', productLabel: 'CertCentral', entitlementLabel: 'SSL/TLS certificates', allocated: 100, consumed: 55, status: 'Healthy' },
  { customerId: 'umbrella', customerName: 'Umbrella Inc.', productId: 'certcentral', productLabel: 'CertCentral', entitlementLabel: 'Code signing certificates', allocated: 40, consumed: 18, status: 'Healthy' },
  { customerId: 'umbrella', customerName: 'Umbrella Inc.', productId: 'certcentral', productLabel: 'CertCentral', entitlementLabel: 'S/MIME certificates', allocated: 300, consumed: 210, status: 'Healthy' },
  { customerId: 'umbrella', customerName: 'Umbrella Inc.', productId: 'trust-lifecycle', productLabel: 'Trust Lifecycle', entitlementLabel: 'Seats', allocated: 75, consumed: 30, status: 'Healthy' },
];

export const formatNumber = (n: number): string =>
  n >= 1000 ? n.toLocaleString() : String(n);
