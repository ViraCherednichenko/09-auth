"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import Modal from "@/components/Modal/Modal";

type Props = {
  children: ReactNode;
};

export default function ModalRouteWrapper({ children }: Props) {
  const router = useRouter();

  return (
    <Modal isOpen={true} onClose={() => router.back()}>
      {children}
    </Modal>
  );
}