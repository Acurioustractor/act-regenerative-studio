import styles from "./byline.module.css";

/**
 * Who wrote the piece, and which fields it connects to (Pencil: Byline Q9FnS): a rule, the writer's initial in an ink
 * square, their name, the fields in one line. It renders only what it is given; leave `fields` out for no second half.
 */
export function Byline({ name, fields }: { name: string; fields?: string[] }) {
  const initial = Array.from(name.trim())[0]?.toUpperCase();

  return (
    <div className={styles.byline}>
      <p className={styles.label}>Written by</p>
      <div className={styles.who}>
        <span aria-hidden="true" className={styles.initial}>
          {initial}
        </span>
        <p className={styles.name}>{name}</p>
      </div>
      {fields && fields.length > 0 && (
        <>
          <p className={styles.label}>Connected fields</p>
          <p className={styles.fields}>{fields.join(" · ")}</p>
        </>
      )}
    </div>
  );
}
