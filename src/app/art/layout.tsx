import { EditorialHeader } from "@/components/prototypes/EditorialHeader";

export default function ArtLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EditorialHeader />
      {children}
    </>
  );
}
