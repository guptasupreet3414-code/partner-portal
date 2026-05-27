import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faCircleInfo,
  faPlus,
  faMinus,
  faCartShopping,
  faHeadset,
} from '@fortawesome/free-solid-svg-icons';

const PageWrapper = styled.main`
  max-width: 1120px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin: 0 0 32px;
`;

const Eyebrow = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.blue300};
  margin: 0 0 8px;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 28px;
  font-weight: 500;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0 0 8px;
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 15px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.neutral700};
  margin: 0;
  max-width: 720px;
`;

const PlanGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  align-items: stretch;

  @media (max-width: 1023px) {
    grid-template-columns: 1fr;
  }
`;

const PlanCard = styled.article<{ $highlighted?: boolean }>`
  position: relative;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 8px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  ${({ $highlighted }) =>
    $highlighted &&
    css`
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: #1976D2;
        border-radius: 8px 8px 0 0;
      }
    `}
`;

const TierTag = styled.span<{ $variant: 'gray' | 'blue' | 'gold' }>`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  height: 22px;
  padding: 0 10px;
  border-radius: 4px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 12px;

  ${({ $variant }) => {
    switch ($variant) {
      case 'gray':
        return css`
          background: #EEF1F4;
          color: #44484A;
        `;
      case 'blue':
        return css`
          background: #E2EEFF;
          color: #0048AC;
        `;
      case 'gold':
        return css`
          background: #FCEFC6;
          color: #7A5A00;
        `;
    }
  }}
`;

const PlanName = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0 0 12px;
`;

const PlanDescription = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.neutral700};
  margin: 0 0 20px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral200};
  margin: 4px 0 20px;
`;

const SectionLabel = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0 0 12px;
`;

const SubscribedSeats = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0 0 16px;
`;

const FieldLabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  margin-bottom: 4px;
`;

const FieldHelp = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral700};
  margin: 0 0 8px;
`;

const SeatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const SeatStepper = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: 4px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.white};
`;

const SeatButton = styled.button`
  width: 32px;
  height: 36px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.neutral700};
  cursor: pointer;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral100};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.neutral400};
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: -2px;
  }
`;

const SeatCount = styled.span`
  min-width: 56px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  border-left: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-right: 1px solid ${({ theme }) => theme.colors.neutral300};
`;

const UnitPrice = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral700};
  line-height: 1.4;

  & > strong {
    display: block;
    color: ${({ theme }) => theme.colors.neutral900};
    font-weight: 600;
  }
`;

const AdditionalCostLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral900};
  margin-bottom: 4px;
`;

const PriceBlock = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
`;

const PriceAmount = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 32px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
`;

const PriceUnit = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral700};
`;

const ProratedNote = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral700};
  margin: 0 0 6px;
`;

const SubscriptionNote = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral700};
  margin: 0 0 20px;
`;

const PrimaryButton = styled.button`
  width: 100%;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #1976D2;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  transition: background 0.15s;

  &:hover {
    background: #1565C0;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.white};
  color: #1976D2;
  border: 1px solid #1976D2;
  border-radius: 4px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #E2EEFF;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue300};
    outline-offset: 2px;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.neutral800};
`;

const CheckIcon = styled.span`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.success};
  margin-top: 2px;
`;

const TalkToSalesBlock = styled.div`
  margin-bottom: 20px;
`;

const TalkToSalesTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0 0 6px;
`;

const TalkToSalesBody = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.neutral800};
  margin: 0;
`;

const CardFooterSpace = styled.div`
  margin-top: 24px;
`;

const Highlight = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
`;

const ESSENTIAL_FEATURES: Array<React.ReactNode> = [
  <><Highlight>Build your inventory</Highlight> via cloud discovery scans, CT logs, APIs, or CSV imports</>,
  <>Issue and manage public or private <Highlight>DigiCert certificates</Highlight></>,
  <><Highlight>Monitor assets</Highlight> using tags, alerts, and custom reporting</>,
  <><Highlight>Automate</Highlight> with ACME, SCEP, Windows autoenrollment, or APIs</>,
];

const ADVANCED_FEATURES: Array<React.ReactNode> = [
  <><Highlight>Expand your inventory</Highlight> with internal system and network discovery scans</>,
  <>Manage certificates from <Highlight>DigiCert and third-party CAs</Highlight> in one platform</>,
  <>Access <Highlight>AI-powered insights</Highlight>, analysis, and metadata management</>,
  <><Highlight>Fully managed automation</Highlight> for users, devices, servers, load balancers, appliances, and cloud hyperscalers</>,
];

const PREMIUM_FEATURES: Array<React.ReactNode> = [
  <>Manage certificates for <Highlight>Kubernetes</Highlight> environments</>,
  <>Integrate <Highlight>ServiceNow</Highlight> for notifications and centralized enrollment workflows</>,
  <><Highlight>Distribute trust anchors</Highlight> (roots and CA certificates) across the enterprise</>,
  <>Integrate <Highlight>PAM services</Highlight> to manage credentials and authentication</>,
  <>Future-proof your PKI with <Highlight>post-quantum cryptography (PQC)</Highlight> readiness and migration tools</>,
];

const ADVANCED_REASONS: string[] = [
  'Improved governance across hybrid environments',
  'Increased automation and integration support',
  'More complex certificate management',
];

const PREMIUM_REASONS: string[] = [
  'Organization-level hyperscaler automation',
  'Kubernetes, Intune, ServiceNow and CMP integrations',
  'PQC migration flows',
];

const MIN_SEATS = 25;
const SEAT_UNIT_PRICE = 40;
const BASE_MONTHLY_COST = 83;

export const PlanPage: React.FC = () => {
  const [seats, setSeats] = useState(MIN_SEATS);
  const currentTier = 'Essentials';

  useEffect(() => {
    document.title = 'Trust Lifecycle plans — DigiCert ONE';
  }, []);

  return (
    <PageWrapper>
      <Header>
        <Eyebrow>Trust Lifecycle</Eyebrow>
        <Title>Your plan and upgrade options</Title>
        <Subtitle>
          You are currently on the <Highlight>{currentTier}</Highlight> plan. Add more seats below,
          or talk to sales to upgrade to a higher tier.
        </Subtitle>
      </Header>

      <PlanGrid aria-label="Trust Lifecycle plans">
        {/* ─── Essentials ───────────────────────────────────────────── */}
        <PlanCard aria-labelledby="plan-essentials-name">
          <TierTag $variant="gray">Foundational Trust</TierTag>
          <PlanName id="plan-essentials-name">Essentials</PlanName>
          <PlanDescription>
            Ideal for small to midsize teams managing DigiCert certificates in a unified environment.
          </PlanDescription>

          <Divider />

          <SubscribedSeats>Subscribed seats: {MIN_SEATS}</SubscribedSeats>

          <FieldLabelRow>
            Seats
            <FontAwesomeIcon
              icon={faCircleInfo}
              style={{ fontSize: 12, color: '#757D82' }}
              aria-hidden="true"
            />
          </FieldLabelRow>
          <FieldHelp>Minimum {MIN_SEATS} seats required</FieldHelp>

          <SeatRow>
            <SeatStepper role="group" aria-label="Adjust number of seats">
              <SeatButton
                onClick={() => setSeats(s => Math.max(MIN_SEATS, s - 1))}
                disabled={seats <= MIN_SEATS}
                aria-label="Decrease seats"
              >
                <FontAwesomeIcon icon={faMinus} />
              </SeatButton>
              <SeatCount aria-live="polite" aria-label={`${seats} seats`}>{seats}</SeatCount>
              <SeatButton
                onClick={() => setSeats(s => s + 1)}
                aria-label="Increase seats"
              >
                <FontAwesomeIcon icon={faPlus} />
              </SeatButton>
            </SeatStepper>
            <UnitPrice>
              Unit price
              <strong>${SEAT_UNIT_PRICE.toFixed(2)} per seat</strong>
            </UnitPrice>
          </SeatRow>

          <AdditionalCostLabel>
            Additional cost
            <FontAwesomeIcon
              icon={faCircleInfo}
              style={{ fontSize: 12, color: '#757D82' }}
              aria-hidden="true"
            />
          </AdditionalCostLabel>
          <PriceBlock>
            <PriceAmount>${BASE_MONTHLY_COST}</PriceAmount>
            <PriceUnit>/month</PriceUnit>
          </PriceBlock>
          <ProratedNote>
            <FontAwesomeIcon icon={faCircleInfo} style={{ fontSize: 12, color: '#757D82' }} aria-hidden="true" />
            Prorated adjustment: $XXX until 31 Aug 2026
          </ProratedNote>
          <SubscriptionNote>12 month auto-renewing subscription $XXX</SubscriptionNote>

          <PrimaryButton type="button">
            <FontAwesomeIcon icon={faCartShopping} />
            Add to cart
          </PrimaryButton>

          <SectionLabel>Key features:</SectionLabel>
          <FeatureList>
            {ESSENTIAL_FEATURES.map((node, i) => (
              <FeatureItem key={i}>
                <CheckIcon aria-hidden="true"><FontAwesomeIcon icon={faCheck} /></CheckIcon>
                <span>{node}</span>
              </FeatureItem>
            ))}
          </FeatureList>
        </PlanCard>

        {/* ─── Advanced ─────────────────────────────────────────────── */}
        <PlanCard $highlighted aria-labelledby="plan-advanced-name">
          <TierTag $variant="blue">Most popular</TierTag>
          <PlanName id="plan-advanced-name">Advanced</PlanName>
          <PlanDescription>
            Ideal for teams managing multi-CA environments with complex infrastructure and advanced automation needs.
          </PlanDescription>

          <Divider />

          <SectionLabel>Choose Advanced if your environment requires :</SectionLabel>
          <FeatureList>
            {ADVANCED_REASONS.map(reason => (
              <FeatureItem key={reason}>
                <span aria-hidden="true" style={{ width: 4, flexShrink: 0 }}>•</span>
                <span>{reason}</span>
              </FeatureItem>
            ))}
          </FeatureList>

          <CardFooterSpace />

          <TalkToSalesBlock>
            <TalkToSalesTitle>Talk to sales</TalkToSalesTitle>
            <TalkToSalesBody>
              If your environment requires deeper automation and governance.
            </TalkToSalesBody>
          </TalkToSalesBlock>

          <SecondaryButton type="button">
            <FontAwesomeIcon icon={faHeadset} />
            Contact sales for pricing
          </SecondaryButton>

          <CardFooterSpace />

          <SectionLabel>Everything included in Essential, plus:</SectionLabel>
          <FeatureList>
            {ADVANCED_FEATURES.map((node, i) => (
              <FeatureItem key={i}>
                <CheckIcon aria-hidden="true"><FontAwesomeIcon icon={faCheck} /></CheckIcon>
                <span>{node}</span>
              </FeatureItem>
            ))}
          </FeatureList>
        </PlanCard>

        {/* ─── Premium ──────────────────────────────────────────────── */}
        <PlanCard aria-labelledby="plan-premium-name">
          <TierTag $variant="gold">Ultimate Assurance</TierTag>
          <PlanName id="plan-premium-name">Premium</PlanName>
          <PlanDescription>
            Ideal for enterprises with large-scale infrastructure requiring maximum compliance, integration, and management capabilities.
          </PlanDescription>

          <Divider />

          <SectionLabel>Choose Premium if your environment requires:</SectionLabel>
          <FeatureList>
            {PREMIUM_REASONS.map(reason => (
              <FeatureItem key={reason}>
                <span aria-hidden="true" style={{ width: 4, flexShrink: 0 }}>•</span>
                <span>{reason}</span>
              </FeatureItem>
            ))}
          </FeatureList>

          <CardFooterSpace />

          <TalkToSalesBlock>
            <TalkToSalesTitle>Talk to sales</TalkToSalesTitle>
            <TalkToSalesBody>
              For enterprise automation, PQC readiness, and dedicated support.
            </TalkToSalesBody>
          </TalkToSalesBlock>

          <SecondaryButton type="button">
            <FontAwesomeIcon icon={faHeadset} />
            Contact sales for pricing
          </SecondaryButton>

          <CardFooterSpace />

          <SectionLabel>Everything included in Advanced, plus:</SectionLabel>
          <FeatureList>
            {PREMIUM_FEATURES.map((node, i) => (
              <FeatureItem key={i}>
                <CheckIcon aria-hidden="true"><FontAwesomeIcon icon={faCheck} /></CheckIcon>
                <span>{node}</span>
              </FeatureItem>
            ))}
          </FeatureList>
        </PlanCard>
      </PlanGrid>
    </PageWrapper>
  );
};
