import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useWorkspace } from '../context/WorkspaceContext';
import CertcentralIcon from '../assets/certcentral.svg?react';
import TrustLifecycleIcon from '../assets/trust-lifecycle.svg?react';
import PrivateCaIcon from '../assets/private-ca.svg?react';
import DeviceTrustIcon from '../assets/device-trust.svg?react';
import QuantumCentralIcon from '../assets/quantum-central.svg?react';
import AiAgentsIcon from '../assets/ai-agents.svg?react';
import ValimailIcon from '../assets/valimail.svg?react';

const PageWrapper = styled.main``;

const PageHeader = styled.div`
  margin-bottom: 28px;
`;

const Greeting = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 32px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0 0 6px;
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral600};
  margin: 0;
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 20px;
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconWrapper = styled.div`
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const CardTitle = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
  line-height: 1.3;
`;

const CardSubtitle = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral600};
  margin-top: 2px;
`;

const ActionLinks = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ActionLink = styled(Link)`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.blue300};
  text-decoration: none;
  padding: 2px 0;
  display: block;

  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.blue500};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

/* ── Partner workspace card ───────────────────────────────────────── */

const PartnerCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.blue300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 20px;
  background: #F0F6FF;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const PartnerCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HandshakeIconWrap = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.blue300};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const PartnerMetricRow = styled.div`
  display: flex;
  gap: 0;
  border-top: 1px solid rgba(1, 116, 195, 0.2);
  padding-top: 12px;
`;

const PartnerMetric = styled.div`
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  padding-right: 12px;

  &:not(:first-child) {
    padding-left: 12px;
    border-left: 1px solid rgba(1, 116, 195, 0.15);
  }
`;

const PartnerMetricValue = styled.div<{ $color?: string }>`
  font-size: 22px;
  font-weight: 700;
  line-height: 1.1;
  color: ${({ $color, theme }) => $color ?? theme.colors.neutral900};
`;

const PartnerMetricLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.neutral500};
  margin-top: 2px;
  line-height: 1.3;
`;

const PartnerArrowLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.blue300};
  font-size: 13px;
  font-weight: 600;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  text-align: left;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

/* ── Right column promo cards ─────────────────────────────────────── */

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PromoCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.white};
  overflow: hidden;
`;

const PromoImage = styled.div`
  height: 140px;
  background: linear-gradient(135deg, #0A2744 0%, #1976D2 60%, #0D47A1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const PromoImageDecor = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 1px, transparent 1px),
    radial-gradient(circle at 60% 30%, rgba(255,255,255,0.06) 2px, transparent 2px),
    radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 1.5px, transparent 1.5px),
    radial-gradient(circle at 40% 80%, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 40px 40px, 60px 60px, 50px 50px, 45px 45px;
`;

const PromoBody = styled.div`
  padding: 16px;
`;

const PromoCategoryTag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: 100px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.neutral700};
  margin-bottom: 10px;
`;

const PromoAuthor = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral600};
  margin-bottom: 6px;
`;

const PromoTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0 0 8px;
  line-height: 1.4;
`;

const PromoText = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral700};
  margin: 0 0 12px;
  line-height: 1.6;
`;

const PromoLink = styled.a`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue300};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const products = [
  {
    id: 'trust-lifecycle',
    label: 'Trust Lifecycle',
    subtitle: 'Certificate management',
    Icon: TrustLifecycleIcon,
    links: [
      { label: 'Set up alerts', route: '/trust-lifecycle/alerts' },
      { label: 'Discover certificates', route: '/trust-lifecycle/certificates' },
      { label: 'Automate certificate lifecycle', route: '/trust-lifecycle/connectors' },
    ],
  },
  {
    id: 'valimail',
    label: 'Valimail',
    subtitle: 'Email authentication',
    Icon: ValimailIcon,
    links: [
      { label: 'Review DMARC status', route: '/valimail' },
      { label: 'Manage sender sources', route: '/valimail' },
      { label: 'Monitor domains', route: '/valimail' },
      { label: 'Investigate spoofing risks', route: '/valimail' },
    ],
  },
  {
    id: 'quantum-central',
    label: 'Quantum Central',
    subtitle: 'Post-quantum readiness',
    Icon: QuantumCentralIcon,
    links: [
      { label: 'Assess cryptographic risk', route: '/quantum-central' },
      { label: 'Review PQC readiness', route: '/quantum-central' },
      { label: 'View algorithm inventory', route: '/quantum-central' },
      { label: 'Track remediation', route: '/quantum-central' },
    ],
  },
  {
    id: 'ai-agents',
    label: 'AI Agents',
    subtitle: 'AI identity & governance',
    Icon: AiAgentsIcon,
    links: [
      { label: 'Register agents', route: '/ai-agents' },
      { label: 'Manage agent identities', route: '/ai-agents' },
      { label: 'Review agent activity', route: '/ai-agents' },
      { label: 'Configure trust policies', route: '/ai-agents' },
    ],
  },
  {
    id: 'device-trust',
    label: 'Device Trust',
    subtitle: 'IoT device security',
    Icon: DeviceTrustIcon,
    links: [
      { label: 'Register devices', route: '/device-trust/devices' },
      { label: 'Manage device identities', route: '/device-trust/devices' },
      { label: 'Configure device policies', route: '/device-trust' },
      { label: 'Review device lifecycle', route: '/device-trust' },
    ],
  },
  {
    id: 'private-ca',
    label: 'Private CA',
    subtitle: 'Internal PKI',
    Icon: PrivateCaIcon,
    links: [
      { label: 'Issue internal certificate', route: '/private-ca/end-entity-certificates' },
      { label: 'Create issuing CA', route: '/private-ca/intermediates' },
      { label: 'Manage certificate profiles', route: '/private-ca/certificate-profiles' },
      { label: 'Configure OCSP', route: '/private-ca/ocsps' },
    ],
  },
  {
    id: 'certcentral',
    label: 'CertCentral',
    subtitle: 'Public certificates',
    Icon: CertcentralIcon,
    links: [
      { label: 'Order public certificate', route: '/certcentral/request-a-certificate' },
      { label: 'Validate domains', route: '/certcentral/domains' },
      { label: 'Manage organizations', route: '/certcentral/organizations' },
      { label: 'Expiring certificates', route: '/certcentral/expiring-certificates' },
    ],
  },
];

export const DashboardPage: React.FC = () => {
  const { activeWorkspace, setWorkspace } = useWorkspace();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Overview — DigiCert ONE';
  }, []);

  const handleOpenPartner = () => {
    setWorkspace('partner');
    navigate('/partner');
  };

  return (
    <PageWrapper>
      <PageHeader>
        <Greeting>Hello, John</Greeting>
        <Subtitle>Access your DigiCert trust solutions and discover what&apos;s new</Subtitle>
      </PageHeader>

      <TwoColumnLayout>
        <CardGrid>
          {products.map(product => (
            <ProductCard key={product.id}>
              <CardHeader>
                <IconWrapper>
                  <product.Icon aria-hidden="true" focusable="false" />
                </IconWrapper>
                <div>
                  <CardTitle>{product.label}</CardTitle>
                  <CardSubtitle>{product.subtitle}</CardSubtitle>
                </div>
              </CardHeader>
              <ActionLinks>
                {product.links.map(link => (
                  <li key={link.label}>
                    <ActionLink to={link.route}>{link.label}</ActionLink>
                  </li>
                ))}
              </ActionLinks>
            </ProductCard>
          ))}
        </CardGrid>

        <RightColumn>
          {/* Partner workspace card — sits above blog/spotlight */}
          <PartnerCard>
            <PartnerCardHeader>
              <HandshakeIconWrap aria-hidden="true">
                <FontAwesomeIcon icon={faHandshake} style={{ fontSize: 15 }} />
              </HandshakeIconWrap>
              <div>
                <CardTitle>Partner workspace</CardTitle>
                <CardSubtitle>Manage your customer portfolio</CardSubtitle>
              </div>
            </PartnerCardHeader>

            <PartnerMetricRow>
              <PartnerMetric>
                <PartnerMetricValue>{147}</PartnerMetricValue>
                <PartnerMetricLabel>Customers</PartnerMetricLabel>
              </PartnerMetric>
              <PartnerMetric>
                <PartnerMetricValue $color="#D97706">{12}</PartnerMetricValue>
                <PartnerMetricLabel>Need attention</PartnerMetricLabel>
              </PartnerMetric>
              <PartnerMetric>
                <PartnerMetricValue $color="#DC2626">{7}</PartnerMetricValue>
                <PartnerMetricLabel>Entitlement risks</PartnerMetricLabel>
              </PartnerMetric>
            </PartnerMetricRow>

            <PartnerArrowLink
              onClick={handleOpenPartner}
              aria-label="Open Partner workspace"
            >
              {activeWorkspace === 'partner' ? 'Go to Partner workspace' : 'Open Partner workspace'}
              <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 12 }} />
            </PartnerArrowLink>
          </PartnerCard>

          <PromoCard>
            <PromoImage aria-hidden="true">
              <PromoImageDecor />
            </PromoImage>
            <PromoBody>
              <PromoCategoryTag>Certificate Lifecycle</PromoCategoryTag>
              <PromoAuthor>Brian Trzupek · Trust Lifecycle Manager</PromoAuthor>
              <PromoTitle>Certificate lifecycle management reaches an inflection point</PromoTitle>
              <PromoText>
                Cert volumes keep climbing while validity windows keep shrinking. Why teams that scaled on annual renewals are rebuilding for continuous lifecycle operations.
              </PromoText>
              <PromoLink href="#">Read on the blog →</PromoLink>
            </PromoBody>
          </PromoCard>

          <PromoCard>
            <PromoBody>
              <PromoCategoryTag>Software Trust Manager</PromoCategoryTag>
              <PromoTitle>Centralize code-signing at scale</PromoTitle>
              <PromoText>
                Centralize code-signing keys, enforce signing policy, and produce SBOMs across your build pipelines.
              </PromoText>
              <PromoLink href="/software-trust">Explore STM →</PromoLink>
            </PromoBody>
          </PromoCard>
        </RightColumn>
      </TwoColumnLayout>
    </PageWrapper>
  );
};
