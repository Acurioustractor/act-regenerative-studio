import { EditorialHeader } from "@/components/prototypes/EditorialHeader";

export default function HarvestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <EditorialHeader />
      {children}
    </>
  );
}
