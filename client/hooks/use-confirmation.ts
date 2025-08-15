import { useState, useCallback } from 'react';

export interface ConfirmationConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmationState {
  isOpen: boolean;
  config: ConfirmationConfig | null;
}

interface UseConfirmationReturn {
  isOpen: boolean;
  config: ConfirmationConfig | null;
  confirm: (config: ConfirmationConfig) => void;
  handleConfirm: () => Promise<void>;
  handleCancel: () => void;
}

export function useConfirmation(): UseConfirmationReturn {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    config: null,
  });

  const confirm = useCallback((config: ConfirmationConfig) => {
    setState({
      isOpen: true,
      config: {
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        variant: 'default',
        ...config,
      },
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    if (state.config?.onConfirm) {
      await state.config.onConfirm();
    }
    setState({ isOpen: false, config: null });
  }, [state.config]);

  const handleCancel = useCallback(() => {
    if (state.config?.onCancel) {
      state.config.onCancel();
    }
    setState({ isOpen: false, config: null });
  }, [state.config]);

  return {
    isOpen: state.isOpen,
    config: state.config,
    confirm,
    handleConfirm,
    handleCancel,
  };
}

// Global confirmation function
let globalConfirmationFn: ((config: ConfirmationConfig) => void) | null = null;

export function setGlobalConfirmationFunction(fn: (config: ConfirmationConfig) => void) {
  globalConfirmationFn = fn;
}

export function showConfirmation(config: ConfirmationConfig) {
  if (globalConfirmationFn) {
    globalConfirmationFn(config);
  } else {
    // Fallback to browser confirm
    const confirmed = confirm(`${config.title}\n\n${config.message}`);
    if (confirmed) {
      config.onConfirm();
    } else if (config.onCancel) {
      config.onCancel();
    }
  }
}
