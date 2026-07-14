"use client";

import { useState, type ReactNode } from "react";
import { MODAL_TRANSITION } from "@/app/components/work/modalTiming";
import { ModalOpenContext } from "@/app/components/work/ModalContext";

export default function PageStack({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  const [modalActive, setModalActive] = useState(false);

  return (
    <ModalOpenContext.Provider value={setModalActive}>
      <div
        aria-hidden={modalActive}
        className="fixed inset-0 -z-10 bg-black"
        style={{ opacity: modalActive ? 0.35 : 0, transition: `opacity ${MODAL_TRANSITION}` }}
      />
      <div
        className="origin-top"
        style={{
          transition: `transform ${MODAL_TRANSITION}, border-radius ${MODAL_TRANSITION}, box-shadow ${MODAL_TRANSITION}`,
          ...(modalActive
            ? {
                transform: "scale(0.94) translateY(8px)",
                borderRadius: 28,
                overflow: "hidden",
                boxShadow: "0 30px 60px -15px rgba(0,0,0,0.35)",
              }
            : undefined),
        }}
      >
        {children}
      </div>
      {modal}
    </ModalOpenContext.Provider>
  );
}
