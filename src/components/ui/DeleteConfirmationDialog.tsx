import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  variant?: "default" | "destructive";
  disabled?: boolean;
}

export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  variant = "destructive",
  disabled = false,
}: DeleteConfirmationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={disabled}>
            Cancel
          </Button>
          <Button
            variant={variant === "destructive" ? "danger" : "primary"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={disabled}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
