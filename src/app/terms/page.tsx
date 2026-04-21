import PageHero from "../../components/PageHero";
import { WarmCard } from "@/components/warm-editorial";

export const metadata = {
  title: "Terms + Cultural Protocols",
  description:
    "Interim public terms for using ACT websites, submitting enquiries, and engaging with stories, media, and cultural material surfaced through the studio.",
};

export default function TermsPage() {
  return (
    <div className="space-y-16">
      <PageHero
        eyebrow="Terms + protocols"
        title="Using ACT sites and public materials"
        description="These are interim public terms for using ACT websites, submitting enquiries, and engaging with stories, media, and cultural material surfaced through the studio. Additional project-specific agreements may apply for residencies, commissions, workshops, bookings, or partnerships."
        actions={[{ label: "Contact us", href: "/contact" }]}
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
            Working principles
          </p>
          <ul className="space-y-2">
            <li>Use the site lawfully and in good faith.</li>
            <li>Respect story permissions, attribution, and cultural context.</li>
            <li>Do not treat public access as a blank cheque for reuse.</li>
          </ul>
        </div>
      </PageHero>

      <section className="grid gap-6 md:grid-cols-2">
        <WarmCard title="Using the site">
          <p>
            You may browse, read, and share links to ACT pages for personal,
            community, research, and partner use. Please do not interfere with the
            site, attempt to access restricted systems, or use automation in ways
            that damage service quality or ignore permission boundaries.
          </p>
        </WarmCard>

        <WarmCard title="Stories, images, and cultural material">
          <p>
            Some ACT pages include community stories, photographs, video, audio, or
            cultural material. Public visibility does not automatically mean open
            reuse. Attribution, cultural authority, and storyteller permission still
            matter.
          </p>
          <p>
            If you want to republish, adapt, archive, or use material beyond simple
            linking or brief quotation, ask first.
          </p>
        </WarmCard>

        <WarmCard title="Enquiries, bookings, and participation">
          <p>
            Sending an enquiry, joining a waitlist, or registering interest does not
            guarantee acceptance, availability, or a particular timeline. Farm stays,
            residencies, workshops, and partnerships are all subject to fit,
            capacity, and care obligations to place and people.
          </p>
        </WarmCard>

        <WarmCard title="Updates">
          <p>
            ACT is still building parts of its public infrastructure. These terms may
            be refined as the studio, project sites, and consent systems mature. The
            current version on this site is the public reference point until more
            specific terms replace or supplement it.
          </p>
        </WarmCard>
      </section>
    </div>
  );
}
