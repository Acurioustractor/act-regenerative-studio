import type { Metadata } from "next";
import { LivingFieldPrototype } from "@/app/prototypes/living-field/prototype";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "A Curious Tractor | Art, stories and work in the field",
  description: "Come into the art, then follow it into A Curious Tractor's work across story, justice, making and place.",
  path: "/",
  image:{url:"/media/field-stills/contained-aerial.jpg",alt:"CONTAINED artwork seen from above"},
});

export default function HomePage() { return <LivingFieldPrototype production />; }
