"use client";

import { createContext, useContext } from "react";

export const ModalCloseContext = createContext<() => void>(() => {});

export function useModalClose() {
  return useContext(ModalCloseContext);
}

// Set by CaseStudyModalShell itself when it actually mounts — the only
// reliable signal that the modal (not just the full case-study page, whose
// URL also ends in "/case-study") is really showing.
export const ModalOpenContext = createContext<(open: boolean) => void>(() => {});

export function useSetModalOpen() {
  return useContext(ModalOpenContext);
}
