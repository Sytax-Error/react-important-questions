import * as React from "react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogCloseProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
  onClick?: () => void;
}

// Main Dialog component using native <dialog> element
const Dialog = React.forwardRef<HTMLDialogElement, DialogProps>(
  ({ open, onOpenChange, children, className, ...props }, ref) => {
    // Use a single ref for the dialog element
    const dialogRef = React.useRef<HTMLDialogElement | null>(null);
    const previousActiveElement = React.useRef<HTMLElement | null>(null);

    // Apply focus trap logic
    React.useEffect(() => {
      if (!open || !dialogRef.current) return;

      const dialog = dialogRef.current;
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus the dialog or first focusable element
      const focusableElements = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        dialog.focus();
      }

      // Handle tab key for focus trapping
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;

        const focusableElements = dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          // Find the close button or trigger onOpenChange(false)
          const closeButton = dialog.querySelector(
            "[data-dialog-close]",
          ) as HTMLElement;
          if (closeButton) {
            closeButton.click();
          }
        }
      };

      dialog.addEventListener("keydown", handleKeyDown);
      dialog.addEventListener("keydown", handleEscape);

      return () => {
        dialog.removeEventListener("keydown", handleKeyDown);
        dialog.removeEventListener("keydown", handleEscape);
        // Restore focus to previous element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }, [open]);

    // Merge the forwarded ref with our internal ref
    const mergedRef = React.useCallback(
      (node: HTMLDialogElement | null) => {
        dialogRef.current = node;
        if (ref) {
          if (typeof ref === "function") ref(node);
          else ref.current = node;
        }
      },
      [ref],
    );

    React.useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (open) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }, [open, dialogRef]);

    const handleClose = () => {
      onOpenChange(false);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
      const dialog = e.currentTarget;
      const rect = dialog.getBoundingClientRect();
      const isInDialog =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!isInDialog) {
        handleClose();
      }
    };

    return (
      <dialog
        ref={mergedRef}
        className={cn(
          "border-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-0",
          className,
        )}
        onClose={handleClose}
        onClick={handleBackdropClick}
        {...props}
      >
        <div
          className={cn(
            "rounded-lg shadow-lg w-full mx-auto p-6",
            "animate-zoom-in duration-200",
          )}
        >
          {children}
        </div>
      </dialog>
    );
  },
);
Dialog.displayName = "Dialog";

// DialogContent - wrapper for dialog content
const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn("max-w-lg", className)} {...props}>
      {children}
    </div>
  ),
);
DialogContent.displayName = "DialogContent";

// DialogHeader
const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className,
      )}
      {...props}
    >
      {children}
    </header>
  ),
);
DialogHeader.displayName = "DialogHeader";

// DialogTitle
const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ children, className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  ),
);
DialogTitle.displayName = "DialogTitle";

// DialogDescription
const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(({ children, className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  >
    {children}
  </p>
));
DialogDescription.displayName = "DialogDescription";

// DialogFooter
const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ children, className, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4",
        className,
      )}
      {...props}
    >
      {children}
    </footer>
  ),
);
DialogFooter.displayName = "DialogFooter";

// DialogClose - button to close dialog
const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ children, className, onClick, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      data-dialog-close
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
);
DialogClose.displayName = "DialogClose";

// DialogTrigger - button to open dialog
const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ children, asChild, className, onClick, ...props }, ref) => {
    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        console.error(
          "DialogTrigger: asChild expects a single valid element child.",
          children,
        );
        return null;
      }

      return React.cloneElement(child, {
        ref,
        className: cn(className, child.props.className),
        onClick: (e: React.MouseEvent) => {
          child.props.onClick?.(e);
          onClick?.();
        },
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  },
);
DialogTrigger.displayName = "DialogTrigger";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};
