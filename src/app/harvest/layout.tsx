import { EditorialHeader } from "@/components/prototypes/EditorialHeader";

// The Harvest's own page is on Brand v1 and draws its own header. The pages under it (/harvest/csa, /harvest/produce)
// are not yet, so they keep this one; data-site-chrome is what lets a Brand v1 page send it away
// (body:has([data-brand-page]) [data-site-chrome] in globals.css), and "contents" keeps it out of their layout.
export default function HarvestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div data-site-chrome className="contents">
        <EditorialHeader />
      </div>
      {children}
    </>
  );
}
