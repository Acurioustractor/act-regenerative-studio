import { fieldsById, questions, works, type FieldId } from "@/content";
import type { Way } from "@/components/pieces/FourWaysOn";
import { articlesForField } from "@/lib/fields/field-graph";

export type Ways = { listen: Way; curiosity: Way; action: Way; art: Way };

const overlaps = (a: FieldId[], b: FieldId[]) => a.some((id) => b.includes(id));

/**
 * Four ways on from a page that is part of these fields: a story written from them, a question they hold, the first
 * project's own site, and a work in them. Each way falls back to its door when the fields hold nothing, so there are no
 * dead ends. `not` names what the page itself is, so a way never leads straight back to it; `pick` lets a page choose
 * a way of its own, as the question page does with its next question.
 */
export function waysOn(
  partOf: FieldId[],
  not: { article?: string; question?: string; work?: string } = {},
  pick: Partial<Ways> = {},
): Ways {
  const article = partOf
    .flatMap((id) => articlesForField(id))
    .find((a) => a.slug !== not.article);
  const question = questions.find((q) => q.slug !== not.question && overlaps(q.partOf, partOf));
  const project = partOf.map((id) => fieldsById[id]).find((f) => f.kind === "project");
  const projectIds = partOf.filter((id) => fieldsById[id].kind === "project");
  const work =
    works.find((w) => w.slug !== not.work && projectIds.length > 0 && overlaps(w.partOf, projectIds)) ??
    works.find((w) => w.slug !== not.work && w.featured);

  return {
    listen: pick.listen ??
      (article
        ? { title: article.title, href: `/stories/${article.slug}` }
        : { invite: "All the stories", title: "The writing so far.", href: "/stories" }),
    curiosity: pick.curiosity ??
      (question ? { title: question.question, href: `/questions/${question.slug}` } : { title: "All the questions", href: "/questions" }),
    action: pick.action ??
      (project ? { title: `${project.name} ↗`, href: project.destinationHref } : { title: "The work", href: "/work" }),
    art: pick.art ?? (work ? { title: work.title, href: `/art/${work.slug}` } : { title: "Come into the art.", href: "/art" }),
  };
}

/**
 * The four ways on for a page that belongs to no field (Contact, Privacy, Terms, the 404), in the words Pencil draws on
 * those pages. Pages about a field use waysOn instead.
 */
export const generalWays: Ways = {
  listen: { invite: "All the stories", title: "The writing so far.", href: "/stories" },
  curiosity: { invite: "All the questions", title: "Curiosity before certainty.", href: "/questions" },
  action: { title: "The work", href: "/work" },
  art: { title: "Come into the art.", href: "/art" },
};
