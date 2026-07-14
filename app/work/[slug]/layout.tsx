import type { ReactNode } from "react";
import PageStack from "@/app/components/work/PageStack";

export default function WorkSlugLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return <PageStack modal={modal}>{children}</PageStack>;
}
