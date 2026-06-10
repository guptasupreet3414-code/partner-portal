import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faArrowUpRightFromSquare,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import { currentPlan, getProductLandingRoute } from '../data/navConfig';

const PageWrapper = styled.main`
  max-width: 1120px;
  margin: 0 auto;
`;

/* ─── Breadcrumbs ─────────────────────────────────────────────────────── */

const Breadcrumbs = styled.nav`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral600};
  margin: 0 0 16px;

  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }

  li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  a {
    color: ${({ theme }) => theme.colors.neutral600};
    text-decoration: none;
    border-radius: 2px;

    &:hover {
      color: ${({ theme }) => theme.colors.neutral900};
      text-decoration: underline;
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.blue300};
      outline-offset: 2px;
    }
  }

  [aria-current='page'] {
    color: ${({ theme }) => theme.colors.neutral900};
  }
`;

const Separator = styled.span`
  color: ${({ theme }) => theme.colors.neutral400};
  user-select: none;
`;

/* ─── Header ──────────────────────────────────────────────────────────── */

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 24px;
  margin-bottom: 32px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
`;

const LogoBox = styled.span`
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: 6px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.colors.neutral800};
`;

const ProductTitle = styled.h1`
  flex: 1;
  min-width: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PrimaryButton = styled.button`
  height: 40px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #1976D2;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #1565C0;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.neutral700};
  font-size: 16px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral50};
    border-color: ${({ theme }) => theme.colors.neutral400};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

/* ─── Seats card ──────────────────────────────────────────────────────── */

const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 40px;
`;

const CardHeader = styled.div`
  padding: 16px 20px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
`;

const SeatsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const SeatsHeadCell = styled.th`
  padding: 12px 20px;
  background: #F1F4F7;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral700};
  text-align: center;

  &:first-child {
    text-align: left;
  }
`;

const SeatsCell = styled.td`
  padding: 18px 20px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral800};
  text-align: center;

  &:first-child {
    text-align: left;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.neutral900};
  }

  &:last-child {
    text-align: right;
  }
`;

const LinkButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  color: #1976D2;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

/* ─── Plan comparison ─────────────────────────────────────────────────── */

const CompareScroll = styled.div`
  overflow-x: auto;
`;

const CompareTable = styled.table`
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  font-family: ${({ theme }) => theme.typography.fontFamily};

  th,
  td {
    border: 1px solid ${({ theme }) => theme.colors.neutral200};
  }
`;

/* Empty top-left cell — no border so it reads as blank space. */
const CornerCell = styled.th`
  width: 28%;
  border: none !important;
  background: transparent;
`;

const PlanHeadCell = styled.th`
  width: 24%;
  padding: 24px 20px 28px;
  vertical-align: top;
  text-align: center;
  background: ${({ theme }) => theme.colors.white};
`;

const PlanName = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  margin-bottom: 10px;
`;

const PlanTagline = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.neutral700};
  margin-bottom: 24px;
`;

const CurrentPlan = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.neutral800};

  & > svg {
    color: ${({ theme }) => theme.colors.success};
    font-size: 14px;
  }
`;

const TalkToSales = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  padding: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 600;
  color: #1976D2;
  cursor: pointer;

  & > svg {
    font-size: 12px;
  }

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

const FeatureLabelCell = styled.th`
  padding: 16px 20px;
  text-align: left;
  vertical-align: top;
  background: ${({ theme }) => theme.colors.white};
  font-weight: 400;
`;

const FeatureTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
  margin-bottom: 4px;
`;

const FeatureDesc = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.neutral700};
  line-height: 1.45;
`;

const PlanCell = styled.td`
  padding: 16px 20px;
  text-align: center;
  vertical-align: middle;
  background: #F9FAFB;
`;

const Dot = styled.span`
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #353535;
`;

interface PlanHeader {
  name: string;
  tagline: string;
  current: boolean;
}

const PLAN_HEADERS: PlanHeader[] = [
  { name: 'Essentials', tagline: 'Get started with core features.', current: true },
  { name: 'Advanced', tagline: 'Unlock extra tools and options.', current: false },
  { name: 'Premium', tagline: 'The complete experience.', current: false },
];

interface Feature {
  title: string;
  description: string;
  /** Inclusion per tier — order matches PLAN_HEADERS: [Essentials, Advanced, Premium] */
  tiers: [boolean, boolean, boolean];
}

const FEATURES: Feature[] = [
  {
    title: 'Core discovery and imports',
    description: 'Build your inventory with cloud scans, CT logs, APIs, or CSV imports.',
    tiers: [true, true, true],
  },
  {
    title: 'Manage DigiCert certificates',
    description: 'Issue and manage public or private DigiCert certificates.',
    tiers: [true, true, true],
  },
  {
    title: 'Monitoring and notifications',
    description: 'Track your assets using tags, alerts, and custom reporting.',
    tiers: [true, true, true],
  },
  {
    title: 'Core automation',
    description: 'Automate certificates via ACME, SCEP, Windows autoenrollment, or APIs.',
    tiers: [true, true, true],
  },
  {
    title: 'Internal discovery scans',
    description: 'Expand your inventory with internal system and network scans.',
    tiers: [false, true, true],
  },
  {
    title: 'Manage 3rd-party certificates',
    description: 'Manage certificates from DigiCert and 3rd-party CAs in one platform.',
    tiers: [false, true, true],
  },
  {
    title: 'Fully managed automation',
    description: 'Centralized automation across all systems plus AI-powered insights.',
    tiers: [false, true, true],
  },
  {
    title: 'Enterprise integrations',
    description: 'Integrate with Kubernetes, Intune, ServiceNow, or PAM.',
    tiers: [false, false, true],
  },
  {
    title: 'Post-quantum cryptography',
    description: 'Future-proof your systems with PQC readiness and migration tools.',
    tiers: [false, false, true],
  },
  {
    title: 'Dedicated support',
    description: 'Get dedicated support with a service-level agreement (SLA).',
    tiers: [false, false, true],
  },
];

export const BillingPage: React.FC = () => {
  const navigate = useNavigate();

  const purchased = currentPlan.seatsTotal;
  const used = currentPlan.seatsUsed;
  const remaining = purchased - used;

  useEffect(() => {
    document.title = 'Trust Lifecycle billing — DigiCert ONE';
  }, []);

  return (
    <PageWrapper>
      <Breadcrumbs aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to="/settings/billing">My subscriptions</Link>
            <Separator aria-hidden="true">/</Separator>
          </li>
          <li>
            <span aria-current="page">Trust Lifecycle</span>
          </li>
        </ol>
      </Breadcrumbs>

      <Header>
        <LogoBox aria-hidden="true">TL</LogoBox>
        <ProductTitle>Trust Lifecycle</ProductTitle>
        <HeaderActions>
          <PrimaryButton
            type="button"
            onClick={() => navigate(getProductLandingRoute('trust-lifecycle'))}
          >
            Open Trust Lifecycle
          </PrimaryButton>
          <IconButton type="button" aria-label="More actions" aria-haspopup="menu">
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </IconButton>
        </HeaderActions>
      </Header>

      <Card aria-labelledby="seats-heading">
        <CardHeader id="seats-heading">Seats</CardHeader>
        <SeatsTable>
          <thead>
            <tr>
              <SeatsHeadCell scope="col"><span className="sr-only">Item</span></SeatsHeadCell>
              <SeatsHeadCell scope="col">Purchased</SeatsHeadCell>
              <SeatsHeadCell scope="col">Used</SeatsHeadCell>
              <SeatsHeadCell scope="col">Remaining</SeatsHeadCell>
              <SeatsHeadCell scope="col"><span className="sr-only">Actions</span></SeatsHeadCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <SeatsCell>Seats</SeatsCell>
              <SeatsCell>{purchased}</SeatsCell>
              <SeatsCell>{used}</SeatsCell>
              <SeatsCell>{remaining}</SeatsCell>
              <SeatsCell>
                <LinkButton type="button" onClick={() => navigate('/trust-lifecycle/plan')}>
                  Add seats
                </LinkButton>
              </SeatsCell>
            </tr>
          </tbody>
        </SeatsTable>
      </Card>

      <CompareScroll>
        <CompareTable aria-label="Trust Lifecycle plan comparison">
          <thead>
            <tr>
              <CornerCell aria-hidden="true" />
              {PLAN_HEADERS.map(plan => (
                <PlanHeadCell key={plan.name} scope="col">
                  <PlanName>{plan.name}</PlanName>
                  <PlanTagline>{plan.tagline}</PlanTagline>
                  {plan.current ? (
                    <CurrentPlan>
                      <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
                      Current plan
                    </CurrentPlan>
                  ) : (
                    <TalkToSales type="button" onClick={() => console.log(`Talk to sales: ${plan.name}`)}>
                      Talk to sales
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
                    </TalkToSales>
                  )}
                </PlanHeadCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURES.map(feature => (
              <tr key={feature.title}>
                <FeatureLabelCell scope="row">
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDesc>{feature.description}</FeatureDesc>
                </FeatureLabelCell>
                {feature.tiers.map((included, i) => (
                  <PlanCell key={PLAN_HEADERS[i].name}>
                    {included ? (
                      <>
                        <Dot aria-hidden="true" />
                        <span className="sr-only">Included in {PLAN_HEADERS[i].name}</span>
                      </>
                    ) : (
                      <span className="sr-only">Not included in {PLAN_HEADERS[i].name}</span>
                    )}
                  </PlanCell>
                ))}
              </tr>
            ))}
          </tbody>
        </CompareTable>
      </CompareScroll>
    </PageWrapper>
  );
};
