import { InlineLink, LegalPage } from "../_legal/LegalPage";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "Privacy + Consent",
  description:
    "Interim public summary of how ACT handles enquiries, consented stories, media, and cultural material across the studio website and linked project surfaces.",
  path: "/privacy",
});

// Pencil: Page 15 · Privacy (and Terms) (FCoht). The words are the page's own; the two stale references (the wiki, and
// "stay" forms) are out of section 01.
export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy + consent"
      title="Privacy and cultural data care"
      description="This is an interim public summary of how ACT handles enquiries, consented stories, media, and cultural material across the studio website and linked project surfaces. It is not a substitute for project-specific agreements or fuller legal terms where those apply."
      pointsLabel="What matters most"
      points={[
        "Consent is specific, ongoing, and revocable where possible.",
        "Community knowledge is not treated as free raw material.",
        "Public project memory and private participant data are not the same thing.",
      ]}
      contact={{ label: "Contact us", href: "/contact" }}
      sections={[
        {
          title: "What this covers",
          paragraphs: [
            "This site may collect information you choose to share through contact, residency, CSA, or workshop forms. Some ACT pages also surface approved stories, media, and documentation that originate in project workflows such as Empathy Ledger.",
            "Public project memory is not the place where private participant records or restricted story permissions are stored.",
          ],
        },
        {
          title: "How stories and media are handled",
          paragraphs: [
            "When ACT works with stories, photographs, audio, or video, we aim to treat permission as part of the infrastructure, not a box-ticking exercise. That means stories should only travel where permission allows, and public-facing pages should only show material approved for that use.",
            "Some permissions are time-bound, contextual, or revocable. Where that is the case, we aim to honour the most current approved use, even if that means removing or changing previously published material.",
          ],
        },
        {
          title: "Basic site information",
          paragraphs: [
            "Like most websites, we may rely on hosting, analytics, form handling, and media delivery tools that generate operational logs. We try to keep this lightweight and proportionate to the work the site is doing.",
            "If a project, residency, or workshop requires more specific data collection, we will usually explain that closer to the point of participation rather than hide it in generic copy.",
          ],
        },
        {
          title: "Requests, corrections, and withdrawal",
          paragraphs: [
            "You can contact ACT to ask what enquiry information we hold, request a correction, or ask us to review a published item. Where stories or media were shared through a consent-based workflow, we will review requests in line with the permission attached to that material and the practical limits of syndication or archival copies.",
            <>
              The fastest path is through <InlineLink href="/contact">the contact page</InlineLink>.
            </>,
          ],
        },
      ]}
    />
  );
}
