import type { Way } from "@/components/pieces/FourWaysOn";
import { questionsBySlug, works } from "@/content";

/**
 * The four ways on that both Confessions pages draw (Pencil: Four ways on, hQGri on Page 14 and H2F2be on Page 14b):
 * the writing so far, the question of when the work should no longer need us, the work, and Gold.Phone. The story and
 * the question are the words of the pages they lead to; nothing here is typed in.
 */
export function confessionsWays(): { listen: Way; curiosity: Way; action: Way; art: Way } {
  const question = questionsBySlug["when-should-the-work-no-longer-need-us"];
  const goldPhone = works.find((work) => work.slug === "gold-phone");
  return {
    listen: { invite: "All the stories", title: "The writing so far.", href: "/stories" },
    curiosity: question
      ? { title: question.question, href: `/questions/${question.slug}` }
      : { title: "All the questions", href: "/questions" },
    action: { title: "The work", href: "/work" },
    art: goldPhone ? { title: goldPhone.title, href: `/art/${goldPhone.slug}` } : { title: "Come into the art.", href: "/art" },
  };
}
