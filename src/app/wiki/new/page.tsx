import { redirect } from "next/navigation";

export default function NewWikiPageRedirect() {
  redirect("/wiki");
}
