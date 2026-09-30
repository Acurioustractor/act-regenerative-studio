import type {Metadata} from "next";
import { questions, questionsBySlug } from "@/content";
import {QuestionExperience} from "@/app/prototypes/field-notes/[slug]/page";
export const dynamicParams=false;
export function generateStaticParams(){return questions.map(({slug})=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const note=questionsBySlug[slug];return {title:note?.question||"Question from the Field",description:note?.invitation,alternates:{canonical:`/questions/${slug}`}}}
export default async function QuestionPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <QuestionExperience slug={slug} production/>}
