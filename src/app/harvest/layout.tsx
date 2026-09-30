import { EditorialHeader } from "@/components/prototypes/EditorialHeader";
import { Footer } from "@/components/pieces/Footer";

// The Harvest's own page is on Brand v1 and draws its own header and footer. The pages under it (/harvest/csa,
// /harvest/produce) are not yet, so they get the old header and the Brand v1 footer from here: the footer is on every
// address, with the Acknowledgement of Country. data-site-chrome is what lets a Brand v1 page send both away
// (body:has([data-brand-page]) [data-site-chrome] in globals.css), and "contents" keeps them out of the layout.
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
      <div data-site-chrome className="contents">
        <Footer />
      </div>
    </>
  );
}
