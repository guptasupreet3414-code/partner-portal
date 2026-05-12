import React, { useEffect } from 'react';
import styled from 'styled-components';
import { exploreProducts } from '../data/navConfig';

const PageWrapper = styled.main`
  max-width: 960px;
  margin: 0 auto;
`;

const Eyebrow = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0048AC;
  margin: 0 0 12px;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 32px;
  font-weight: 500;
  line-height: 1.15;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0 0 16px;
`;

const Tagline = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 18px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.neutral700};
  margin: 0 0 40px;
  max-width: 640px;
`;

const FeatureGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin: 0 0 48px;

  @media (max-width: 639px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.article`
  background: #F9FAFB;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 8px;
  padding: 24px;
`;

const FeatureTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0 0 8px;
`;

const FeatureDescription = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.neutral700};
  margin: 0;
`;

const CtaSection = styled.section`
  background: #003E6B;
  border-radius: 8px;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 639px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CtaText = styled.div`
  color: #ffffff;
`;

const CtaHeading = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 4px;
`;

const CtaSubheading = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  margin: 0;
  opacity: 0.85;
`;

const CtaButton = styled.a`
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 24px;
  background: #ffffff;
  color: #003E6B;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.15s;
  flex-shrink: 0;

  &:hover {
    background: #E2EEFF;
  }

  &:focus-visible {
    outline: 2px solid #1297F3;
    outline-offset: 2px;
  }
`;

const NotFound = styled.div`
  padding: 64px 32px;
  text-align: center;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.neutral700};
`;

interface ExplorePageProps {
  productId: string;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ productId }) => {
  const product = exploreProducts[productId];

  useEffect(() => {
    if (product) document.title = `${product.name} — DigiCert ONE`;
  }, [product]);

  if (!product) {
    return <NotFound>Product not found.</NotFound>;
  }

  return (
    <PageWrapper>
      <Eyebrow>Explore</Eyebrow>
      <Title>{product.name}</Title>
      <Tagline>{product.tagline}</Tagline>

      <FeatureGrid aria-label={`${product.name} features`}>
        {product.features.map(feature => (
          <FeatureCard key={feature.title}>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeatureGrid>

      <CtaSection>
        <CtaText>
          <CtaHeading>Interested in {product.name}?</CtaHeading>
          <CtaSubheading>Talk to our sales team to get access and see how it fits your workflow.</CtaSubheading>
        </CtaText>
        <CtaButton href="#" aria-label={`Talk to sales about ${product.name}`}>
          Talk to sales
        </CtaButton>
      </CtaSection>
    </PageWrapper>
  );
};
