"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: "warning" | "error" | "info";
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  severity = "warning",
}) => {
  const getSeverityColor = () => {
    switch (severity) {
      case "error":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      case "info":
        return "#3b82f6";
      default:
        return "#f59e0b";
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onCancel}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, scale: 0.8, y: -20 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.8, y: -20 },
            transition: { duration: 0.2 },
            style: {
              borderRadius: 16,
              padding: "8px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: `${getSeverityColor()}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ExclamationTriangleIcon
                  style={{
                    width: 24,
                    height: 24,
                    color: getSeverityColor(),
                  }}
                />
              </Box>
              <Typography variant="h6" component="div" fontWeight={600}>
                {title}
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ pb: 2 }}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.6 }}
            >
              {message}
            </Typography>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
              onClick={onCancel}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                py: 1,
              }}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              variant="contained"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                py: 1,
                backgroundColor: getSeverityColor(),
                "&:hover": {
                  backgroundColor: getSeverityColor(),
                  filter: "brightness(0.9)",
                },
              }}
            >
              {confirmText}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
