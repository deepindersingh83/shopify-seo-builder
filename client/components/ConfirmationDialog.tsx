import React, { useEffect } from 'react';
import { AlertTriangle, Info, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useConfirmation, setGlobalConfirmationFunction } from '@/hooks/use-confirmation';

export function ConfirmationDialog() {
  const { isOpen, config, handleConfirm, handleCancel } = useConfirmation();

  // Set up global confirmation function
  useEffect(() => {
    const confirm = (config: any) => {
      // This function will be set by useConfirmation hook
    };
    setGlobalConfirmationFunction(confirm);
  }, []);

  if (!config) {
    return null;
  }

  const getIcon = () => {
    switch (config.variant) {
      case 'destructive':
        return <XCircle className="h-6 w-6 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case 'default':
      default:
        return <Info className="h-6 w-6 text-blue-600" />;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (config.variant) {
      case 'destructive':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'default':
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            {getIcon()}
            <DialogTitle>{config.title}</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            {config.message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            {config.cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={handleConfirm}
            className="w-full sm:w-auto"
          >
            {config.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
