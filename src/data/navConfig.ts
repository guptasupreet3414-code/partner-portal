import type { FunctionComponent, SVGProps } from 'react';
import OverviewIcon from '../assets/overview.svg?react';
import QuantumCentralIcon from '../assets/quantum-central.svg?react';
import CertcentralIcon from '../assets/certcentral.svg?react';
import PrivateCaIcon from '../assets/private-ca.svg?react';
import TrustLifecycleIcon from '../assets/trust-lifecycle.svg?react';
import SoftwareTrustIcon from '../assets/software-trust.svg?react';
import DigicertDnsIcon from '../assets/digicert-dns.svg?react';
import ContentTrustIcon from '../assets/content-trust.svg?react';
import DeviceTrustIcon from '../assets/device-trust.svg?react';
import AiAgentsIcon from '../assets/ai-agents.svg?react';
import ValimailIcon from '../assets/valimail.svg?react';

export type IconComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

export interface NavItem {
  label: string;
  route: string;
  /** Renders a "New" badge. Use on at most 2 items per product. */
  badge?: boolean;
  /** Renders a circular number badge to the left of the label. Use on at most 1 item per product. */
  numberBadge?: number;
  /** Opens `route` in a new tab (e.g. a standalone page) instead of routing in-app. */
  external?: boolean;
}

export interface NavSection {
  title: string;
  defaultExpanded?: boolean;
  items: NavItem[];
  /** Renders a "New" badge in the accordion header. Use on at most one section per product. */
  badge?: boolean;
}

export interface ProductPlan {
  /** Tier name shown in the spoke header, e.g. "Essentials" */
  tier: string;
  /** Route to the plan / subscription page */
  route: string;
  /** Seats currently in use — surfaced in the plan footer when paired with seatsTotal */
  seatsUsed?: number;
  /** Total seats on the subscription */
  seatsTotal?: number;
}

export interface ProductInstanceConfig {
  /** ID of the instance shown by default in the spoke header */
  defaultId: string;
  /** IDs of instances connected by default (visible in the switcher list). Any instances not in this list are surfaced in the "Add a connected instance" dropdown. */
  defaultConnectedIds: string[];
}

export interface ProductNav {
  id: string;
  label: string;
  route: string;
  ariaLabel: string;
  sections: NavSection[];
  /** Optional subscription tier surfaced under the product label in the spoke nav */
  plan?: ProductPlan;
  /** Optional current-instance indicator surfaced under the product label; opens a switcher modal */
  instance?: ProductInstanceConfig;
}

export interface InstanceAccountManager {
  name: string;
  email: string;
}

export interface CertCentralInstance {
  id: string;
  /** Short display name, e.g. "ACME Corp — Official" */
  name: string;
  /** Two- or three-letter region code, e.g. "US", "EU" */
  region: string;
  /** The signed-in user's role on this instance */
  role: string;
  /** Numeric account ID surfaced in the hover popover */
  accountId: string;
  /** Long-form region, e.g. "United States" */
  regionFull: string;
  /** Subscription tier on this instance, e.g. "Enterprise" */
  tier: string;
  accountManager: InstanceAccountManager;
}

export const certCentralInstances: CertCentralInstance[] = [
  {
    id: 'acme-official',
    name: 'ACME Corp — Official',
    region: 'US',
    role: 'Finance manager',
    accountId: '8345672',
    regionFull: 'United States',
    tier: 'Enterprise',
    accountManager: { name: 'Jane Smith', email: 'jane.smith@acme.com' },
  },
  {
    id: 'acme-it',
    name: 'ACME Corp — IT',
    region: 'US',
    role: 'Manager',
    accountId: '8345673',
    regionFull: 'United States',
    tier: 'Enterprise',
    accountManager: { name: 'Jane Smith', email: 'jane.smith@acme.com' },
  },
  {
    id: 'acme-dev',
    name: 'ACME Corp — Dev',
    region: 'EU',
    role: 'Manager',
    accountId: '8345674',
    regionFull: 'European Union',
    tier: 'Enterprise',
    accountManager: { name: 'Jane Smith', email: 'jane.smith@acme.com' },
  },
  {
    id: 'acme-sales',
    name: 'ACME Corp — Sales',
    region: 'US',
    role: 'Manager',
    accountId: '8345675',
    regionFull: 'United States',
    tier: 'Enterprise',
    accountManager: { name: 'Jane Smith', email: 'jane.smith@acme.com' },
  },
  {
    id: 'acme-staging',
    name: 'ACME Corp — Staging',
    region: 'EU',
    role: 'Admin',
    accountId: '8345677',
    regionFull: 'European Union',
    tier: 'Standard',
    accountManager: { name: 'Jane Smith', email: 'jane.smith@acme.com' },
  },
  {
    id: 'acme-marketing',
    name: 'ACME Corp — Marketing',
    region: 'EU',
    role: 'Read-only',
    accountId: '8345678',
    regionFull: 'European Union',
    tier: 'Standard',
    accountManager: { name: 'Jane Smith', email: 'jane.smith@acme.com' },
  },
];

export interface IconRailProduct {
  id: string;
  label: string;
  /**
   * Short caption shown under the icon in the rail. Falls back to `label` when
   * omitted. Use this to keep the visible caption on a single line — `label`
   * (the full product name) is still used for the hover tooltip and aria-label,
   * so screen readers and tooltips always get the complete name.
   */
  railLabel?: string;
  route: string;
  ariaLabel: string;
  Icon: IconComponent;
}

export const iconRailGroup1: IconRailProduct[] = [
  { id: 'dashboard', label: 'Overview', route: '/dashboard', ariaLabel: 'Overview', Icon: OverviewIcon },
  { id: 'quantum-central', label: 'Quantum Central', railLabel: 'Quantum', route: '/quantum-central', ariaLabel: 'Quantum Central', Icon: QuantumCentralIcon },
  { id: 'certcentral', label: 'CertCentral', route: '/certcentral', ariaLabel: 'CertCentral', Icon: CertcentralIcon },
  { id: 'private-ca', label: 'Private CA', route: '/private-ca', ariaLabel: 'Private CA', Icon: PrivateCaIcon },
  { id: 'trust-lifecycle', label: 'Trust Lifecycle', railLabel: 'Lifecycle', route: '/trust-lifecycle', ariaLabel: 'Trust Lifecycle', Icon: TrustLifecycleIcon },
  { id: 'software-trust', label: 'Software Trust', railLabel: 'Software', route: '/software-trust', ariaLabel: 'Software Trust', Icon: SoftwareTrustIcon },
  { id: 'dns', label: 'DigiCert DNS', railLabel: 'DNS', route: '/dns', ariaLabel: 'DigiCert DNS', Icon: DigicertDnsIcon },
  { id: 'content-trust', label: 'Content Trust', railLabel: 'Content', route: '/content-trust', ariaLabel: 'Content Trust', Icon: ContentTrustIcon },
  { id: 'device-trust', label: 'Device Trust', railLabel: 'Device', route: '/device-trust', ariaLabel: 'Device Trust', Icon: DeviceTrustIcon },
];

/* "Explore" products — user does not have access. Clicking renders a landing page instead of a spoke nav. */
export const iconRailGroup2: IconRailProduct[] = [
  { id: 'ai-agents', label: 'AI Agents', railLabel: 'AI Agents', route: '/ai-agents', ariaLabel: 'AI Agents', Icon: AiAgentsIcon },
  { id: 'valimail', label: 'Valimail', route: '/valimail', ariaLabel: 'Valimail', Icon: ValimailIcon },
];

export const exploreProductIds = new Set(iconRailGroup2.map(p => p.id));

export interface ExploreFeature {
  title: string;
  description: string;
}

export interface ExploreProduct {
  id: string;
  name: string;
  tagline: string;
  features: ExploreFeature[];
}

export const exploreProducts: Record<string, ExploreProduct> = {
  'ai-agents': {
    id: 'ai-agents',
    name: 'AI Agents',
    tagline: 'Establish trust for autonomous AI agents acting on behalf of your organization.',
    features: [
      {
        title: 'Verifiable agent identity',
        description: 'Issue cryptographic identities to every agent so downstream systems can verify who is acting and on whose authority.',
      },
      {
        title: 'Signed actions',
        description: 'Cryptographically sign every agent decision and tool call to produce a tamper-evident audit trail.',
      },
      {
        title: 'Policy enforcement',
        description: 'Define guardrails for what agents can do and revoke access in real time when behavior drifts.',
      },
    ],
  },
  valimail: {
    id: 'valimail',
    name: 'Valimail',
    tagline: 'Stop email impersonation and protect your brand with automated email authentication.',
    features: [
      {
        title: 'DMARC enforcement',
        description: 'Move from monitoring to full enforcement without breaking legitimate mail flows.',
      },
      {
        title: 'Sender authentication',
        description: 'Continuously verify SPF, DKIM, and DMARC for every sender across your domains.',
      },
      {
        title: 'Brand indicators',
        description: 'Display your verified logo in inboxes that support BIMI to reinforce trust at a glance.',
      },
    ],
  },
};

/**
 * The account's current subscription plan. Single source of truth surfaced in
 * the Trust Lifecycle spoke, the Settings (gear) menu, and the profile menu.
 */
export const currentPlan = {
  name: 'Essentials',
  /** Route to the manage-billing page (plans comparison + seats) */
  route: '/settings/billing/trust-lifecycle',
  seatsUsed: 25,
  seatsTotal: 70,
} as const;

export const productNavConfig: Record<string, ProductNav> = {
  dashboard: {
    id: 'dashboard',
    label: 'Overview',
    route: '/dashboard',
    ariaLabel: 'Overview navigation',
    sections: [
      {
        title: '',
        defaultExpanded: true,
        items: [
          { label: 'Home', route: '/dashboard' },
          { label: 'Clients tools insights', route: '/dashboard/clients-tools' },
        ],
      },
    ],
  },

  'quantum-central': {
    id: 'quantum-central',
    label: 'Quantum Central',
    route: '/quantum-central',
    ariaLabel: 'Quantum Central navigation',
    sections: [
      {
        title: '',
        defaultExpanded: true,
        items: [
          { label: 'Dashboard', route: '/quantum-central/dashboard' },
          { label: 'Inventory', route: '/quantum-central/inventory' },
          { label: 'Violations', route: '/quantum-central/violations' },
          { label: 'Integrations', route: '/quantum-central/integrations' },
          { label: 'Learn PQC', route: '/quantum-central/learn-pqc' },
          { label: 'Product Settings', route: '/quantum-central/product-settings' },
        ],
      },
    ],
  },

  certcentral: {
    id: 'certcentral',
    label: 'CertCentral',
    route: '/certcentral',
    ariaLabel: 'CertCentral navigation',
    instance: {
      defaultId: 'acme-official',
      defaultConnectedIds: ['acme-official', 'acme-it', 'acme-dev'],
    },
    sections: [
      {
        title: '',
        items: [
          { label: 'Request a certificate', route: '/certcentral/request-a-certificate' },
        ],
      },
      {
        title: 'OVERVIEW',
        defaultExpanded: true,
        items: [
          { label: 'Dashboard', route: '/certcentral/dashboard' },
          { label: 'Reports', route: '/certcentral/reports', numberBadge: 12 },
          { label: 'Audit logs', route: '/certcentral/audit-logs' },
        ],
      },
      {
        title: 'CERTIFICATES',
        items: [
          { label: 'Orders', route: '/certcentral/orders' },
          { label: 'Requests', route: '/certcentral/requests' },
          { label: 'Expiring Certificates', route: '/certcentral/expiring-certificates' },
          { label: 'Certificate Authority', route: '/certcentral/certificate-authority' },
        ],
      },
      {
        title: 'VALIDATION',
        items: [
          { label: 'Domains', route: '/certcentral/domains' },
          { label: 'Organizations', route: '/certcentral/organizations' },
        ],
      },
      {
        title: 'FINANCES',
        items: [
          { label: 'Purchase history', route: '/certcentral/purchase-history' },
          { label: 'Balance history', route: '/certcentral/balance-history' },
          { label: 'Account pricing', route: '/certcentral/account-pricing' },
          { label: 'Deposit funds', route: '/certcentral/deposit-funds' },
          { label: 'Voucher codes', route: '/certcentral/voucher-codes' },
          { label: 'Pay invoice', route: '/certcentral/pay-invoice' },
          { label: 'Purchase orders and invoices', route: '/certcentral/purchase-orders-and-invoices' },
          { label: 'Quotes', route: '/certcentral/quotes' },
          { label: 'Credit cards', route: '/certcentral/credit-cards' },
          { label: 'Settings', route: '/certcentral/finance-settings' },
        ],
      },
      {
        title: 'SUBACCOUNTS',
        items: [
          { label: 'Subaccounts', route: '/certcentral/subaccounts' },
          { label: 'Orders', route: '/certcentral/subaccounts-orders' },
        ],
      },
      {
        title: 'TOOLS',
        items: [
          { label: 'SSL installation tool', route: '/certcentral/ssl-installation-tool' },
          { label: 'Certificate utility', route: '/certcentral/certificate-utility' },
          { label: 'CSR generators', route: '/certcentral/csr-generators' },
        ],
      },
      {
        title: 'INTEGRATIONS',
        items: [
          { label: 'ACME Directory URLs', route: '/certcentral/acme-directory-urls' },
          { label: 'API Keys', route: '/certcentral/api-keys' },
          { label: 'Webhooks', route: '/certcentral/webhooks' },
          { label: 'Integrate with Ultra DNS', route: '/certcentral/ultra-dns' },
        ],
      },
      {
        title: 'ACCOUNT',
        items: [
          { label: 'Users', route: '/certcentral/users' },
          { label: 'Service users', route: '/certcentral/service-users' },
          { label: 'Divisions', route: '/certcentral/divisions' },
          { label: 'Guest access', route: '/certcentral/guest-access' },
          { label: 'User invitations', route: '/certcentral/user-invitations' },
        ],
      },
      {
        title: 'CONFIGURATION',
        items: [
          { label: 'Preferences', route: '/certcentral/preferences' },
          { label: 'Notifications', route: '/certcentral/notifications' },
          { label: 'Authentication settings', route: '/certcentral/authentication-settings' },
          { label: 'IP restrictions', route: '/certcentral/ip-restrictions' },
          { label: 'Product settings', route: '/certcentral/product-settings' },
          { label: 'Custom order fields', route: '/certcentral/custom-order-fields' },
        ],
      },
      {
        title: '',
        items: [
          { label: 'Standard Support', route: '/certcentral/standard-support' },
        ],
      },
    ],
  },

  'trust-lifecycle': {
    id: 'trust-lifecycle',
    label: 'Trust Lifecycle',
    route: '/trust-lifecycle',
    ariaLabel: 'Trust Lifecycle navigation',
    plan: {
      tier: currentPlan.name,
      route: currentPlan.route,
      seatsUsed: currentPlan.seatsUsed,
      seatsTotal: currentPlan.seatsTotal,
    },
    sections: [
      {
        title: 'OVERVIEW',
        defaultExpanded: true,
        items: [
          { label: 'Dashboard', route: '/trust-lifecycle/dashboard' },
          { label: 'Reports', route: '/trust-lifecycle/reports' },
          { label: 'Audit logs', route: '/trust-lifecycle/audit-logs' },
        ],
      },
      {
        title: 'INVENTORY',
        items: [
          { label: 'Certificates', route: '/trust-lifecycle/certificates' },
          { label: 'Trust stores', route: '/trust-lifecycle/trust-stores' },
        ],
      },
      {
        title: 'POLICIES',
        items: [
          { label: 'Certificate profiles', route: '/trust-lifecycle/certificate-profiles' },
          { label: 'Certificate templates', route: '/trust-lifecycle/certificate-templates' },
          { label: 'Alerts', route: '/trust-lifecycle/alerts' },
          { label: 'Rules', route: '/trust-lifecycle/rules' },
        ],
      },
      {
        title: 'DISCOVERY & AUTOMATION',
        items: [
          { label: 'Agents', route: '/trust-lifecycle/agents' },
          { label: 'Sensors', route: '/trust-lifecycle/sensors' },
          { label: 'Network scans', route: '/trust-lifecycle/network-scans' },
          { label: 'Scripts', route: '/trust-lifecycle/scripts' },
        ],
      },
      {
        title: 'INTEGRATIONS',
        items: [
          { label: 'Connectors', route: '/trust-lifecycle/connectors' },
          { label: 'Client tools', route: '/trust-lifecycle/client-tools' },
        ],
      },
      {
        title: 'CONFIGURATION',
        items: [
          { label: 'Product settings', route: '/trust-lifecycle/product-settings' },
          { label: 'Business units', route: '/trust-lifecycle/business-units' },
          { label: 'Seats', route: '/trust-lifecycle/seats' },
        ],
      },
    ],
  },

  'private-ca': {
    id: 'private-ca',
    label: 'Private CA',
    route: '/private-ca',
    ariaLabel: 'Private CA navigation',
    sections: [
      {
        title: 'MANAGE CAS',
        defaultExpanded: true,
        items: [
          { label: 'Roots', route: '/private-ca/roots' },
          { label: 'Intermediates', route: '/private-ca/intermediates' },
          { label: 'Certificate hierarchy', route: '/private-ca/certificate-hierarchy' },
        ],
      },
      {
        title: '',
        items: [
          { label: 'End-entity certificates', route: '/private-ca/end-entity-certificates', numberBadge: 8 },
        ],
      },
      {
        title: 'POLICIES',
        items: [
          { label: 'Certificate templates', route: '/private-ca/certificate-templates' },
          { label: 'Certificate profiles', route: '/private-ca/certificate-profiles' },
        ],
      },
      {
        title: 'REVOCATION & VALIDATION',
        items: [
          { label: 'CRLs', route: '/private-ca/crls' },
          { label: 'OCSPs', route: '/private-ca/ocsps' },
          { label: 'AIAs', route: '/private-ca/aias' },
        ],
      },
      {
        title: 'HSMS',
        badge: true,
        items: [
          { label: 'Registered partitions', route: '/private-ca/registered-partitions' },
          { label: 'Master escrow keys', route: '/private-ca/master-escrow-keys' },
          { label: 'HSM providers', route: '/private-ca/hsm-providers' },
          { label: 'Connectivity', route: '/private-ca/connectivity' },
        ],
      },
      {
        title: '',
        items: [
          { label: 'Audit logs', route: '/private-ca/audit-logs' },
        ],
      },
      {
        title: 'CONFIGURATION',
        items: [
          { label: 'Product settings', route: '/private-ca/product-settings' },
          { label: 'Accounts', route: '/private-ca/accounts' },
        ],
      },
    ],
  },

  'software-trust': {
    id: 'software-trust',
    label: 'Software Trust',
    route: '/software-trust',
    ariaLabel: 'Software Trust navigation',
    sections: [
      {
        title: 'OVERVIEW',
        defaultExpanded: true,
        items: [
          { label: 'Dashboard', route: '/software-trust/dashboard' },
          { label: 'Alerts', route: '/software-trust/alerts' },
          { label: 'Reports', route: '/software-trust/reports' },
          { label: 'Audit logs', route: '/software-trust/audit-logs' },
          { label: 'Signature logs', route: '/software-trust/signature-logs' },
        ],
      },
      {
        title: 'RELEASE SECURITY',
        badge: true,
        items: [
          { label: 'Repositories', route: '/software-trust/repositories' },
          { label: 'Github releases', route: '/software-trust/github-releases' },
          { label: 'Threat scanning', route: '/software-trust/threat-scanning', badge: true },
          { label: 'SBOM & CBOM insights', route: '/software-trust/sbom-cbom-insights' },
        ],
      },
      {
        title: 'SIGNING',
        items: [
          { label: 'Keypairs', route: '/software-trust/keypairs' },
          { label: 'Key rotations', route: '/software-trust/key-rotations' },
          { label: 'Keypair profiles', route: '/software-trust/keypair-profiles' },
          { label: 'GPG Keypairs', route: '/software-trust/gpg-keypairs' },
          { label: 'Certificates', route: '/software-trust/certificates' },
          { label: 'Certificate profiles', route: '/software-trust/certificate-profiles' },
          { label: 'CertCentral orders', route: '/software-trust/certcentral-orders' },
          { label: 'Signature controls', route: '/software-trust/signature-controls' },
        ],
      },
      {
        title: 'INTEGRATIONS',
        items: [
          { label: 'Connectors', route: '/software-trust/connectors' },
          { label: 'Client tools', route: '/software-trust/client-tools' },
        ],
      },
      {
        title: 'CONFIGURATIONS',
        items: [
          { label: 'Product settings', route: '/software-trust/product-settings' },
          { label: 'Trust anchor certificates', route: '/software-trust/trust-anchor-certificates' },
          { label: 'Certificate templates', route: '/software-trust/certificate-templates' },
          { label: 'Projects', route: '/software-trust/projects' },
          { label: 'Teams', route: '/software-trust/teams' },
          { label: 'User groups', route: '/software-trust/user-groups' },
        ],
      },
    ],
  },

  dns: {
    id: 'dns',
    label: 'DigiCert DNS',
    route: '/dns',
    ariaLabel: 'DigiCert DNS navigation',
    sections: [
      {
        title: 'OVERVIEW',
        defaultExpanded: true,
        items: [
          { label: 'Dashboard', route: '/dns/dashboard' },
          { label: 'Alerts', route: '/dns/alerts' },
          { label: 'Reports', route: '/dns/reports' },
          { label: 'Analytics', route: '/dns/analytics' },
          { label: 'Audit logs', route: '/dns/audit-logs' },
        ],
      },
      {
        title: 'DNS',
        items: [
          { label: 'Zones', route: '/dns/zones' },
          { label: 'Web forwards', route: '/dns/web-forwards' },
          { label: 'Multi-CDN', route: '/dns/multi-cdn' },
          { label: 'Traffic management', route: '/dns/traffic-management' },
        ],
      },
      {
        title: '',
        items: [
          { label: 'Monitoring', route: '/dns/monitoring' },
        ],
      },
      {
        title: '',
        items: [
          { label: 'Integrations', route: '/dns/integrations' },
        ],
      },
      {
        title: 'CONFIGURATION',
        items: [
          { label: 'Product settings', route: '/dns/product-settings' },
          { label: 'Access management', route: '/dns/access-management' },
        ],
      },
      {
        title: '',
        items: [
          { label: 'Tasks', route: '/dns/tasks' },
        ],
      },
    ],
  },

  'content-trust': {
    id: 'content-trust',
    label: 'Content Trust',
    route: '/content-trust',
    ariaLabel: 'Content Trust navigation',
    sections: [
      {
        title: 'OVERVIEW',
        defaultExpanded: true,
        items: [
          { label: 'Dashboard', route: '/content-trust/dashboard' },
          { label: 'Reports', route: '/content-trust/reports' },
          { label: 'Audit logs', route: '/content-trust/audit-logs' },
        ],
      },
      {
        title: 'MEDIA',
        items: [
          { label: 'Signing', route: '/content-trust/media-signing' },
          { label: 'Verification', route: '/content-trust/verification' },
          { label: 'User certificates', route: '/content-trust/user-certificates' },
        ],
      },
      {
        title: 'DOCUMENT',
        items: [
          { label: 'Signing', route: '/content-trust/document-signing' },
          { label: 'Signup links', route: '/content-trust/signup-links' },
          { label: 'All credentials', route: '/content-trust/all-credentials' },
          { label: 'User credentials', route: '/content-trust/user-credentials' },
          { label: 'Bulk credentials', route: '/content-trust/bulk-credentials' },
        ],
      },
      {
        title: '',
        items: [
          { label: 'Client tools', route: '/content-trust/client-tools' },
        ],
      },
    ],
  },

  'device-trust': {
    id: 'device-trust',
    label: 'Device Trust',
    route: '/device-trust',
    ariaLabel: 'Device Trust navigation',
    sections: [
      {
        title: 'OVERVIEW',
        defaultExpanded: true,
        items: [
          { label: 'Dashboard', route: '/device-trust/dashboard' },
          { label: 'Alerts', route: '/device-trust/alerts' },
          { label: 'Reports', route: '/device-trust/reports' },
          { label: 'Audit logs', route: '/device-trust/audit-logs' },
        ],
      },
      {
        title: 'DEVICE MANAGEMENT',
        items: [
          { label: 'Devices', route: '/device-trust/devices' },
          { label: 'Device group', route: '/device-trust/device-group' },
          { label: 'Cloud platform policies', route: '/device-trust/cloud-platform-policies' },
        ],
      },
      {
        title: 'CERTIFICATE MANAGEMENT',
        items: [
          { label: 'Certificates', route: '/device-trust/certificates' },
          { label: 'Certificate settings', route: '/device-trust/certificate-settings' },
          { label: 'Issuing CAs', route: '/device-trust/issuing-cas' },
          { label: 'Trust bundle', route: '/device-trust/trust-bundle' },
          { label: 'Registered values', route: '/device-trust/registered-values' },
          { label: 'OSCP groups', route: '/device-trust/oscp-groups' },
        ],
      },
      {
        title: 'AUTHENTICATION MANAGEMENT',
        items: [
          { label: 'Authentication policies', route: '/device-trust/authentication-policies' },
          { label: 'Authentication certificates', route: '/device-trust/authentication-certificates' },
          { label: 'ACME credentials', route: '/device-trust/acme-credentials' },
          { label: 'Passcodes', route: '/device-trust/passcodes' },
          { label: 'Authentication CAs', route: '/device-trust/authentication-cas' },
        ],
      },
      {
        title: 'SOFTWARE UPDATES',
        items: [
          { label: 'Artifacts', route: '/device-trust/artifacts' },
          { label: 'Releases', route: '/device-trust/releases' },
          { label: 'Deployments', route: '/device-trust/deployments' },
        ],
      },
      {
        title: '',
        items: [
          { label: 'Jobs', route: '/device-trust/jobs' },
        ],
      },
      {
        title: 'INTEGRATIONS',
        items: [
          { label: 'Connectors', route: '/device-trust/connectors' },
          { label: 'Digicert Gateways', route: '/device-trust/digicert-gateways' },
        ],
      },
      {
        title: '',
        items: [
          { label: 'Divisions', route: '/device-trust/divisions' },
        ],
      },
      {
        title: '',
        items: [
          { label: 'Blueprints', route: '/device-trust/blueprints' },
        ],
      },
    ],
  },

  /* ai-agents and valimail are "explore" products — see exploreProducts above; they render an ExplorePage, not a spoke nav. */

  'settings-users': {
    id: 'settings-users',
    label: 'User management',
    route: '/settings/users',
    ariaLabel: 'User management navigation',
    sections: [
      {
        title: '',
        defaultExpanded: true,
        items: [
          { label: 'Users', route: '/settings/users' },
          { label: 'Groups', route: '/settings/users/groups' },
        ],
      },
    ],
  },

  'settings-billing': {
    id: 'settings-billing',
    label: 'Billing',
    route: '/settings/billing',
    ariaLabel: 'Billing navigation',
    sections: [
      {
        title: '',
        defaultExpanded: true,
        items: [
          { label: 'My subscriptions', route: '/settings/billing' },
          { label: 'Receipts', route: '/settings/billing/receipts' },
          { label: 'Payment details', route: '/settings/billing/payment-details' },
        ],
      },
    ],
  },

  'settings-account': {
    id: 'settings-account',
    label: 'Account settings',
    route: '/settings/account',
    ariaLabel: 'Account settings navigation',
    sections: [
      {
        title: '',
        defaultExpanded: true,
        items: [
          { label: 'Identity and access', route: '/settings/account' },
          { label: 'Audit logs', route: '/settings/account/audit-logs' },
          { label: 'Organizations', route: '/organizations.html', external: true },
        ],
      },
    ],
  },

  'settings-product': {
    id: 'settings-product',
    label: 'Product settings',
    route: '/settings/product',
    ariaLabel: 'Product settings navigation',
    sections: [
      {
        title: '',
        defaultExpanded: true,
        items: [
          { label: 'Product settings', route: '/settings/product' },
        ],
      },
    ],
  },

  'settings-integrations': {
    id: 'settings-integrations',
    label: 'Integrations',
    route: '/settings/integrations',
    ariaLabel: 'Integrations navigation',
    sections: [
      {
        title: '',
        defaultExpanded: true,
        items: [
          { label: 'Integrations', route: '/settings/integrations' },
        ],
      },
    ],
  },

  'settings-api': {
    id: 'settings-api',
    label: 'API access',
    route: '/settings/api',
    ariaLabel: 'API access navigation',
    sections: [
      {
        title: '',
        defaultExpanded: true,
        items: [
          { label: 'API access', route: '/settings/api' },
        ],
      },
    ],
  },

  'settings-audit-logs': {
    id: 'settings-audit-logs',
    label: 'Audit logs',
    route: '/settings/audit-logs',
    ariaLabel: 'Audit logs navigation',
    sections: [
      {
        title: '',
        defaultExpanded: true,
        items: [
          { label: 'Audit logs', route: '/settings/audit-logs' },
        ],
      },
    ],
  },

  profile: {
    id: 'profile',
    label: 'My profile',
    route: '/profile',
    ariaLabel: 'Profile navigation',
    sections: [
      {
        title: '',
        defaultExpanded: true,
        items: [
          { label: 'Overview', route: '/profile' },
          { label: 'Access', route: '/profile/access' },
          { label: 'Access credentials', route: '/profile/access-credentials' },
        ],
      },
    ],
  },
};

/**
 * Returns the route to navigate to when a product icon is clicked.
 * For products with a spoke nav, returns the first item's route. For
 * explore products (no nav config), falls back to the product root.
 */
export function getProductLandingRoute(productId: string): string {
  const nav = productNavConfig[productId];
  if (!nav) return `/${productId}`;
  const firstItem = nav.sections[0]?.items[0];
  return firstItem?.route ?? nav.route;
}

/** Maps the second path segment of a /settings/* route to its spoke product id. */
const settingsRouteProductIds: Record<string, string> = {
  users: 'settings-users',
  billing: 'settings-billing',
  account: 'settings-account',
  product: 'settings-product',
  integrations: 'settings-integrations',
  api: 'settings-api',
  'audit-logs': 'settings-audit-logs',
};

/**
 * Resolves which product owns a given route so the left nav can stay in sync
 * with the URL no matter how navigation was triggered (icon rail, breadcrumb,
 * footer link, deep link). Returns null when no product owns the route, in
 * which case callers should leave the active product unchanged.
 */
export function getProductIdForRoute(pathname: string): string | null {
  const [top, sub] = pathname.split('/').filter(Boolean);
  if (!top) return null;
  if (top === 'settings') return settingsRouteProductIds[sub] ?? null;
  if (top === 'profile') return 'profile';
  if (productNavConfig[top]) return top;
  if (exploreProductIds.has(top)) return top;
  return null;
}

export interface Crumb {
  label: string;
  route?: string;
}

/**
 * Walks productNavConfig to find the product + item that matches a pathname.
 * Used to drive page titles and breadcrumbs from the same source as the nav.
 */
export function findItemByRoute(
  pathname: string,
): { product: ProductNav; item: NavItem } | null {
  for (const product of Object.values(productNavConfig)) {
    for (const section of product.sections) {
      for (const item of section.items) {
        if (item.route === pathname) return { product, item };
      }
    }
  }
  return null;
}

export function getBreadcrumbs(pathname: string): Crumb[] {
  const match = findItemByRoute(pathname);
  if (!match) return [];
  return [
    { label: match.product.label, route: getProductLandingRoute(match.product.id) },
    { label: match.item.label },
  ];
}
