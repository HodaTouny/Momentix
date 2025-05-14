import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import Button from '../common/Button';
import { useTranslation } from 'react-i18next';

const ConfirmModal = ({
  show,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.'
}) => {
  const { currentTheme } = useDarkMode();
  const { t } = useTranslation();

  const translatedTitle = t(title);
  const translatedMessage = t(message);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="modal-backdrop"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: currentTheme.cardBackground,
          padding: '2rem',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '400px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          color: currentTheme.textPrimary,
          textAlign: 'center'
        }}
      >
        <h4 style={{ marginBottom: '1rem' }}>{translatedTitle}</h4>
        <p style={{ marginBottom: '2rem', color: currentTheme.textSecondary }}>
          {translatedMessage}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Button variant="danger" onClick={onConfirm}>
            {t('Confirm')}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            {t('Cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
