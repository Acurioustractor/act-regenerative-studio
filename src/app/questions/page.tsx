import type { Metadata } from "next";
import { FieldNotesExperience } from "@/app/prototypes/field-notes/page";
import {pageMetadata} from "@/lib/seo/site";
export const metadata:Metadata=pageMetadata({title:"Questions from the Field",description:"Questions and evolving responses from across A Curious Tractor's work.",path:"/questions"});
export default function QuestionsPage(){return <FieldNotesExperience production/>}
