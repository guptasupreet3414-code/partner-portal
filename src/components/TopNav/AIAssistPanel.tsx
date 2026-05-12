import React, { useEffect } from 'react';
import {
  AIAssistPanelEl,
  AIHeader,
  AITitle,
  AICloseBtn,
  AIBody,
  AIPromptText,
  AIInputRow,
  AIInput,
  AISendBtn,
} from './AIAssistPanel.styles';

interface AIAssistPanelProps {
  open: boolean;
  onClose: () => void;
}

export const AIAssistPanel: React.FC<AIAssistPanelProps> = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <AIAssistPanelEl
      $open={open}
      role="complementary"
      aria-label="AI Assist panel"
      aria-hidden={!open}
    >
      <AIHeader>
        <AITitle>AI Assist</AITitle>
        <AICloseBtn onClick={onClose} aria-label="Close AI Assist">×</AICloseBtn>
      </AIHeader>
      <AIBody>
        <AIPromptText>How can I help you today?</AIPromptText>
        <AIInputRow>
          <AIInput
            type="text"
            placeholder="Ask anything..."
            aria-label="Ask AI Assist"
          />
          <AISendBtn onClick={() => console.log('AI Assist send')}>Send</AISendBtn>
        </AIInputRow>
      </AIBody>
    </AIAssistPanelEl>
  );
};
