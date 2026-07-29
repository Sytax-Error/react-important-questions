import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const DialogPortal = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>
>(({ children, forceMount, container, ...props }, forwardedRef) => (
  <DialogPrimitive.Portal
    forceMount={forceMount}
    container={container}
    {...props}
  >
    <div ref={forwardedRef}>{children}</div>
  </DialogPrimitive.Portal>
));
DialogPortal.displayName = "DialogPortal";

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, forwardedRef) => (
  <DialogPrimitive.Content
    ref={forwardedRef}
    className={cn(
      "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg gap-4 translate-x-[-50%] translate-y-[-50%] rounded-md border bg-popover p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  >
    <div className="space-y-4">{children}</div>
  </DialogPrimitive.Content>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  className,
  ...props
}: {
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <header
    className={cn("flex flex-col space-y-2 text-center", className)}
    {...props}
  ></header>
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: {
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <footer
    className={cn(
      "flex flex-col sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  ></footer>
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ className, children, ...props }, forwardedRef) => {
  const { asChild, ...triggerProps } = props;

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
      ref: forwardedRef,
      className: cn(className, child.props.className),
      ...triggerProps,
    });
  }

  return (
    <button
      ref={forwardedRef}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...triggerProps}
    >
      {children}
    </button>
  );
});
DialogTrigger.displayName = "DialogTrigger";

const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, children, ...props }, forwardedRef) => {
  const { asChild, ...closeProps } = props;

  if (asChild) {
    const child = React.Children.only(children);
    if (!React.isValidElement(child)) {
      console.error(
        "DialogClose: asChild expects a single valid element child.",
        children,
      );
      return null;
    }

    return React.cloneElement(child, {
      ref: forwardedRef,
      className: cn(className, child.props.className),
      ...closeProps,
    });
  }

  return (
    <button
      ref={forwardedRef}
      className={cn(
        "rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...closeProps}
    >
      {children}
    </button>
  );
});
DialogClose.displayName = "DialogClose";

interface DialogProps extends React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> {
  /**
   * @defaultValue false
   */
  open?: boolean;
  /**
   * @defaultValue false
   */
  modal?: boolean;
  /**
   * @defaultValue false
   */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogRootProps extends Omit<DialogProps, "open"> {
  /**
   * @defaultValue false
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DialogRoot = React.forwardRef<HTMLDivElement, DialogRootProps>(
  ({ open = false, defaultOpen, onOpenChange, children, ...props }, ref) => {
    const [controlledOpen, setControlledOpen] = React.useState<boolean>(
      open ?? false,
    );
    const isUncontrolled = open === undefined;
    const isOpen = isUncontrolled ? (defaultOpen ?? false) : controlledOpen;

    // Sync controlled state with prop changes
    React.useEffect(() => {
      if (!isUncontrolled) {
        setControlledOpen(open ?? false);
      }
    }, [open, isUncontrolled]);

    // Handle open change from Radix (user interactions like clicking overlay)
    const handleOpenChange = React.useCallback(
      (newOpen: boolean) => {
        setControlledOpen(newOpen);
        if (isUncontrolled) {
          // In uncontrolled mode, we don't call onOpenChange
          return;
        }
        // In controlled mode, notify parent of the change
        onOpenChange?.(newOpen);
      },
      [isUncontrolled, onOpenChange],
    );

    return (
      <DialogPrimitive.Root
        open={isOpen}
        onOpenChange={handleOpenChange}
        {...props}
      >
        <DialogPortal>
          <DialogOverlay
            onClick={
              handleOpenChange
                ? (ev) => {
                    const target = ev.target as HTMLElement;
                    if (target === ev.currentTarget) {
                      handleOpenChange(false);
                    }
                  }
                : undefined
            }
          />
          <DialogContent ref={ref}>{children}</DialogContent>
        </DialogPortal>
      </DialogPrimitive.Root>
    );
  },
);
DialogRoot.displayName = "DialogRoot";

export {
  DialogRoot as Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};
