"use client";
import { useState } from "react";

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: "warning" | "error" | "info";
}

interface ConfirmationState extends ConfirmationOptions {
  open: boolean;
  resolve?: (_value: boolean) => void;
}

export const useConfirmDialog = () => {
  const [state, setState] = useState<ConfirmationState>({
    open: false,
    title: "",
    message: "",
  });

  const showConfirmation = (options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        ...options,
        open: true,
        resolve,
      });
    });
  };

  const handleConfirm = () => {
    state.resolve?.(true);
    setState((prev) => ({ ...prev, open: false }));
  };

  const handleCancel = () => {
    state.resolve?.(false);
    setState((prev) => ({ ...prev, open: false }));
  };

  return {
    showConfirmation,
    handleConfirm,
    handleCancel,
    confirmationProps: {
      open: state.open,
      title: state.title,
      message: state.message,
      confirmText: state.confirmText,
      cancelText: state.cancelText,
      severity: state.severity,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    },
  };
};

export default useConfirmDialog;
