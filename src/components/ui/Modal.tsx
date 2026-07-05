import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string | React.ReactNode;
  description?: string;
  children: React.ReactNode;
  contentStyle?: React.CSSProperties;
  hideCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  children, 
  contentStyle,
  hideCloseButton = false
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay style={overlayStyle} className="animate-fade" />
        <Dialog.Content style={{ ...contentStyleBase, ...contentStyle }} className="animate-scale" aria-describedby={description ? undefined : "dialog-description"}>
          {!description && <Dialog.Description id="dialog-description" style={{ display: 'none' }}>Modal Dialog</Dialog.Description>}
          
          {(title || description) && (
            <div style={headerStyle}>
              {title && <Dialog.Title style={titleStyle}>{title}</Dialog.Title>}
              {description && <Dialog.Description style={descriptionStyle}>{description}</Dialog.Description>}
            </div>
          )}
          
          <div style={bodyStyle}>
            {children}
          </div>

          {!hideCloseButton && (
            <Dialog.Close asChild>
              <button style={closeButtonStyle} aria-label="Close">
                <Cross2Icon width={24} height={24} />
              </button>
            </Dialog.Close>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// Styles
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.65)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
  backdropFilter: 'blur(4px)',
};

const contentStyleBase: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  width: '95%',
  maxWidth: '500px',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  zIndex: 10000,
  outline: 'none',
};

const headerStyle: React.CSSProperties = {
  padding: '1.5rem',
  borderBottom: '1px solid #f0f0f0',
  backgroundColor: '#fff',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.5rem',
  fontWeight: '700',
  color: 'var(--text-dark, #333)',
};

const descriptionStyle: React.CSSProperties = {
  margin: '0.5rem 0 0 0',
  fontSize: '0.95rem',
  color: 'var(--text-muted, #666)',
};

const bodyStyle: React.CSSProperties = {
  padding: '1.5rem',
  overflowY: 'auto',
  flex: 1,
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '1.25rem',
  right: '1.25rem',
  background: 'transparent',
  border: 'none',
  padding: '0.5rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#888',
  cursor: 'pointer',
  borderRadius: '50%',
  transition: 'background-color 0.2s',
};
