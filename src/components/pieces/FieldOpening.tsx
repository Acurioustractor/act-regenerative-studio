import styles from "./field-opening.module.css";

/**
 * How a field page opens: its number in the loud face, then its name and line, the headline, the opening words and a
 * photograph (Pencil: Field opening ALEwz). Every prop is a Field's own: name, eyebrow, number, title and opening. On a
 * phone the words come first and the photograph runs the full width below them.
 */
export function FieldOpening({
  number,
  name,
  eyebrow,
  title,
  opening,
  photo,
  as: Title = "h1",
}: {
  /** "03". */
  number: string;
  /** The field's name; it leads the kicker. */
  name: string;
  /** The field's one line, without its full stop; it follows the name in the kicker. */
  eyebrow: string;
  title: string;
  opening: string;
  photo: { src: string; alt: string };
  as?: "h1" | "h2";
}) {
  return (
    <section className={styles.opening}>
      <div className={styles.text}>
        <p className={styles.number}>{number}</p>
        <p className={styles.kicker}>
          {name} · {eyebrow}
        </p>
        <Title className={styles.title}>{title}</Title>
        <p className={styles.lede}>{opening}</p>
      </div>
      <div className={styles.photo}>
        <img src={photo.src} alt={photo.alt} width={560} height={640} />
      </div>
    </section>
  );
}
