import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck, faCircle, faArrowRight, faArrowLeft,
  faBuilding, faUser, faLayerGroup, faChartBar, faShield, faClipboardCheck,
} from '@fortawesome/free-solid-svg-icons';

/* ── Onboarding steps ────────────────────────────────────────────── */

type StepId = 'details' | 'admin' | 'services' | 'entitlements' | 'auth' | 'review';

interface Step {
  id: StepId;
  label: string;
  icon: typeof faBuilding;
  description: string;
}

const steps: Step[] = [
  { id: 'details', label: 'Customer details', icon: faBuilding, description: 'Basic information about the managed account.' },
  { id: 'admin', label: 'Add administrator', icon: faUser, description: 'Invite the primary admin for this customer.' },
  { id: 'services', label: 'Enable services', icon: faLayerGroup, description: 'Select which DigiCert services to activate.' },
  { id: 'entitlements', label: 'Allocate entitlements', icon: faChartBar, description: 'Set initial entitlement limits for each enabled service.' },
  { id: 'auth', label: 'Authentication', icon: faShield, description: 'Configure SSO or password policy for this customer.' },
  { id: 'review', label: 'Review & create', icon: faClipboardCheck, description: 'Confirm all settings before provisioning.' },
];

const availableServices = [
  { id: 'certcentral', label: 'CertCentral', description: 'Public certificate lifecycle management.' },
  { id: 'trust-lifecycle', label: 'Trust Lifecycle', description: 'End-to-end digital trust automation.' },
  { id: 'private-ca', label: 'Private CA', description: 'Internal PKI and private certificate authorities.' },
  { id: 'software-trust', label: 'Software Trust', description: 'Code signing and software supply chain security.' },
  { id: 'device-trust', label: 'Device Trust', description: 'IoT and device identity management.' },
  { id: 'dns', label: 'DigiCert DNS', description: 'DNS management and DCV automation.' },
];

/* ── Styled components ───────────────────────────────────────────── */

const PageWrapper = styled.main``;

const PageHeader = styled.div`
  margin-bottom: 28px;
`;

const BackBtn = styled.button`
  display: inline-flex; align-items: center; gap: 5px;
  padding: 0; border: none; background: transparent;
  color: ${({ theme }) => theme.colors.blue300};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; cursor: pointer; margin-bottom: 16px;
  &:hover { text-decoration: underline; }
`;

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

/* Progress stepper */

const Stepper = styled.div`
  display: flex; align-items: flex-start; gap: 0;
  margin-bottom: 32px; overflow-x: auto; padding-bottom: 4px;
`;

const StepItem = styled.div<{ $state: 'completed' | 'active' | 'pending' }>`
  display: flex; flex-direction: column; align-items: center;
  flex: 1; min-width: 80px; position: relative;
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 14px; left: 50%; right: -50%;
    height: 2px;
    background: ${({ $state }) =>
      $state === 'completed' ? '#0174C3' : '#E7EBEF'};
  }
`;

const StepCircle = styled.div<{ $state: 'completed' | 'active' | 'pending' }>`
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; margin-bottom: 8px; z-index: 1;
  background: ${({ $state }) =>
    $state === 'completed' ? '#0174C3' :
    $state === 'active' ? '#0174C3' : '#E7EBEF'};
  color: ${({ $state }) =>
    $state === 'pending' ? '#A0AAB0' : 'white'};
  border: ${({ $state }) =>
    $state === 'active' ? '3px solid #EDF6FC' : 'none'};
  outline: ${({ $state }) =>
    $state === 'active' ? '2px solid #0174C3' : 'none'};
`;

const StepLabel = styled.div<{ $state: 'completed' | 'active' | 'pending' }>`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px; text-align: center; line-height: 1.3;
  font-weight: ${({ $state }) => $state === 'active' ? '600' : '400'};
  color: ${({ $state, theme }) =>
    $state === 'pending' ? theme.colors.neutral400 :
    $state === 'active' ? theme.colors.blue300 :
    theme.colors.neutral700};
`;

/* Form card */

const FormCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.white};
  overflow: hidden;
  max-width: 680px;
`;

const FormHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  background: ${({ theme }) => theme.colors.neutral50};
`;

const FormTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 16px; font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900}; margin: 0 0 4px;
`;

const FormDesc = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; color: ${({ theme }) => theme.colors.neutral500};
  margin: 0;
`;

const FormBody = styled.div`
  padding: 24px;
`;

const FieldGroup = styled.div`
  margin-bottom: 20px;
`;

const FieldLabel = styled.label`
  display: block;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; font-weight: 500; color: ${({ theme }) => theme.colors.neutral700};
  margin-bottom: 7px;
`;

const FieldInput = styled.input`
  width: 100%; padding: 9px 12px;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; color: ${({ theme }) => theme.colors.neutral900};
  outline: none; box-sizing: border-box;
  &:focus { border-color: ${({ theme }) => theme.colors.blue300}; }
`;

const FieldSelect = styled.select`
  width: 100%; padding: 9px 12px;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; color: ${({ theme }) => theme.colors.neutral900};
  background: ${({ theme }) => theme.colors.white};
  outline: none; box-sizing: border-box;
  &:focus { border-color: ${({ theme }) => theme.colors.blue300}; }
`;

const FieldRow = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

/* Service toggle cards */

const ServiceGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  @media (max-width: 550px) { grid-template-columns: 1fr; }
`;

const ServiceToggle = styled.button<{ $enabled: boolean }>`
  display: flex; align-items: flex-start; gap: 10px;
  padding: 12px 14px;
  border: 1px solid ${({ $enabled, theme }) => $enabled ? theme.colors.blue300 : theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $enabled }) => $enabled ? '#EEF6FF' : 'white'};
  cursor: pointer; text-align: left;
  transition: all 0.15s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.blue300};
    background: #F5F9FF;
  }
`;

const ServiceToggleCheck = styled.div<{ $enabled: boolean }>`
  width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; margin-top: 1px;
  border: 2px solid ${({ $enabled, theme }) => $enabled ? theme.colors.blue300 : theme.colors.neutral300};
  background: ${({ $enabled, theme }) => $enabled ? theme.colors.blue300 : 'transparent'};
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 9px;
`;

const ServiceToggleText = styled.div``;
const ServiceToggleName = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; font-weight: 500; color: ${({ theme }) => theme.colors.neutral900};
  margin-bottom: 2px;
`;
const ServiceToggleDesc = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px; color: ${({ theme }) => theme.colors.neutral500};
`;

/* Auth options */

const AuthOptionList = styled.div`
  display: flex; flex-direction: column; gap: 10px;
`;

const AuthOption = styled.label<{ $selected: boolean }>`
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px;
  border: 1px solid ${({ $selected, theme }) => $selected ? theme.colors.blue300 : theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $selected }) => $selected ? '#EEF6FF' : 'white'};
  cursor: pointer;
`;

const AuthRadio = styled.input`accent-color: #0174C3;`;
const AuthLabel = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;
const AuthLabelName = styled.div`
  font-size: 13px; font-weight: 500; color: ${({ theme }) => theme.colors.neutral900};
`;
const AuthLabelDesc = styled.div`
  font-size: 12px; color: ${({ theme }) => theme.colors.neutral500};
`;

/* Review checklist */

const ReviewList = styled.div`
  display: flex; flex-direction: column; gap: 0;
`;

const ReviewItem = styled.div`
  display: flex; align-items: flex-start; gap: 12px;
  padding: 14px 0; border-bottom: 1px solid ${({ theme }) => theme.colors.neutral100};
  &:last-child { border-bottom: none; }
`;

const ReviewIcon = styled.div`
  color: #27A872; font-size: 16px; flex-shrink: 0; margin-top: 2px;
`;

const ReviewText = styled.div``;
const ReviewLabel = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px; font-weight: 500; color: ${({ theme }) => theme.colors.neutral900};
  margin-bottom: 3px;
`;
const ReviewValue = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px; color: ${({ theme }) => theme.colors.neutral500};
`;

/* Form footer */

const FormFooter = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral200};
  gap: 12px;
`;

const FooterLeft = styled.div``;

const PrevBtn = styled.button`
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 18px;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: white; color: ${({ theme }) => theme.colors.neutral700};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px; cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  &:hover { background: ${({ theme }) => theme.colors.neutral100}; }
`;

const NextBtn = styled.button`
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 22px;
  background: ${({ theme }) => theme.colors.blue300};
  color: white; border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px; font-weight: 500; cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  &:hover { background: ${({ theme }) => theme.colors.blue500}; }
`;

/* ── Component ───────────────────────────────────────────────────── */

export const CustomerOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState<string[]>(['certcentral']);
  const [authMethod, setAuthMethod] = useState<string>('password');

  useEffect(() => {
    document.title = 'Add customer — Partner workspace — DigiCert ONE';
  }, []);

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (isLast) {
      navigate('/partner/customers');
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const getStepState = (idx: number): 'completed' | 'active' | 'pending' => {
    if (idx < currentStep) return 'completed';
    if (idx === currentStep) return 'active';
    return 'pending';
  };

  const enabledSvcLabels = availableServices
    .filter(s => selectedServices.includes(s.id))
    .map(s => s.label)
    .join(', ') || 'None selected';

  return (
    <PageWrapper>
      <PageHeader>
        <BackBtn onClick={() => navigate('/partner/customers')}>
          ← Customers
        </BackBtn>
        <PageTitle>Add customer</PageTitle>
        <PageSubtitle>Set up a new managed account in your partner organization.</PageSubtitle>
      </PageHeader>

      <Stepper>
        {steps.map((s, idx) => {
          const state = getStepState(idx);
          return (
            <StepItem key={s.id} $state={state}>
              <StepCircle $state={state}>
                {state === 'completed'
                  ? <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 14 }} />
                  : <FontAwesomeIcon icon={s.icon} style={{ fontSize: 12 }} />
                }
              </StepCircle>
              <StepLabel $state={state}>{s.label}</StepLabel>
            </StepItem>
          );
        })}
      </Stepper>

      <FormCard>
        <FormHeader>
          <FormTitle>{step.label}</FormTitle>
          <FormDesc>{step.description}</FormDesc>
        </FormHeader>

        <FormBody>
          {/* Step 1: Customer details */}
          {step.id === 'details' && (
            <>
              <FieldRow>
                <FieldGroup>
                  <FieldLabel htmlFor="cust-name">Company name *</FieldLabel>
                  <FieldInput id="cust-name" placeholder="e.g. Acme Corporation" />
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel htmlFor="cust-industry">Industry</FieldLabel>
                  <FieldSelect id="cust-industry">
                    <option value="">Select industry</option>
                    <option>Financial services</option>
                    <option>Healthcare</option>
                    <option>Manufacturing</option>
                    <option>Technology / Software</option>
                    <option>Energy</option>
                    <option>Retail</option>
                    <option>Government</option>
                    <option>Other</option>
                  </FieldSelect>
                </FieldGroup>
              </FieldRow>
              <FieldRow>
                <FieldGroup>
                  <FieldLabel htmlFor="cust-region">Region</FieldLabel>
                  <FieldSelect id="cust-region">
                    <option value="">Select region</option>
                    <option>North America</option>
                    <option>Europe</option>
                    <option>Asia Pacific</option>
                    <option>Latin America</option>
                    <option>Middle East &amp; Africa</option>
                  </FieldSelect>
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel htmlFor="cust-tier">Account tier</FieldLabel>
                  <FieldSelect id="cust-tier">
                    <option>Business</option>
                    <option>Enterprise</option>
                    <option>Strategic</option>
                  </FieldSelect>
                </FieldGroup>
              </FieldRow>
              <FieldGroup>
                <FieldLabel htmlFor="cust-division">Assign to division</FieldLabel>
                <FieldSelect id="cust-division">
                  <option value="">No division</option>
                  <option>North America</option>
                  <option>Europe</option>
                </FieldSelect>
              </FieldGroup>
            </>
          )}

          {/* Step 2: Administrator */}
          {step.id === 'admin' && (
            <>
              <FieldGroup>
                <FieldLabel htmlFor="admin-email">Administrator email address *</FieldLabel>
                <FieldInput id="admin-email" type="email" placeholder="admin@customerdomain.com" />
              </FieldGroup>
              <FieldRow>
                <FieldGroup>
                  <FieldLabel htmlFor="admin-fname">First name</FieldLabel>
                  <FieldInput id="admin-fname" placeholder="First name" />
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel htmlFor="admin-lname">Last name</FieldLabel>
                  <FieldInput id="admin-lname" placeholder="Last name" />
                </FieldGroup>
              </FieldRow>
              <FieldGroup>
                <FieldLabel htmlFor="admin-role">Role</FieldLabel>
                <FieldSelect id="admin-role">
                  <option>Account Administrator</option>
                  <option>Service Administrator</option>
                </FieldSelect>
              </FieldGroup>
            </>
          )}

          {/* Step 3: Services */}
          {step.id === 'services' && (
            <ServiceGrid>
              {availableServices.map(svc => {
                const enabled = selectedServices.includes(svc.id);
                return (
                  <ServiceToggle
                    key={svc.id}
                    $enabled={enabled}
                    onClick={() => toggleService(svc.id)}
                  >
                    <ServiceToggleCheck $enabled={enabled}>
                      {enabled && <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 10 }} />}
                    </ServiceToggleCheck>
                    <ServiceToggleText>
                      <ServiceToggleName>{svc.label}</ServiceToggleName>
                      <ServiceToggleDesc>{svc.description}</ServiceToggleDesc>
                    </ServiceToggleText>
                  </ServiceToggle>
                );
              })}
            </ServiceGrid>
          )}

          {/* Step 4: Entitlements */}
          {step.id === 'entitlements' && (
            <>
              {selectedServices.length === 0 ? (
                <div style={{ color: '#A0AAB0', fontSize: 13, padding: '8px 0' }}>
                  No services selected. Go back and enable at least one service.
                </div>
              ) : (
                selectedServices.map(svcId => {
                  const svc = availableServices.find(s => s.id === svcId);
                  return (
                    <FieldGroup key={svcId}>
                      <FieldLabel>{svc?.label} — initial allocation</FieldLabel>
                      <FieldRow>
                        {svcId === 'certcentral' && (
                          <>
                            <FieldGroup style={{ margin: 0 }}>
                              <FieldLabel htmlFor={`ent-${svcId}-certs`} style={{ fontSize: 12, fontWeight: 400, color: '#636A6E' }}>
                                SSL/TLS certificates
                              </FieldLabel>
                              <FieldInput id={`ent-${svcId}-certs`} type="number" placeholder="e.g. 500" defaultValue={500} />
                            </FieldGroup>
                          </>
                        )}
                        {svcId === 'trust-lifecycle' && (
                          <>
                            <FieldGroup style={{ margin: 0 }}>
                              <FieldLabel style={{ fontSize: 12, fontWeight: 400, color: '#636A6E' }}>Seats</FieldLabel>
                              <FieldInput type="number" placeholder="e.g. 50" defaultValue={50} />
                            </FieldGroup>
                          </>
                        )}
                        {svcId === 'private-ca' && (
                          <>
                            <FieldGroup style={{ margin: 0 }}>
                              <FieldLabel style={{ fontSize: 12, fontWeight: 400, color: '#636A6E' }}>Private roots</FieldLabel>
                              <FieldInput type="number" placeholder="e.g. 2" defaultValue={2} />
                            </FieldGroup>
                          </>
                        )}
                        {!['certcentral','trust-lifecycle','private-ca'].includes(svcId) && (
                          <FieldGroup style={{ margin: 0 }}>
                            <FieldLabel style={{ fontSize: 12, fontWeight: 400, color: '#636A6E' }}>Units</FieldLabel>
                            <FieldInput type="number" placeholder="e.g. 100" defaultValue={100} />
                          </FieldGroup>
                        )}
                      </FieldRow>
                    </FieldGroup>
                  );
                })
              )}
            </>
          )}

          {/* Step 5: Auth */}
          {step.id === 'auth' && (
            <AuthOptionList>
              {[
                { id: 'password', name: 'Email and password', desc: 'Customer users sign in with their DigiCert ONE username and password.' },
                { id: 'sso', name: 'Single sign-on (SSO)', desc: 'Connect the customer\'s SAML identity provider.' },
                { id: 'mfa', name: 'Multi-factor authentication', desc: 'Require email and password plus a second factor (TOTP or push).' },
              ].map(opt => (
                <AuthOption key={opt.id} $selected={authMethod === opt.id}>
                  <AuthRadio
                    type="radio"
                    name="auth"
                    value={opt.id}
                    checked={authMethod === opt.id}
                    onChange={() => setAuthMethod(opt.id)}
                  />
                  <AuthLabel>
                    <AuthLabelName>{opt.name}</AuthLabelName>
                    <AuthLabelDesc>{opt.desc}</AuthLabelDesc>
                  </AuthLabel>
                </AuthOption>
              ))}
            </AuthOptionList>
          )}

          {/* Step 6: Review */}
          {step.id === 'review' && (
            <ReviewList>
              <ReviewItem>
                <ReviewIcon><FontAwesomeIcon icon={faCircleCheck} /></ReviewIcon>
                <ReviewText>
                  <ReviewLabel>Customer details</ReviewLabel>
                  <ReviewValue>Company name, industry, region, and account tier configured</ReviewValue>
                </ReviewText>
              </ReviewItem>
              <ReviewItem>
                <ReviewIcon><FontAwesomeIcon icon={faCircleCheck} /></ReviewIcon>
                <ReviewText>
                  <ReviewLabel>Administrator</ReviewLabel>
                  <ReviewValue>Invitation will be sent to the provided email address</ReviewValue>
                </ReviewText>
              </ReviewItem>
              <ReviewItem>
                <ReviewIcon><FontAwesomeIcon icon={faCircleCheck} /></ReviewIcon>
                <ReviewText>
                  <ReviewLabel>Services</ReviewLabel>
                  <ReviewValue>{enabledSvcLabels}</ReviewValue>
                </ReviewText>
              </ReviewItem>
              <ReviewItem>
                <ReviewIcon><FontAwesomeIcon icon={faCircleCheck} /></ReviewIcon>
                <ReviewText>
                  <ReviewLabel>Entitlements</ReviewLabel>
                  <ReviewValue>Initial allocations set for {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''}</ReviewValue>
                </ReviewText>
              </ReviewItem>
              <ReviewItem>
                <ReviewIcon><FontAwesomeIcon icon={faCircleCheck} /></ReviewIcon>
                <ReviewText>
                  <ReviewLabel>Authentication</ReviewLabel>
                  <ReviewValue>{authMethod === 'password' ? 'Email and password' : authMethod === 'sso' ? 'Single sign-on (SSO)' : 'Multi-factor authentication'}</ReviewValue>
                </ReviewText>
              </ReviewItem>
            </ReviewList>
          )}
        </FormBody>

        <FormFooter>
          <FooterLeft>
            {!isFirst && (
              <PrevBtn onClick={() => setCurrentStep(prev => prev - 1)}>
                <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: 12 }} />
                Back
              </PrevBtn>
            )}
          </FooterLeft>
          <NextBtn onClick={handleNext}>
            {isLast ? 'Create customer' : 'Continue'}
            {!isLast && <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 12 }} />}
          </NextBtn>
        </FormFooter>
      </FormCard>
    </PageWrapper>
  );
};
