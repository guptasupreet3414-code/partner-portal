import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

/* ── Hierarchy data ────────────────────────────────────────────────── */

const HIERARCHY = {
  label: 'ABC Security',
  divisions: [
    {
      id: 'na',
      label: 'North America',
      customers: [
        { id: 'acme-corp', label: 'Acme Corp' },
        { id: 'contoso',   label: 'Contoso Ltd.' },
        { id: 'initech',   label: 'Initech' },
      ],
    },
    {
      id: 'eu',
      label: 'Europe',
      customers: [
        { id: 'globex',   label: 'Globex Corporation' },
        { id: 'umbrella', label: 'Umbrella Inc.' },
      ],
    },
  ],
};

/* ── Inline text highlight ─────────────────────────────────────────── */

function HighlightMatch({ text, search }: { text: string; search: string }) {
  if (!search) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(search.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <MatchSpan>{text.slice(idx, idx + search.length)}</MatchSpan>
      {text.slice(idx + search.length)}
    </>
  );
}

/* ── Styled components ─────────────────────────────────────────────── */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 1500;
`;

const Drawer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 440px;
  max-width: 95vw;
  background: ${({ theme }) => theme.colors.white};
  border-left: 1px solid ${({ theme }) => theme.colors.neutral200};
  z-index: 1501;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  flex-shrink: 0;
`;

const DrawerTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
  margin: 0;
`;

const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral500};
  font-size: 18px;
  border-radius: 6px;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.neutral100}; }
`;

const DrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 32px;
`;

const DrawerDesc = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral500};
  margin: 0 0 18px;
  line-height: 1.5;
`;

const SearchWrap = styled.div`
  position: relative;
  margin-bottom: 28px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 9px 36px 9px 12px;
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral900};
  background: ${({ theme }) => theme.colors.white};
  box-sizing: border-box;
  outline: none;
  &::placeholder { color: ${({ theme }) => theme.colors.neutral400}; }
  &:focus {
    border-color: ${({ theme }) => theme.colors.blue300};
    box-shadow: 0 0 0 2px rgba(1, 116, 195, 0.12);
  }
`;

const ClearBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral400};
  font-size: 18px;
  line-height: 1;
  padding: 2px;
  &:hover { color: ${({ theme }) => theme.colors.neutral700}; }
`;

/* ── Tree ──────────────────────────────────────────────────────────── */

const Tree = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

/* Root ─────────────────────────────────── */

const RootRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 0 0;
`;

const RootIcon = styled.span`
  font-size: 20px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
  line-height: 1;
`;

const RootLabel = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral900};
`;

/*
 * Trunk: left border = the vertical line connecting root → divisions.
 * margin-left = half the root icon width (12px) to sit under the icon's centre.
 */
const Trunk = styled.div`
  margin-left: 12px;
  border-left: 1.5px solid ${({ theme }) => theme.colors.neutral300};
  padding-left: 20px;
  padding-top: 6px;
  padding-bottom: 6px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* Division ─────────────────────────────── */

const DivisionGroup = styled.div``;

const DivisionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  position: relative;

  /* horizontal arm from trunk border to folder icon */
  &::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 50%;
    width: 16px;
    height: 1.5px;
    background: ${({ theme }) => theme.colors.neutral300};
  }
`;

const DivisionIcon = styled.span`
  font-size: 16px;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
  line-height: 1;
`;

const DivisionLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: ${({ theme }) => theme.colors.neutral700};
`;

/*
 * SubTrunk: left border = vertical line connecting division → its customers.
 * margin-left = icon half-width to stay under the folder icon centre.
 */
const SubTrunk = styled.div`
  margin-left: 10px;
  border-left: 1.5px solid ${({ theme }) => theme.colors.neutral200};
  padding-left: 18px;
  padding-top: 4px;
  padding-bottom: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

/* Customer ─────────────────────────────── */

const CustomerRow = styled.div<{ $highlighted: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px 7px 6px;
  border-radius: 6px;
  cursor: pointer;
  background: ${({ $highlighted }) => $highlighted ? '#EDF6FC' : 'transparent'};
  position: relative;
  scroll-margin: 80px;
  transition: background 0.12s;

  /* horizontal arm from sub-trunk border to customer label */
  &::before {
    content: '';
    position: absolute;
    left: -18px;
    top: 50%;
    width: 14px;
    height: 1.5px;
    background: ${({ $highlighted }) => $highlighted ? '#0174C3' : '#E7EBEF'};
    transition: background 0.12s;
  }

  &:hover {
    background: ${({ $highlighted }) => $highlighted ? '#D9EDF8' : '#F9FAFB'};
    &::before { background: ${({ $highlighted }) => $highlighted ? '#0174C3' : '#C5CDD6'}; }
  }
`;

const CustomerDot = styled.span<{ $highlighted: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $highlighted }) => $highlighted ? '#0174C3' : '#C5CDD6'};
  transition: background 0.12s;
`;

const CustomerLabel = styled.span<{ $highlighted: boolean }>`
  font-size: 13px;
  color: ${({ $highlighted, theme }) => $highlighted ? theme.colors.blue300 : theme.colors.neutral800};
  font-weight: ${({ $highlighted }) => $highlighted ? '600' : '400'};
`;

const MatchSpan = styled.mark`
  background: #FEF3C7;
  color: #92400E;
  border-radius: 2px;
  padding: 0 1px;
`;

const NoResults = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral500};
  padding: 20px 0 0;
`;

/* ── Component ─────────────────────────────────────────────────────── */

interface HierarchyDrawerProps {
  onClose: () => void;
  highlightCustomerId?: string;
}

export const HierarchyDrawer: React.FC<HierarchyDrawerProps> = ({
  onClose,
  highlightCustomerId,
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const highlightRef = useRef<HTMLDivElement>(null);
  const searchLower = search.toLowerCase().trim();

  /* Scroll highlighted item into view */
  useEffect(() => {
    const t = setTimeout(() => {
      highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
    return () => clearTimeout(t);
  }, [highlightCustomerId, searchLower]);

  /* Escape closes */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const visibleDivisions = searchLower
    ? HIERARCHY.divisions.filter(d =>
        d.customers.some(c => c.label.toLowerCase().includes(searchLower))
      )
    : HIERARCHY.divisions;

  const noResults = searchLower.length > 0 && visibleDivisions.length === 0;

  let firstHlDone = false;

  return ReactDOM.createPortal(
    <>
      <Overlay onClick={onClose} />
      <Drawer>
        <DrawerHeader>
          <DrawerTitle>Customer hierarchy</DrawerTitle>
          <CloseBtn onClick={onClose} aria-label="Close">✕</CloseBtn>
        </DrawerHeader>

        <DrawerBody>
          <DrawerDesc>
            Understand how managed customers are organized within your Partner structure.
          </DrawerDesc>

          <SearchWrap>
            <SearchInput
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus={!highlightCustomerId}
              aria-label="Search hierarchy"
            />
            {search && (
              <ClearBtn onClick={() => setSearch('')} aria-label="Clear search">×</ClearBtn>
            )}
          </SearchWrap>

          <Tree>
            <RootRow>
              <RootIcon>🏢</RootIcon>
              <RootLabel>{HIERARCHY.label}</RootLabel>
            </RootRow>

            <Trunk>
              {visibleDivisions.map(div => {
                const visibleCustomers = searchLower
                  ? div.customers.filter(c => c.label.toLowerCase().includes(searchLower))
                  : div.customers;

                return (
                  <DivisionGroup key={div.id}>
                    <DivisionRow>
                      <DivisionIcon>📁</DivisionIcon>
                      <DivisionLabel>{div.label}</DivisionLabel>
                    </DivisionRow>

                    <SubTrunk>
                      {visibleCustomers.map(customer => {
                        const isHlById = customer.id === highlightCustomerId;
                        const isHlBySearch = searchLower
                          ? customer.label.toLowerCase().includes(searchLower)
                          : false;
                        const highlighted = isHlById || isHlBySearch;

                        let ref: React.Ref<HTMLDivElement> | undefined;
                        if (highlighted && !firstHlDone) {
                          ref = highlightRef;
                          firstHlDone = true;
                        }

                        return (
                          <CustomerRow
                            key={customer.id}
                            $highlighted={highlighted}
                            ref={ref}
                            onClick={() => {
                              navigate(`/partner/customers/${customer.id}`);
                              onClose();
                            }}
                          >
                            <CustomerDot $highlighted={highlighted} />
                            <CustomerLabel $highlighted={highlighted}>
                              <HighlightMatch text={customer.label} search={search} />
                            </CustomerLabel>
                          </CustomerRow>
                        );
                      })}
                    </SubTrunk>
                  </DivisionGroup>
                );
              })}

              {noResults && (
                <NoResults>No customers match &ldquo;{search}&rdquo;</NoResults>
              )}
            </Trunk>
          </Tree>
        </DrawerBody>
      </Drawer>
    </>,
    document.body
  );
};
