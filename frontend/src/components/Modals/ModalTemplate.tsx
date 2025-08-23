import { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/utils";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment } from "react";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Dialog as ShadcnDialog,
} from "@/components/ui/dialog";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  className?: string;
  isOpen?: boolean;
  primary?: boolean;
  showCloseButton?: boolean;
}
const ModalTemplate: React.FC<ModalProps> = ({
  children,
  onClose,
  className,
  isOpen = true,
  primary = true,
  showCloseButton = true,
}) => {
  return (
    <>
      {!primary ? (
        <Transition show={isOpen} as={Fragment}>
          <Dialog onClose={onClose} className="relative z-50">
            {/* Overlay fade */}
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200 animate-in fade-in-0"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                className={cn("fixed inset-0 bg-black/85 backdrop-blur-sm")}
              />
            </TransitionChild>

            {/* Panel scale + fade */}
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-200 zoom-in-95 fade-in-0"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150 "
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel
                  className={cn(
                    "bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",

                    className
                  )}
                >
                  {showCloseButton && (
                    <Button
                      type="button"
                      onClick={onClose}
                      variant={"outline"}
                      className="absolute top-4 right-4 rounded-full size-10"
                    >
                      <X className="!size-5" />
                      <span className="sr-only">Close</span>
                    </Button>
                  )}
                  <div>{children}</div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>
      ) : (
        <ShadcnDialog open={isOpen} onOpenChange={onClose}>
          <DialogContent
            className={cn(className)}
            showCloseButton={showCloseButton}
          >
            <DialogHeader className="hidden">
              <DialogTitle>Bisat modal</DialogTitle>
              <DialogDescription>
                This is a template for modals in Bisat.
              </DialogDescription>
            </DialogHeader>
            {children}
          </DialogContent>
        </ShadcnDialog>
      )}
    </>
  );
};

export default ModalTemplate;
