"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from "@nextui-org/react";

export type DialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode | ((ctx: { onClose: () => void }) => ReactNode);
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  dismissable?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Dialog({
  isOpen,
  onOpenChange,
  title,
  children,
  footer,
  size = "md",
  dismissable = true,
  className,
  style
}: DialogProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size} isDismissable={dismissable}>
      <ModalContent {...(className === undefined ? {} : { className })} {...(style === undefined ? {} : { style })}>
        {(onClose) => (
          <>
            {title ? <ModalHeader>{title}</ModalHeader> : null}
            <ModalBody>{children}</ModalBody>
            {footer ? (
              <ModalFooter>
                {typeof footer === "function" ? footer({ onClose }) : footer}
              </ModalFooter>
            ) : null}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
