import type { Metadata } from "next";
import { StoriesExperience } from "@/app/prototypes/stories/page";
import {pageMetadata} from "@/lib/seo/site";
export const metadata:Metadata=pageMetadata({title:"Stories across the field",description:"Writing, images and films carried with consent from across A Curious Tractor's projects.",path:"/stories",image:{url:"/media/field-stills/empathy-ledger-community-story.jpg",alt:"A community storytelling conversation"}});
export const revalidate=60;
export default async function StoriesPage(){return <StoriesExperience production/>}
