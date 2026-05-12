import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const PageWrapper = styled.main`
  padding: 24px;
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 24px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0 0 8px;
`;

const PageSubtitle = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral600};
  margin: 0;
`;

const routeLabels: Record<string, string> = {
  '/': 'Home',

  // Dashboard
  '/dashboard': 'Value dashboard',
  '/dashboard/clients-tools': 'Client tools insights',

  // Quantum Central
  '/quantum-central': 'Quantum Central',
  '/quantum-central/dashboard': 'Dashboard',
  '/quantum-central/settings': 'Settings',

  // CertCentral
  '/certcentral': 'CertCentral',
  '/certcentral/dashboard': 'Dashboard',
  '/certcentral/reports': 'Reports',
  '/certcentral/audit-logs': 'Audit logs',
  '/certcentral/inventory': 'Inventory',
  '/certcentral/trust-store': 'Trust store',
  '/certcentral/certificate-profiles': 'Certificate profiles',
  '/certcentral/certificate-templates': 'Certificate templates',
  '/certcentral/alert-rules': 'Alert rules',
  '/certcentral/workflow-rules': 'Workflow rules',
  '/certcentral/agents': 'Agents',
  '/certcentral/sensors': 'Sensors',
  '/certcentral/network-scans': 'Network scans',
  '/certcentral/scripts': 'Scripts',
  '/certcentral/connectors': 'Connectors',
  '/certcentral/client-tools': 'Client tools',
  '/certcentral/product-settings': 'Product settings',
  '/certcentral/alert-destinations': 'Alert destinations',
  '/certcentral/business-units': 'Business units',
  '/certcentral/seats': 'Seats',

  // Trust Lifecycle
  '/trust-lifecycle': 'Trust Lifecycle',
  '/trust-lifecycle/dashboard': 'Dashboard',
  '/trust-lifecycle/alerts': 'Alerts',
  '/trust-lifecycle/reports': 'Reports',
  '/trust-lifecycle/audit-logs': 'Audit logs',
  '/trust-lifecycle/releases': 'Releases',
  '/trust-lifecycle/threat-scanning': 'Threat scanning',
  '/trust-lifecycle/keypairs': 'Keypairs',
  '/trust-lifecycle/key-rotations': 'Key rotations',
  '/trust-lifecycle/keypair-profiles': 'Keypair profiles',
  '/trust-lifecycle/gpg-keypairs': 'GPG keypairs',
  '/trust-lifecycle/certificates': 'Certificates',
  '/trust-lifecycle/certificate-profiles': 'Certificate profiles',
  '/trust-lifecycle/certcentral-orders': 'CertCentral orders',
  '/trust-lifecycle/connectors': 'Connectors',
  '/trust-lifecycle/tools': 'Tools',
  '/trust-lifecycle/product-settings': 'Product settings',
  '/trust-lifecycle/projects': 'Projects',
  '/trust-lifecycle/teams': 'Teams',
  '/trust-lifecycle/user-groups': 'User groups',

  // Private CA
  '/private-ca': 'Private CA',
  '/private-ca/dashboard': 'Dashboard',
  '/private-ca/audit-logs': 'Audit logs',
  '/private-ca/roots': 'Roots',
  '/private-ca/intermediates': 'Intermediates',
  '/private-ca/hierarchy': 'Hierarchy',
  '/private-ca/end-entity-certificates': 'End-entity certificates',
  '/private-ca/certificate-profiles': 'Certificate profiles',
  '/private-ca/certificate-templates': 'Certificate templates',
  '/private-ca/crls': 'CRLs',
  '/private-ca/ocsps': 'OCSPs',
  '/private-ca/aias': 'AIAs',
  '/private-ca/registered-partitions': 'Registered partitions',
  '/private-ca/master-escrow-keys': 'Master escrow keys',
  '/private-ca/providers': 'Providers',
  '/private-ca/remote-proxy': 'Remote proxy',
  '/private-ca/product-settings': 'Product settings',
  '/private-ca/accounts': 'Accounts',

  // Software Trust
  '/software-trust': 'Software Trust',
  '/software-trust/dashboard': 'Dashboard',
  '/software-trust/alerts': 'Alerts',
  '/software-trust/reports': 'Reports',
  '/software-trust/audit-logs': 'Audit logs',
  '/software-trust/orders': 'Orders',
  '/software-trust/requests': 'Requests',
  '/software-trust/certificates': 'Certificates',
  '/software-trust/domains': 'Domains',
  '/software-trust/organizations': 'Organizations',
  '/software-trust/certificate-authority': 'Certificate authority',
  '/software-trust/discovery-dashboard': 'Discovery dashboard',
  '/software-trust/view-results': 'View results',
  '/software-trust/manage-discovery': 'Manage discovery',
  '/software-trust/automate-now': 'Automate now!',
  '/software-trust/manage-automation': 'Manage automation',
  '/software-trust/manage-profiles': 'Manage profiles',
  '/software-trust/automated-ips': 'Automated IPs',
  '/software-trust/automation-plus': 'Automation plus',
  '/software-trust/subaccounts': 'Subaccounts',
  '/software-trust/subaccounts-orders': 'Orders',
  '/software-trust/api-keys': 'API keys',
  '/software-trust/acme-directory-urls': 'ACME directory URLs',
  '/software-trust/webhooks': 'Webhooks',
  '/software-trust/ultra-dns': 'Integrate with Ultra DNS',
  '/software-trust/ssl-installation-tool': 'SSL installation tool',
  '/software-trust/certificate-utility': 'Certificate utility',
  '/software-trust/csr-generator': 'CSR generator',
  '/software-trust/preferences': 'Preferences',
  '/software-trust/product-settings': 'Product settings',
  '/software-trust/custom-order-fields': 'Custom order fields',
  '/software-trust/security-settings': 'Security settings',
  '/software-trust/users': 'Users',
  '/software-trust/service-users': 'Service users',
  '/software-trust/divisions': 'Divisions',
  '/software-trust/guest-access': 'Guest access',
  '/software-trust/user-invitations': 'User invitations',

  // DNS Trust
  '/dns': 'DNS Trust',
  '/dns/dashboard': 'Dashboard',
  '/dns/settings': 'Settings',

  // Content Trust
  '/content-trust': 'Content Trust',
  '/content-trust/dashboard': 'Dashboard',
  '/content-trust/settings': 'Settings',

  // Device Trust
  '/device-trust': 'Device Trust',
  '/device-trust/dashboard': 'Dashboard',
  '/device-trust/settings': 'Settings',

  // AI Agents
  '/ai-agents': 'AI Agents',
  '/ai-agents/dashboard': 'Dashboard',
  '/ai-agents/settings': 'Settings',

  // Valimail
  '/valimail': 'Valimail',
  '/valimail/dashboard': 'Dashboard',
  '/valimail/settings': 'Settings',

  // Settings
  '/settings': 'Settings',
  '/settings/users': 'Users',
  '/settings/users/groups': 'Groups',
  '/settings/billing': 'My subscriptions',
  '/settings/billing/receipts': 'Receipts',
  '/settings/billing/payment-details': 'Payment details',
  '/settings/account': 'Account settings',
  '/settings/product': 'Product settings',
  '/settings/integrations': 'Integrations',
  '/settings/api': 'API access',
  '/settings/audit-logs': 'Audit logs',

  // Profile
  '/profile': 'My profile',
};

export const StubPage: React.FC = () => {
  const location = useLocation();
  const label = routeLabels[location.pathname] ?? location.pathname;

  useEffect(() => {
    document.title = `${label} — DigiCert ONE`;
  }, [label]);

  return (
    <PageWrapper>
      <PageTitle>{label}</PageTitle>
      {location.pathname === '/profile' && (
        <PageSubtitle style={{ marginBottom: '8px', fontWeight: 500, color: '#353535' }}>
          Deepika Chauhan
        </PageSubtitle>
      )}
      <PageSubtitle>This is a stub page for <code>{location.pathname}</code></PageSubtitle>
    </PageWrapper>
  );
};
