import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { JsonLd } from '@/components/seo/JsonLd';
import LivingSystemStrip from '@/components/LivingSystemStrip';
import { NewsletterCTA } from '@/components/forms/NewsletterCTA';
// Server-only imports (use fs, supabase, etc.)
import {
  getProjectData,
  getAllProjectSlugs,
  themeStyles,
  getRelatedProjects,
} from '@/lib/projects/get-project-data';
import {
  getProjectEditorialArticles,
  getProjectEditorialFeature,
} from '@/lib/empathy-ledger-editorial';
import { getProjectFieldMedia } from '@/lib/projects/get-project-field-media';
import {
  getFeaturedWorkConfigBySlug,
  getRelatedFeaturedWorks,
} from '@/lib/works/live-featured-works';
import type { ACTFlagshipPackSourceBridge } from '@/types/shared/act-flagship-project-pack';
// Components
import {
  ProjectHero,
  ImpactDashboard,
  LCAAJourney,
  StoryVignettesSection,
  CommunityVoicesSection,
  CaseStudySection,
  ALMAInsightsSection,
  KnowledgeLinksSection,
  ProjectFieldMediaSection,
  StudioWorkSection,
  GoldPhoneVoicesSection,
  TranscriptsSection,
  ProjectKeyPeopleSection,
  SisterProjectsSection,
} from '@/components/projects';
import { getTranscriptsForProject } from '@/lib/empathy-ledger-transcripts';
import { getClusterCohort } from '@/lib/projects/cluster-cohort';
import { EmpathyLedgerConnections } from '@/components/projects/EmpathyLedgerConnections';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo/site';

interface EngagementAction {
  label: string;
  description: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

interface EngagementConfig {
  title: string;
  description: string;
  actions: EngagementAction[];
}

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectData(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.title,
    description: project.tagline || project.description,
    path: `/projects/${project.slug}`,
    image: project.coverImage?.url
      ? {
          url: project.coverImage.url,
          alt: project.coverImage.alt || `${project.title} project image`,
        }
      : undefined,
  });
}

// Loading skeleton for sections
function SectionSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 mx-auto bg-[var(--we-sand)]/50 rounded-lg" />
      <div className="h-4 w-64 mx-auto bg-[var(--we-sand)]/30 rounded-lg" />
      <div className="grid gap-4 md:grid-cols-3 mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-[var(--we-sand)]/20 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

function getEngagementConfig(
  slug: string,
  projectTitle: string,
  projectWebsiteUrl: string | null
): EngagementConfig {
  if (slug === 'black-cockatoo-valley') {
    return {
      title: 'Ways to engage with Black Cockatoo Valley',
      description:
        'Black Cockatoo Valley is a conservation-first field site on Jinibara Country. The strongest entry points are slower ones: visits, residencies, and conversations about stewardship, learning, and reciprocal care.',
      actions: [
        {
          label: 'Plan a visit or residency',
          description:
            'Start with the land, the timing, and why the visit matters for the work you want to do.',
          href: '/contact?type=residency-visit&source=project-page&context=black-cockatoo-valley',
          variant: 'primary',
        },
        {
          label: 'See stays and visits',
          description:
            'Explore the quieter entry path onto Country through farm stays, workshops, and field-based visits.',
          href: '/farm/stay',
          variant: 'secondary',
        },
        {
          label: 'Explore residencies',
          description:
            'For artists, researchers, and collaborators wanting to work with land, time, and slower forms of practice.',
          href: '/art/residencies',
          variant: 'secondary',
        },
      ],
    };
  }

  if (slug === 'justicehub') {
    return {
      title: 'Ways to engage with JusticeHub',
      description:
        'JusticeHub works best through partnerships with communities, organisers, and institutions that are ready to redirect resources toward what already works on the ground.',
      actions: [
        {
          label: 'Start a justice partnership',
          description:
            'Bring a live justice question, policy challenge, or community pathway into a more grounded conversation.',
          href: '/contact?type=project-partnership&source=project-page&context=justicehub',
          variant: 'primary',
        },
        {
          label: 'Open the JusticeHub site',
          description:
            'Step into the dedicated JusticeHub site for the wider justice network and program story.',
          href: projectWebsiteUrl || '/justicehub',
          variant: 'secondary',
        },
      ],
    };
  }

  if (slug === 'goods') {
    return {
      title: 'Ways to engage with Goods on Country',
      description:
        'Goods on Country is about useful objects, circular manufacturing, and community deployment. The right conversations usually begin with a real place, procurement challenge, or delivery pathway.',
      actions: [
        {
          label: 'Talk about a deployment',
          description:
            'Bring a community need, goods pathway, or partnership question into the conversation.',
          href: '/contact?type=project-partnership&source=project-page&context=goods',
          variant: 'primary',
        },
        {
          label: 'See the Goods field page',
          description:
            'Read the ACT-facing overview of the Goods work, its context, and how it links back into the broader ecosystem.',
          href: '/goods',
          variant: 'secondary',
        },
      ],
    };
  }

  if (slug === 'the-harvest') {
    return {
      title: 'Ways to engage with The Harvest',
      description:
        'The Harvest is the community-facing edge of the land practice: shares, gatherings, meals, and local stewardship. The best next step depends on whether you want food, collaboration, or a seasonal gathering.',
      actions: [
        {
          label: 'Ask about harvest shares',
          description:
            'Start with the local rhythm of produce, participation, and whether a share or offering is the right fit.',
          href: '/harvest/csa',
          variant: 'primary',
        },
        {
          label: 'Bring a gathering or collaboration',
          description:
            'Talk through a meal, event, or community collaboration that belongs in the Harvest field rather than a generic venue hire model.',
          href: '/contact?type=project-partnership&source=project-page&context=the-harvest',
          variant: 'secondary',
        },
      ],
    };
  }

  if (slug === 'empathy-ledger') {
    return {
      title: 'Work with Empathy Ledger',
      description:
        'Empathy Ledger gives communities cryptographic ownership of their stories, designed for partners who care about consent, attribution, and how narrative travels.',
      actions: [
        {
          label: 'Start a story or archive conversation',
          description:
            'Talk through the people, permissions, and narrative responsibility involved in the story system you are trying to build.',
          href: '/contact?type=project-partnership&source=project-page&context=empathy-ledger',
          variant: 'primary',
        },
        {
          label: 'Open Empathy Ledger',
          description:
            'Visit the dedicated platform surface for the public storytelling layer and broader product context.',
          href: projectWebsiteUrl || '/empathy-ledger',
          variant: 'secondary',
        },
      ],
    };
  }

  if (slug === 'contained') {
    return {
      title: 'Ways to engage with CONTAINED',
      description:
        'CONTAINED works best as an encounter: installation, campaign, and conversation held in the same frame. The next step is usually a host, commissioner, or justice partner ready to let the work do public pressure.',
      actions: [
        {
          label: 'Bring CONTAINED into a space',
          description:
            'Start a commissioning or hosting conversation grounded in audience, venue, and what public pressure the work needs to carry.',
          href: '/contact?type=commission&source=project-page&context=contained',
          variant: 'primary',
        },
        {
          label: 'Open the works layer',
          description:
            'See how CONTAINED sits alongside the wider ACT studio line rather than as a standalone campaign object.',
          href: '/art',
          variant: 'secondary',
        },
      ],
    };
  }

  if (slug === 'gold-phone') {
    return {
      title: 'Ways to engage with Gold.Phone',
      description:
        'Gold.Phone belongs in public, participatory contexts where voice, memory, and technology can meet slowly. The best next step is usually a host, curator, or collaborator with a real site in mind.',
      actions: [
        {
          label: 'Talk about hosting Gold.Phone',
          description:
            'Bring a site, event, or collaboration idea that suits an interactive voice work rather than a generic product demo.',
          href: '/contact?type=commission&source=project-page&context=gold-phone',
          variant: 'primary',
        },
        {
          label: 'Open the works layer',
          description:
            'Move through the wider ACT works surface and see how Gold.Phone sits in the studio line.',
          href: '/art',
          variant: 'secondary',
        },
      ],
    };
  }

  if (slug === 'uncle-allan-palm-island-art') {
    return {
      title: 'Ways to engage with Uncle Allan Palm Island Art',
      description:
        'This work is about cultural authority, commissions, and sharing on Uncle Allan’s terms. The right entry point is careful, relational, and grounded in where the work is going to land.',
      actions: [
        {
          label: 'Talk about a commission or collaboration',
          description:
            'Start with the commission context, collaborators, and how the work will be held respectfully.',
          href: '/contact?type=commission&source=project-page&context=uncle-allan-palm-island-art',
          variant: 'primary',
        },
        {
          label: 'Visit the dedicated artwork site',
          description:
            'Open the project’s own site when you need the direct portfolio and contact pathway.',
          href: projectWebsiteUrl || '/art',
          variant: 'secondary',
        },
      ],
    };
  }

  if (slug === 'the-confessional') {
    return {
      title: 'Ways to engage with The Confessional',
      description:
        'The Confessional is a facilitation and installation format. It works when the host understands intimacy, anonymity, and the difference between spectacle and safety.',
      actions: [
        {
          label: 'Talk about hosting The Confessional',
          description:
            'Bring the audience, venue, and care conditions into the conversation from the start.',
          href: '/contact?type=commission&source=project-page&context=the-confessional',
          variant: 'primary',
        },
        {
          label: 'Open the works layer',
          description:
            'See the wider studio context around this work and how it connects back into ACT’s other public forms.',
          href: '/art',
          variant: 'secondary',
        },
      ],
    };
  }

  const defaultActions: EngagementAction[] = [
    {
      label: `Start a conversation about ${projectTitle}`,
      description:
        'Bring the field, people, timing, and pressure around the work into a real conversation rather than a generic enquiry.',
      href: `/contact?type=project-partnership&source=project-page&context=${slug}`,
      variant: 'primary',
    },
    {
      label: 'Explore the wider ecosystem',
      description:
        'See how this project sits alongside the other ACT fields of work, practice, and public pathways.',
      href: '/projects',
      variant: 'secondary',
    },
  ];

  if (projectWebsiteUrl) {
    defaultActions.splice(1, 0, {
      label: 'Visit the dedicated project site',
      description:
        'Go deeper on the project’s own site while keeping ACT as the shared ecosystem frame.',
      href: projectWebsiteUrl,
      variant: 'secondary',
    });
  }

  return {
    title: 'Ways to engage',
    description:
      'Different projects need different kinds of conversations. Use the path that fits the stage, place, and people involved.',
    actions: defaultActions,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch enriched project data
  const project = await getProjectData(slug);

  if (!project) {
    notFound();
  }

  const theme = themeStyles[project.theme] ?? themeStyles.earth;
  const relatedProjects = getRelatedProjects(
    slug,
    3,
    project.wikiBacklinks.map((b) => b.slug)
  );
  const relatedWorks = await getRelatedFeaturedWorks(slug, project.title, 3);
  const sisterProjects = await getClusterCohort(slug, project.wikiData?.cluster);
  const [relatedArticles, projectEditorial] = await Promise.all([
    getProjectEditorialArticles(slug, 4),
    getProjectEditorialFeature(slug),
  ]);
  const workConfig = getFeaturedWorkConfigBySlug(slug);
  const fieldMedia = getProjectFieldMedia(project);
  const projectTranscripts = getTranscriptsForProject(slug);
  const engagementConfig = getEngagementConfig(
    slug,
    project.title,
    project.projectWebsiteUrl
  );
  const flagshipKnowledgeLinks =
    project.flagshipPack?.sourceBridges
      .slice(0, 3)
      .map((bridge: ACTFlagshipPackSourceBridge) => ({
      title: bridge.title,
      description: 'Read more about this work in the ACT wiki.',
      href: `/wiki/${bridge.stem}`,
      icon: '',
    })) || [];
  const liveContentAvailable =
    !!project.empathyLedgerContent &&
    (project.empathyLedgerContent.meta.story_count > 0 ||
      project.empathyLedgerContent.meta.storyteller_count > 0 ||
      project.empathyLedgerContent.meta.media_count > 0);

  const liveMeta = project.empathyLedgerContent?.meta;
  const featuredStory =
    project.empathyLedgerContent?.featured.stories.find((story) => story.featured_as_hero) ||
    project.empathyLedgerContent?.featured.stories[0] ||
    null;
  const studioWorkQuote = workConfig
    ? featuredStory?.excerpt ||
      projectEditorial.leadArticle?.excerpt ||
      project.quote?.text ||
      workConfig.fallbackQuote
    : null;

  return (
    <div className="space-y-16 pb-24">
      <JsonLd
        id={`project-${project.slug}-breadcrumb-jsonld`}
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Projects', path: '/projects' },
          { name: project.title, path: `/projects/${project.slug}` },
        ])}
      />
      {project.empathyLedger && (
        <EmpathyLedgerConnections
          projectSlug={project.slug}
          projectTitle={project.title}
          orgSlug={project.empathyLedger.orgSlug}
          elProjectSlugs={project.empathyLedger.elProjectSlugs}
          notes={project.empathyLedger.notes}
        />
      )}
      {/* Hero Section with Cover Image */}
      <ProjectHero
        title={project.title}
        tagline={project.tagline}
        description={project.description}
        theme={project.theme}
        coverImage={project.coverImage}
        coverVideo={project.coverVideo}
        focus={project.focus}
      />

      {workConfig && studioWorkQuote ? (
        <StudioWorkSection
          title={project.title}
          description={project.description}
          quote={studioWorkQuote}
          medium={workConfig.medium}
          place={workConfig.place}
          collaborators={workConfig.collaborators}
          connectedTo={workConfig.connectedTo}
          connectedHref={workConfig.connectedHref}
          supportImages={fieldMedia.images.slice(0, 2)}
          leadArticle={projectEditorial.leadArticle}
          live={{
            storyCount: liveMeta?.story_count || 0,
            storytellerCount: liveMeta?.storyteller_count || 0,
            mediaCount: liveMeta?.media_count || 0,
          }}
        />
      ) : null}

      {slug === 'gold-phone' ? <GoldPhoneVoicesSection /> : null}

      <ProjectFieldMediaSection
        projectTitle={project.title}
        media={fieldMedia}
        projectWebsiteUrl={project.projectWebsiteUrl}
      />

      <NewsletterCTA
        title={`Follow ${project.title} field notes`}
        description="Get new stories, images, and project updates after they are cleared through Empathy Ledger and connected back into the ACT wiki."
        projectCode={project.wikiData?.code || undefined}
        projectSlug={project.slug}
        source={`project-${project.slug}`}
        audience="project-reader"
        additionalTags={[`Project title: ${project.title}`]}
      />

      {(project.wikiData || liveContentAvailable) && (
        <LivingSystemStrip
          eyebrow="Background"
          title={
            workConfig
              ? `How ${project.title} works`
              : `About ${project.title}`
          }
          description={
            workConfig
              ? 'The story behind this work, where it came from, how it was made, and where it sits in the wider ACT studio.'
              : 'The longer story behind this project, how it works in practice, the people leading it, and the communities it sits with.'
          }
          wiki={
            project.wikiData
              ? {
                  href: `/wiki/${project.slug}`,
                  label: "Background & method",
                  status: project.wikiData.status,
                  code: project.wikiData.code,
                  tier: project.wikiData.tier,
                }
              : null
          }
          site={
            project.projectWebsiteUrl
              ? {
                  href: project.projectWebsiteUrl,
                  label: `Visit ${project.title}`,
                }
              : null
          }
          live={
            liveContentAvailable
              ? {
                  sourceLabel: null,
                  siteLabel: null,
                  storyCount: liveMeta?.story_count || 0,
                  storytellerCount: liveMeta?.storyteller_count || 0,
                  mediaCount: liveMeta?.media_count || 0,
                  fetchedAt: liveMeta?.fetched_at || null,
                  href: `${process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || 'https://empathyledger.com'}/projects/${project.slug}`,
                }
              : null
          }
        />
      )}

      {/* Impact Dashboard (stats + quote) */}
      <Suspense fallback={<SectionSkeleton />}>
        <ImpactDashboard
          stats={project.stats}
          quote={project.quote}
          storytellerCount={project.empathyLedgerContent?.meta.storyteller_count}
          storyCount={project.empathyLedgerContent?.meta.story_count}
          mediaCount={project.empathyLedgerContent?.meta.media_count}
          galleryCount={project.empathyLedgerContent?.meta.gallery_count}
          theme={project.theme}
        />
      </Suspense>

      {/* LCAA Journey (how we work) */}
      {project.hasLCAAContent && (
        <LCAAJourney
          listen={project.listen}
          curiosity={project.curiosity}
          action={project.action}
          art={project.art}
          theme={project.theme}
        />
      )}

      {/* Case Study - Featured Story from Empathy Ledger */}
      {project.empathyLedgerContent &&
        project.empathyLedgerContent.featured.stories.length > 0 &&
        project.empathyLedgerContent.featured.stories[0].featured_as_hero && (
          <CaseStudySection
            story={project.empathyLedgerContent.featured.stories[0]}
            projectTitle={project.title}
            theme={project.theme}
          />
        )}

      {/* ALMA Insights - Core Learnings & Outcomes */}
      {project.vignettes.length > 0 && (
        <ALMAInsightsSection
          vignettes={project.vignettes}
          projectTitle={project.title}
          theme={project.theme}
        />
      )}

      {/* Story Vignettes Section */}
      {project.vignettes.length > 0 && (
        <StoryVignettesSection
          vignettes={project.vignettes}
          projectTitle={project.title}
          theme={project.theme}
        />
      )}

      {/* Community Voices from Empathy Ledger */}
      {/* Launch hold (2026-05-27): storyteller blocks (Community Voices, Transcripts,
          Key People) hidden while /storytellers is held — their profile links point
          at the held surface. Restore by removing the `false &&` guards. */}
      {false && project.empathyLedgerContent && (
        <CommunityVoicesSection
          storytellers={project.empathyLedgerContent.featured.storytellers}
          stories={project.empathyLedgerContent.featured.stories}
          projectTitle={project.title}
        />
      )}

      {/* Transcripts (consented, from EL), silent if no transcripts for this project */}
      {false && (
        <TranscriptsSection
          transcripts={projectTranscripts}
          projectTitle={project.title}
        />
      )}

      {/* Key people from wiki ## Key People section, silent if none */}
      {false && (
        <ProjectKeyPeopleSection
          people={project.keyPeople}
          projectTitle={project.title}
        />
      )}

      {/* Related work, editorially-curated wiki backlinks */}
      {project.wikiBacklinks.length > 0 && (
        <section className="rounded-[28px] border border-[var(--we-sand)] bg-[#FDFBF7] p-6 md:p-10">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
              Related work
            </p>
            <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
              How this thread runs through ACT
            </h2>
            <p className="text-sm text-[var(--we-olive-deep)]">
              Other places this work connects, people, projects, and
              methods that pick up the same thread.
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.wikiBacklinks.map((link) => (
              <li key={link.slug}>
                <Link
                  href={`/wiki/${link.slug}`}
                  className="inline-flex items-center rounded-full border border-[var(--we-sand)] bg-white px-4 py-2 text-sm text-[var(--we-olive)] transition hover:border-[#7A9B76] hover:text-[#7A9B76]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedArticles.length > 0 && (
        <section className="space-y-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
              {projectEditorial.manifest?.sectionEyebrow || 'Field writing'}
            </p>
            <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
              {projectEditorial.manifest?.sectionTitle || 'Writing connected to this project'}
            </h2>
            <p className="mt-3 text-sm text-[var(--we-olive-deep)]">
              {projectEditorial.manifest?.sectionDescription ||
                'These articles live in the ACT editorial layer. They can be surfaced here, syndicated to spoke sites, and still stay connected to the project’s shared memory in the wiki.'}
            </p>
          </div>
          <div
            className={
              projectEditorial.leadArticle
                ? 'grid gap-6 lg:grid-cols-[1.12fr_0.88fr]'
                : 'grid gap-6 md:grid-cols-3'
            }
          >
            {projectEditorial.leadArticle ? (
              <Link
                href={projectEditorial.leadArticle.localPath}
                className="group overflow-hidden rounded-[28px] border border-[#D8C6A7] bg-[#11110F] text-[#F4ECDE] transition-all hover:border-[#CFA16B] hover:shadow-[0_18px_45px_rgba(39,30,20,0.22)]"
              >
                {projectEditorial.leadArticle.featuredImageUrl ? (
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={projectEditorial.leadArticle.featuredImageUrl}
                      alt={
                        projectEditorial.leadArticle.featuredImageAlt ||
                        projectEditorial.leadArticle.title
                      }
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  </div>
                ) : (
                  <div className="flex h-72 items-end bg-gradient-to-br from-[#2A231C] via-[#201B17] to-[#151310] p-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#D9B786]">
                      Editorial lead
                    </p>
                  </div>
                )}
                <div className="space-y-4 p-6">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#D9B786]">
                    {projectEditorial.leadArticle.articleType ? (
                      <span className="rounded-full border border-[var(--we-warm-brown)] bg-white/5 px-3 py-1 text-[#F4ECDE]">
                        {projectEditorial.leadArticle.articleType.replace(/_/g, ' ')}
                      </span>
                    ) : null}
                    {projectEditorial.leadArticle.publishedAt ? (
                      <span>
                        {new Date(projectEditorial.leadArticle.publishedAt).toLocaleDateString(
                          'en-AU',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="font-[var(--font-display)] text-2xl font-semibold text-white group-hover:text-[#F7DE72]">
                    {projectEditorial.leadArticle.title}
                  </h3>
                    <p className="max-w-2xl text-sm leading-7 text-[#E7D9C5]">
                    {projectEditorial.leadArticle.excerpt ||
                      'Open this field note in the ACT blog archive.'}
                  </p>
                  <div className="flex items-center justify-between pt-2 text-xs uppercase tracking-[0.22em] text-[#D7C8B2]">
                    <span>{projectEditorial.leadArticle.authorName}</span>
                    <span>Read note</span>
                  </div>
                </div>
              </Link>
            ) : null}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              {(projectEditorial.supportingArticles.length > 0
                ? projectEditorial.supportingArticles
                : projectEditorial.leadArticle
                  ? relatedArticles.filter(
                      (article) => article.slug !== projectEditorial.leadArticle?.slug
                    )
                  : relatedArticles
              ).map((article) => (
                <Link
                  key={article.slug}
                  href={article.localPath}
                  className="group overflow-hidden rounded-[24px] border border-[var(--we-sand)] bg-white transition-all hover:border-[#7A9B76] hover:shadow-lg"
                >
                  {article.featuredImageUrl ? (
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={article.featuredImageUrl}
                        alt={article.featuredImageAlt || article.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 items-end bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--we-warm-brown)]">
                        Editorial note
                      </p>
                    </div>
                  )}
                  <div className="space-y-3 p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#4CAF50]">
                      {article.articleType ? (
                        <span className="rounded-full bg-[#E8F3E6] px-3 py-1 text-[var(--we-olive)]">
                          {article.articleType.replace(/_/g, ' ')}
                        </span>
                      ) : null}
                      {article.publishedAt ? (
                        <span className="text-[var(--we-warm-brown)]">
                          {new Date(article.publishedAt).toLocaleDateString('en-AU', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="font-[var(--font-display)] text-lg font-semibold text-[var(--we-olive)] group-hover:text-[#7A9B76]">
                      {article.title}
                    </h3>
                    <p className="text-sm text-[var(--we-olive-deep)] line-clamp-3">
                      {article.excerpt || 'Open this field note in the ACT blog archive.'}
                    </p>
                    <div className="flex items-center justify-between pt-2 text-xs uppercase tracking-[0.22em] text-[var(--we-warm-brown)]">
                      <span>{article.authorName}</span>
                      <span>Read note</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Knowledge Base Links */}
      <KnowledgeLinksSection
        projectSlug={project.slug}
        projectTitle={project.title}
        theme={project.theme}
        ecosystemData={project.ecosystemData}
        projectWebsiteUrl={project.projectWebsiteUrl}
        projectRepoUrl={project.projectRepoUrl}
        hasEmpathyLedgerContent={!!project.empathyLedgerContent}
        hasWikiArticles={!!project.wikiData}
        customLinks={flagshipKnowledgeLinks}
      />

      {/* Media Gallery (if has items beyond hero) */}
      {project.mediaGallery.length > 0 && (
        <section className="space-y-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
              Gallery
            </p>
            <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)] md:text-3xl">
              From the field
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {project.mediaGallery.slice(0, 8).map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-2xl"
              >
                {item.type.startsWith('video') || item.type === 'video' ? (
                  <>
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.alt || item.title || 'Project video'}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    )}
                    <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                      Video
                    </div>
                  </>
                ) : item.type.startsWith('audio') || item.type === 'audio' ? (
                  <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[var(--we-olive)] via-[var(--we-brown-deep)] to-[#7A9B76] p-4 text-white">
                    <div className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
                      Audio
                    </div>
                    <div>
                      <p className="text-base font-semibold">
                        {item.title || item.caption || 'Audio story'}
                      </p>
                      <p className="mt-2 text-sm text-white/80">
                        Open in Empathy Ledger
                      </p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt={item.alt || item.title || 'Project media'}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                )}
                {item.isFeatured && item.type !== 'video' && item.type !== 'audio' && (
                  <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                    Featured
                  </div>
                )}
                {item.caption && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-sm text-white">{item.caption}</p>
                  </div>
                )}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Ways to Engage */}
      <section className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-8 md:p-12">
        <div className="max-w-3xl">
          <h2 className="mb-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
            {engagementConfig.title}
          </h2>
          <p className="text-sm leading-7 text-[var(--we-brown)]">
            {engagementConfig.description}
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {engagementConfig.actions.map((action) => {
            const buttonClass =
              action.variant === 'primary'
                ? `inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] ${theme.button}`
                : 'inline-flex items-center justify-center rounded-full border border-[#4CAF50] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--we-olive)] transition hover:bg-[#E5F4E4]';
            const isExternal = action.href.startsWith('http');

            return (
              <div
                key={`${action.label}-${action.href}`}
                className="rounded-2xl border border-[var(--we-sand)] bg-[#FDFBF7] p-5"
              >
                <h3 className="text-base font-semibold text-[var(--we-olive)]">
                  {action.label}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">
                  {action.description}
                </p>
                {isExternal ? (
                  <a
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${buttonClass} mt-5`}
                  >
                    {action.label}
                  </a>
                ) : (
                  <Link href={action.href} className={`${buttonClass} mt-5`}>
                    {action.label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Sister Projects, cluster-based editorial cohort (from wiki) */}
      <SisterProjectsSection
        cluster={project.wikiData?.cluster || ''}
        projects={sisterProjects}
      />

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="space-y-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
              Explore more
            </p>
            <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
              Related projects
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedProjects.map((related) => {
              const relatedTheme = themeStyles[related.theme];
              return (
                <Link
                  key={related.slug}
                  href={`/projects/${related.slug}`}
                  className="group rounded-[24px] border border-[var(--we-sand)] bg-white overflow-hidden transition-all hover:shadow-lg hover:border-[#7A9B76]"
                >
                  {related.heroImage && (
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={related.heroImage}
                        alt={related.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${relatedTheme.badge} mb-2`}
                    >
                      {related.theme}
                    </span>
                    <h3 className="font-[var(--font-display)] text-lg font-semibold text-[var(--we-olive)] group-hover:text-[#7A9B76]">
                      {related.title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--we-olive-deep)] line-clamp-2">
                      {related.tagline}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {relatedWorks.length > 0 && (
        <section className="space-y-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
              Studio line
            </p>
            <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
              Related works
            </h2>
            <p className="mt-3 text-sm text-[var(--we-olive-deep)]">
              Some ACT projects also belong to a broader line of studio works. These pieces share
              methods, materials, or public questions with this project.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedWorks.map((work) => (
              <Link
                key={work.slug}
                href={work.href}
                className="group overflow-hidden rounded-[24px] border border-[#2F2A25] bg-[#171612] transition-all hover:border-[#CFA16B] hover:shadow-lg"
              >
                {work.previewMedia ? (
                  work.previewMedia.kind === 'image' ? (
                    <img
                      src={work.previewMedia.thumbnailUrl || work.previewMedia.url}
                      alt={work.previewMedia.alt || work.title}
                      className="h-40 w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="relative h-40 overflow-hidden bg-[#11110F]">
                      {work.previewMedia.thumbnailUrl ? (
                        <img
                          src={work.previewMedia.thumbnailUrl}
                          alt={work.previewMedia.alt || work.title}
                          className="h-full w-full object-cover opacity-70 transition-transform group-hover:scale-105"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                        {work.previewMedia.kind}
                      </div>
                    </div>
                  )
                ) : null}
                <div className="space-y-3 p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#CFA16B]">
                    <span>{work.medium}</span>
                    <span className="text-[#6E6257]">•</span>
                    <span>{work.connectedTo}</span>
                  </div>
                  <h3 className="font-[var(--font-display)] text-lg font-semibold text-[#F3EBDD] group-hover:text-white">
                    {work.title}
                  </h3>
                  <p className="text-sm text-[#D7C8B2] line-clamp-3">{work.description}</p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#F3EBDD] transition group-hover:gap-3">
                    <span>View work</span>
                    <span aria-hidden="true">&rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Story and wiki follow-through */}
      <section className="rounded-3xl border border-[var(--we-sand)] bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-8 text-center md:p-12">
        <h3 className="mb-3 font-[var(--font-display)] text-xl font-semibold text-[var(--we-olive)] md:text-2xl">
          Keep following {project.title}
        </h3>
        <p className="mx-auto mb-6 max-w-2xl text-sm text-[#5A4A3A]">
          Stories, source notes, media, and partner pathways should keep pointing
          back to the same public record as this project changes.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/stories"
            className="inline-flex items-center justify-center rounded-full bg-[#4CAF50] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#3D9143]"
          >
            Read stories
          </Link>
          {project.wikiData ? (
            <Link
              href={`/wiki/${project.slug}`}
              className="inline-flex items-center justify-center rounded-full border border-[#4CAF50] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--we-olive)] transition hover:bg-[#E5F4E4]"
            >
              Open wiki
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}
