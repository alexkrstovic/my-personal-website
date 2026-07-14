"use client";

import { useModalClose } from "@/app/components/work/ModalContext";
import CloseBar, { CloseBarLabel } from "@/app/components/work/CloseBar";

export default function ModalCloseButton() {
  const requestClose = useModalClose();
  return (
    <CloseBar>
      <button
        type="button"
        onClick={requestClose}
        className="hover:opacity-60 transition-opacity"
        aria-label="Close case study"
      >
        <CloseBarLabel />
      </button>
    </CloseBar>
  );
}
