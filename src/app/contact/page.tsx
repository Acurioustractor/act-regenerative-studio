import LivingSystemStrip from "@/components/LivingSystemStrip";
import Link from "next/link";
import { Suspense } from "react";
import { ContactForm } from "../../components/forms/ContactForm";
import { EnquiryExpectations } from "../../components/forms/EnquiryExpectations";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";

const contactPaths = [
  {
    title: "Project or partnership",
    description:
      "You have a live challenge, field, place, or institutional question and want to explore whether ACT is the right collaborator.",
    href: "/contact?type=project-partnership&source=contact-paths&context=project-or-partnership",
    cta: "Use this path",
  },
  {
    title: "Residency or visit",
    description:
      "You want to come onto Jinibara Country through a residency, farm stay, workshop, or field-based invitation.",
    href: "/contact?type=residency-visit&source=contact-paths&context=residency-or-visit",
    cta: "Use this path",
  },
  {
    title: "Commission or cultural work",
    description:
      "You want to make something public through installation, story process, exhibition, or voice-led work.",
    href: "/contact?type=commission-cultural-work&source=contact-paths&context=commission-or-cultural-work",
    cta: "Use this path",
  },
];

export default function ContactPage() {
  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Contact"
        title="Start a conversation with the right amount of context"
        description="Reach out to explore a project, partnership, residency, or commission. ACT works best when the conversation begins with the real place, people, and pressure involved."
        actions={[
          { label: "Explore projects", href: "/projects" },
          { label: "See how we work", href: "/how-we-work", variant: "outline" },
        ]}
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
            Studio contact
          </p>
          <p>
            Email: <span className="font-semibold">hi@act.place</span>
          </p>
          <p>Location: Jinibara Country, Black Cockatoo Valley.</p>
          <p className="text-sm leading-6 text-[#4D3F33]">
            The more specific you can be about the field, the people, and the timing, the better the conversation will be.
          </p>
        </div>
      </PageHero>

      <LivingSystemStrip
        eyebrow="Contact path"
        title="The contact surface is part of the living system too"
        description="Project framing on this site is grounded in the ACT wiki. Stories, media, and collaboration proof can keep arriving through Empathy Ledger. So when you reach out, the site already carries some real context instead of making every conversation start from zero."
        wiki={{
          href: "/wiki",
          label: "Open ACT wiki",
        }}
        live={{
          sourceLabel: "Live project and story layers connected through Empathy Ledger",
          href: `${process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || "https://empathyledger.com"}/projects`,
        }}
        stats={[
          { label: "Primary inbox", value: "hi@act.place" },
          { label: "Orientation", value: "Place-first" },
          { label: "Method", value: "LCAA" },
        ]}
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Best fit"
          title="What kind of conversation are you starting?"
          description="You do not need a polished brief, but it helps to know which path you are roughly in."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {contactPaths.map((path) => (
            <div
              key={path.title}
              className="rounded-3xl border border-[#E1D3BA] bg-white/75 p-7"
            >
              <h3 className="font-[var(--font-display)] text-2xl font-semibold text-[#2F3E2E]">
                {path.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#4D3F33]">
                {path.description}
              </p>
              <Link
                href={path.href}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2F3E2E] transition hover:gap-3"
              >
                <span>{path.cta}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Get in touch"
          title="Contact form"
          description="Tell us about the field you are working in, who is involved, what stage you are at, and what kind of conversation you are hoping to have."
        />
        <EnquiryExpectations
          title="A little context helps us route this well"
          intro="We read these enquiries as conversation starters, not as procurement forms. The clearer you are about the field, urgency, place, and people involved, the easier it is to respond in a useful way."
          whatHelps={[
            "Name the project, place, or community context if there is one.",
            "Tell us whether this is an early conversation, live need, or commissioning decision.",
            "Be direct about timing, budget, or constraints if they already exist.",
          ]}
          whatHappensNext={[
            "We review for fit, timing, and who in the ACT field should respond.",
            "Some enquiries are better handled through a project-specific page or form.",
            "If there is alignment, the next step is usually a smaller real conversation rather than a larger deck.",
          ]}
        />
        <div className="mx-auto max-w-2xl">
          <Suspense fallback={<div className="rounded-3xl border border-[#E3D4BA] bg-white/80 p-8 text-sm text-[#4D3F33]">Loading contact form…</div>}>
            <ContactForm
              projectCode="ACT-IN"
              formType="contact"
              contextLabel="Studio contact page"
              additionalTags={["Public contact route"]}
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
