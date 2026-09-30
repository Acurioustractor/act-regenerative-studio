import { LegalPage } from "../_legal/LegalPage";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "Terms + Cultural Protocols",
  description:
    "Interim public terms for using ACT websites, submitting enquiries, and engaging with stories, media, and cultural material surfaced through the studio.",
  path: "/terms",
});

// Pencil: Page 15 · Privacy (and Terms) (FCoht), the same design as Privacy: three points, four sections. The words are
// the page's own.
export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms + protocols"
      title="Using ACT sites and public materials"
      description="These are interim public terms for using ACT websites, submitting enquiries, and engaging with stories, media, and cultural material surfaced through the studio. Additional project-specific agreements may apply for residencies, commissions, workshops, bookings, or partnerships."
      pointsLabel="Working principles"
      points={[
        "Use the site lawfully and in good faith.",
        "Respect story permissions, attribution, and cultural context.",
        "Do not treat public access as a blank cheque for reuse.",
      ]}
      contact={{ label: "Contact us", href: "/contact" }}
      sections={[
        {
          title: "Using the site",
          paragraphs: [
            "You may browse, read, and share links to ACT pages for personal, community, research, and partner use. Please do not interfere with the site, attempt to access restricted systems, or use automation in ways that damage service quality or ignore permission boundaries.",
          ],
        },
        {
          title: "Stories, images, and cultural material",
          paragraphs: [
            "Some ACT pages include community stories, photographs, video, audio, or cultural material. Public visibility does not automatically mean open reuse. Attribution, cultural authority, and storyteller permission still matter.",
            "If you want to republish, adapt, archive, or use material beyond simple linking or brief quotation, ask first.",
          ],
        },
        {
          title: "Enquiries, bookings, and participation",
          paragraphs: [
            "Sending an enquiry, joining a waitlist, or registering interest does not guarantee acceptance, availability, or a particular timeline. Farm stays, residencies, workshops, and partnerships are all subject to fit, capacity, and care obligations to place and people.",
          ],
        },
        {
          title: "Updates",
          paragraphs: [
            "ACT is still building parts of its public infrastructure. These terms may be refined as the studio, project sites, and consent systems mature. The current version on this site is the public reference point until more specific terms replace or supplement it.",
          ],
        },
      ]}
    />
  );
}
