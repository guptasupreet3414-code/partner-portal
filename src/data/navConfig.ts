export interface NavItem {
  label: string;
  route: string;
}

export interface NavSection {
  title: string;
  defaultExpanded?: boolean;
  items: NavItem[];
}

export interface ProductNav {
  id: string;
  label: string;
  route: string;
  ariaLabel: string;
  sections: NavSection[];
}

export interface IconRailProduct {
  id: string;
  label: string;
  route: string;
  ariaLabel: string;
  iconType: string;
}

export const iconRailGroup1: IconRailProduct[] = [
  { id: 'dashboard', label: 'Dashboard', route: '/dashboard', ariaLabel: 'Dashboard', iconType: 'dashboard' },
  { id: 'quantum-central', label: 'Quantum Central', route: '/quantum-central', ariaLabel: 'Quantum Central', iconType: 'settings' },
  { id: 'certcentral', label: 'CertCentral', route: '/certcentral', ariaLabel: 'CertCentral', iconType: 'shield' },
  { id: 'private-ca', label: 'Private CA', route: '/private-ca', ariaLabel: 'Private CA', iconType: 'hierarchy' },
  { id: 'trust-lifecycle', label: 'Trust Lifecycle', route: '/trust-lifecycle', ariaLabel: 'Trust Lifecycle', iconType: 'cycle' },
  { id: 'software-trust', label: 'Software Trust', route: '/software-trust', ariaLabel: 'Software Trust', iconType: 'code' },
];

export const iconRailGroup2: IconRailProduct[] = [
  { id: 'dns', label: 'DNS', route: '/dns', ariaLabel: 'DNS Trust', iconType: 'globe' },
  { id: 'content-trust', label: 'Content Trust', route: '/content-trust', ariaLabel: 'Content Trust', iconType: 'document' },
  { id: 'device-trust', label: 'Device Trust', route: '/device-trust', ariaLabel: 'Device Trust', iconType: 'mobile' },
  { id: 'ai-agents', label: 'AI Agents', route: '/ai-agents', ariaLabel: 'AI Agents', iconType: 'sparkle' },
  { id: 'valimail', label: 'Valimail', route: '/valimail', ariaLabel: 'Valimail', iconType: 'envelope' },
];

const stubNav = (id: string): NavSection[] => [
  {
    title: 'OVERVIEW',
    defaultExpanded: true,
    items: [
      { label: 'Dashboard', route: `/${id}/dashboard` },
      { label: 'Settings', route: `/${id}/settings` },
    ],
  },
];

export const productNavConfig: Record<string, ProductNav> = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    route: '/dashboard',
    ariaLabel: 'Dashboard navigation',
    sections: [
      {
        title: '',
        defaultExpanded: true,
        items: [
          { label: 'Value dashboard', route: '/dashboard' },
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
        title: 'OVERVIEW',
        defaultExpanded: true,
        items: [
          { label: 'Dashboard', route: '/quantum-central/dashboard' },
          { label: 'Settings', route: '/quantum-central/settings' },
        ],
      },
    ],
  },

  certcentral: {
    id: 'certcentral',
    label: 'CertCentral',
    route: '/certcentral',
    ariaLabel: 'CertCentral navigation',
    sections: [
      {
        title: 'OVERVIEW',
        defaultExpanded: true,
        items: [
          { label: 'Dashboard', route: '/certcentral/dashboard' },
          { label: 'Reports', route: '/certcentral/reports' },
          { label: 'Audit logs', route: '/certcentral/audit-logs' },
        ],
      },
      {
        title: 'INVENTORY',
        items: [
          { label: 'Inventory', route: '/certcentral/inventory' },
          { label: 'Trust store', route: '/certcentral/trust-store' },
        ],
      },
      {
        title: 'POLICIES',
        items: [
          { label: 'Certificate profiles', route: '/certcentral/certificate-profiles' },
          { label: 'Certificate templates', route: '/certcentral/certificate-templates' },
          { label: 'Alert rules', route: '/certcentral/alert-rules' },
          { label: 'Workflow rules', route: '/certcentral/workflow-rules' },
        ],
      },
      {
        title: 'AUTOMATION',
        items: [
          { label: 'Agents', route: '/certcentral/agents' },
          { label: 'Sensors', route: '/certcentral/sensors' },
          { label: 'Network scans', route: '/certcentral/network-scans' },
          { label: 'Scripts', route: '/certcentral/scripts' },
        ],
      },
      {
        title: 'INTEGRATIONS',
        items: [
          { label: 'Connectors', route: '/certcentral/connectors' },
          { label: 'Client tools', route: '/certcentral/client-tools' },
        ],
      },
      {
        title: 'CONFIGURATION',
        items: [
          { label: 'Product settings', route: '/certcentral/product-settings' },
          { label: 'Alert destinations', route: '/certcentral/alert-destinations' },
          { label: 'Business units', route: '/certcentral/business-units' },
          { label: 'Seats', route: '/certcentral/seats' },
        ],
      },
    ],
  },

  'trust-lifecycle': {
    id: 'trust-lifecycle',
    label: 'Trust Lifecycle',
    route: '/trust-lifecycle',
    ariaLabel: 'Trust Lifecycle navigation',
    sections: [
      {
        title: 'OVERVIEW',
        defaultExpanded: true,
        items: [
          { label: 'Dashboard', route: '/trust-lifecycle/dashboard' },
          { label: 'Alerts', route: '/trust-lifecycle/alerts' },
          { label: 'Reports', route: '/trust-lifecycle/reports' },
          { label: 'Audit logs', route: '/trust-lifecycle/audit-logs' },
        ],
      },
      {
        title: 'RELEASE SECURITY',
        items: [
          { label: 'Releases', route: '/trust-lifecycle/releases' },
          { label: 'Threat scanning', route: '/trust-lifecycle/threat-scanning' },
        ],
      },
      {
        title: 'SIGNING',
        items: [
          { label: 'Keypairs', route: '/trust-lifecycle/keypairs' },
          { label: 'Key rotations', route: '/trust-lifecycle/key-rotations' },
          { label: 'Keypair profiles', route: '/trust-lifecycle/keypair-profiles' },
          { label: 'GPG keypairs', route: '/trust-lifecycle/gpg-keypairs' },
          { label: 'Certificates', route: '/trust-lifecycle/certificates' },
          { label: 'Certificate profiles', route: '/trust-lifecycle/certificate-profiles' },
          { label: 'CertCentral orders', route: '/trust-lifecycle/certcentral-orders' },
        ],
      },
      {
        title: 'INTEGRATIONS',
        items: [
          { label: 'Connectors', route: '/trust-lifecycle/connectors' },
          { label: 'Tools', route: '/trust-lifecycle/tools' },
        ],
      },
      {
        title: 'CONFIGURATION',
        items: [
          { label: 'Product settings', route: '/trust-lifecycle/product-settings' },
          { label: 'Projects', route: '/trust-lifecycle/projects' },
          { label: 'Teams', route: '/trust-lifecycle/teams' },
          { label: 'User groups', route: '/trust-lifecycle/user-groups' },
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
        title: 'OVERVIEW',
        defaultExpanded: true,
        items: [
          { label: 'Dashboard', route: '/private-ca/dashboard' },
          { label: 'Audit logs', route: '/private-ca/audit-logs' },
        ],
      },
      {
        title: 'MANAGE CA',
        items: [
          { label: 'Roots', route: '/private-ca/roots' },
          { label: 'Intermediates', route: '/private-ca/intermediates' },
          { label: 'Hierarchy', route: '/private-ca/hierarchy' },
          { label: 'End-entity certificates', route: '/private-ca/end-entity-certificates' },
        ],
      },
      {
        title: 'POLICIES',
        items: [
          { label: 'Certificate profiles', route: '/private-ca/certificate-profiles' },
          { label: 'Certificate templates', route: '/private-ca/certificate-templates' },
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
        title: 'HSM',
        items: [
          { label: 'Registered partitions', route: '/private-ca/registered-partitions' },
          { label: 'Master escrow keys', route: '/private-ca/master-escrow-keys' },
          { label: 'Providers', route: '/private-ca/providers' },
          { label: 'Remote proxy', route: '/private-ca/remote-proxy' },
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
        ],
      },
      {
        title: 'CERTIFICATES',
        items: [
          { label: 'Orders', route: '/software-trust/orders' },
          { label: 'Requests', route: '/software-trust/requests' },
          { label: 'Certificates', route: '/software-trust/certificates' },
          { label: 'Domains', route: '/software-trust/domains' },
          { label: 'Organizations', route: '/software-trust/organizations' },
          { label: 'Certificate authority', route: '/software-trust/certificate-authority' },
        ],
      },
      {
        title: 'DISCOVERY',
        items: [
          { label: 'Discovery dashboard', route: '/software-trust/discovery-dashboard' },
          { label: 'View results', route: '/software-trust/view-results' },
          { label: 'Manage discovery', route: '/software-trust/manage-discovery' },
        ],
      },
      {
        title: 'AUTOMATION',
        items: [
          { label: 'Automate now!', route: '/software-trust/automate-now' },
          { label: 'Manage automation', route: '/software-trust/manage-automation' },
          { label: 'Manage profiles', route: '/software-trust/manage-profiles' },
          { label: 'Automated IPs', route: '/software-trust/automated-ips' },
          { label: 'Automation plus', route: '/software-trust/automation-plus' },
        ],
      },
      {
        title: 'SUBACCOUNTS',
        items: [
          { label: 'Subaccounts', route: '/software-trust/subaccounts' },
          { label: 'Orders', route: '/software-trust/subaccounts-orders' },
        ],
      },
      {
        title: 'INTEGRATIONS',
        items: [
          { label: 'API keys', route: '/software-trust/api-keys' },
          { label: 'ACME directory URLs', route: '/software-trust/acme-directory-urls' },
          { label: 'Webhooks', route: '/software-trust/webhooks' },
          { label: 'Integrate with Ultra DNS', route: '/software-trust/ultra-dns' },
        ],
      },
      {
        title: 'TOOLS',
        items: [
          { label: 'SSL installation tool', route: '/software-trust/ssl-installation-tool' },
          { label: 'Certificate utility', route: '/software-trust/certificate-utility' },
          { label: 'CSR generator', route: '/software-trust/csr-generator' },
        ],
      },
      {
        title: 'PRODUCT SETTINGS',
        items: [
          { label: 'Preferences', route: '/software-trust/preferences' },
          { label: 'Product settings', route: '/software-trust/product-settings' },
          { label: 'Custom order fields', route: '/software-trust/custom-order-fields' },
          { label: 'Security settings', route: '/software-trust/security-settings' },
        ],
      },
      {
        title: 'USER MANAGEMENT',
        items: [
          { label: 'Users', route: '/software-trust/users' },
          { label: 'Service users', route: '/software-trust/service-users' },
          { label: 'Divisions', route: '/software-trust/divisions' },
          { label: 'Guest access', route: '/software-trust/guest-access' },
          { label: 'User invitations', route: '/software-trust/user-invitations' },
        ],
      },
    ],
  },

  dns: {
    id: 'dns',
    label: 'DNS',
    route: '/dns',
    ariaLabel: 'DNS Trust navigation',
    sections: stubNav('dns'),
  },

  'content-trust': {
    id: 'content-trust',
    label: 'Content Trust',
    route: '/content-trust',
    ariaLabel: 'Content Trust navigation',
    sections: stubNav('content-trust'),
  },

  'device-trust': {
    id: 'device-trust',
    label: 'Device Trust',
    route: '/device-trust',
    ariaLabel: 'Device Trust navigation',
    sections: stubNav('device-trust'),
  },

  'ai-agents': {
    id: 'ai-agents',
    label: 'AI Agents',
    route: '/ai-agents',
    ariaLabel: 'AI Agents navigation',
    sections: stubNav('ai-agents'),
  },

  valimail: {
    id: 'valimail',
    label: 'Valimail',
    route: '/valimail',
    ariaLabel: 'Valimail navigation',
    sections: stubNav('valimail'),
  },

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
          { label: 'Account settings', route: '/settings/account' },
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
          { label: 'My profile', route: '/profile' },
        ],
      },
    ],
  },
};
