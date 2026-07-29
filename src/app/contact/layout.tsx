import { EditorialHeader } from "@/components/prototypes/EditorialHeader";

export default function ContactLayout({
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
