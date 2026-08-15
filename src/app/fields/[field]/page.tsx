import { notFound } from "next/navigation";
import { FieldStoryPrototype } from "@/app/prototypes/living-field/field-story";
import { FieldWriting } from "@/components/fields/FieldWriting";
import { FieldAuthorityNote } from "@/components/fields/FieldAuthorityNote";
import { livingFields, livingFieldsById } from "@/data/living-field";
import { pageMetadata } from "@/lib/seo/site";

export function generateStaticParams(){ return livingFields.map(({id})=>({field:id})); }
export async function generateMetadata({params}:{params:Promise<{field:string}>}){const {field}=await params;const story=livingFieldsById[field as keyof typeof livingFieldsById];return story?pageMetadata({title:story.name,description:story.opening,path:`/fields/${field}`,image:{url:story.image,alt:story.name}}):{}}

export default async function FieldPage({params}:{params:Promise<{field:string}>}){
  const {field}=await params;
  const story=livingFieldsById[field as keyof typeof livingFieldsById];
  if(!story)notFound();
  return (
    <>
      <FieldStoryPrototype story={story} production/>
      {/* Composed here rather than inside FieldStoryPrototype: that component is
          "use client" and shared with /prototypes/living-field, while this reads
          the server-only editorial snapshot. */}
      <FieldWriting fieldId={story.id} fieldName={story.name}/>
      {/* Every field page describes work alongside Elders and communities, so
          every field page says whose organisation this is. /goods carried this
          and 307s to /fields/goods in production, which left it unsaid where it
          is actually read. */}
      <FieldAuthorityNote/>
    </>
  );
}
