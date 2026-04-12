type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center" : "";
  const descriptionWidth = align === "center" ? "max-w-3xl" : "max-w-2xl";

  return (
    <div className={`space-y-4 ${alignment}`}>
      {eyebrow ? (
        <p className="site-eyebrow">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-[2rem] font-semibold leading-tight text-[#241c15] md:text-[2.6rem] font-[var(--font-display)]">
        {title}
      </h2>
      {description ? (
        <p className={`${descriptionWidth} text-[0.97rem] leading-7 text-[#5b4d3f] md:text-[1.02rem]`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
