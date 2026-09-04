import { describe, expect, it } from "vitest";

import registry from "@/data/project-code-registry.generated.json";
import { livingFields } from "./living-field";

/**
 * The five doors out of the Living Field are the point of the site: each field
 * ends by handing the reader to the platform that does the work. Those links
 * used to be typed by hand in two files, one of which still pointed Empathy
 * Ledger at a preview deployment and Goods at Netlify. This holds every door
 * to the production_url the project-code registry carries for its platform,
 * so a change upstream in act-global-infrastructure surfaces here as a failing
 * test rather than a reader landing on a retired host.
 *
 * Whether the door opens on the first knock is a network question, answered
 * by scripts/check-platform-links.mjs at launch time, not here.
 */

type RegistryProject = {
  code: string;
  name: string;
  status: string;
  productionUrl: string | null;
};

const projects = (registry as { projects: RegistryProject[] }).projects;
const byCode = new Map(projects.map((project) => [project.code, project]));

/** Host with any leading www. removed, so apex and www count as one platform. */
const registrableHost = (url: string) =>
  new URL(url).hostname.toLowerCase().replace(/^www\./, "");

describe("living field platform links", () => {
  it.each(livingFields.map((field) => [field.id, field] as const))(
    "%s hands over to its registered platform",
    (_id, field) => {
      const project = byCode.get(field.platformCode);
      expect(
        project,
        `${field.platformCode} is not in src/data/project-code-registry.generated.json; run npm run sync:project-codes`,
      ).toBeDefined();
      expect(project!.status, `${field.platformCode} is ${project!.status}`).toBe("active");
      expect(
        project!.productionUrl,
        `${field.platformCode} has no production_url in act-global-infrastructure/config/project-codes.json`,
      ).toBeTruthy();

      const platformHost = registrableHost(project!.productionUrl!);
      for (const href of [field.destinationHref, field.projectHref]) {
        if (href.startsWith("/")) continue;
        expect(href.startsWith("https://"), `${href} must be https`).toBe(true);
        expect(
          registrableHost(href),
          `${field.id} links to ${href}, but ${field.platformCode} lives at ${project!.productionUrl}`,
        ).toBe(platformHost);
      }
    },
  );

  it("claims each of the four platforms, with art riding JusticeHub through CONTAINED", () => {
    const codes = livingFields.map((field) => field.platformCode).sort();
    expect(codes).toEqual(["ACT-EL", "ACT-GD", "ACT-HV", "ACT-JH", "ACT-JH"]);
    expect(livingFields.find((field) => field.id === "art")?.destinationHref).toContain("/contained");
  });
});
