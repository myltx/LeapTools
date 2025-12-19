"use client";

import type { CSSProperties, ReactNode } from "react";
import type { ModalProps as NextUIModalProps } from "@nextui-org/react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from "@nextui-org/react";
import { usePrefersReducedMotion } from "@leaptools/hooks";

export type DialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode | ((ctx: { onClose: () => void }) => ReactNode);
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  dismissable?: boolean;
  disableAnimation?: boolean;
  motionProps?: NextUIModalProps["motionProps"];
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
  disableAnimation,
  motionProps,
  className,
  style
}: DialogProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const disableAnimationResolved = disableAnimation ?? prefersReducedMotion;

  const motionPropsResolved: NextUIModalProps["motionProps"] | undefined = disableAnimationResolved
    ? undefined
    : (motionProps ?? {
        variants: {
          enter: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.18, ease: [0.2, 0, 0, 1] }
          },
          exit: {
            opacity: 0,
            y: 8,
            scale: 0.985,
            transition: { duration: 0.14, ease: [0.2, 0, 0, 1] }
          }
        }
      });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size={size}
      isDismissable={dismissable}
      disableAnimation={disableAnimationResolved}
      {...(motionPropsResolved ? { motionProps: motionPropsResolved } : {})}
    >
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
