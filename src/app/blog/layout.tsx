import { EditorialHeader } from "@/components/prototypes/EditorialHeader";

export default function BlogLayout({
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
