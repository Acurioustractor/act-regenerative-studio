import { Photo } from "./Photo";
import styles from "./article-opening.module.css";

/**
 * The top of an article (Pencil: Article opening B7ed4r; phone from Phone · 10 Article, iAFgB): the photograph, then
 * the kicker, the title, the subtitle, and who wrote it and how long it takes. There is no date, on purpose.
 * The title is the page's one h1.
 */
export function ArticleOpening({
  photo,
  kicker,
  title,
  subtitle,
  author,
  readingMinutes,
}: {
  photo: { src: string; alt: string };
  /** What kind of piece it is and where it belongs, e.g. "Editorial · Across ACT". */
  kicker?: string;
  title: string;
  subtitle?: string;
  author?: string;
  readingMinutes?: number;
}) {
  const meta = [author, readingMinutes ? `${readingMinutes} min read` : undefined].filter(Boolean).join(" · ");

  return (
    <div className={styles.opening}>
      <Photo src={photo.src} alt={photo.alt} priority className={styles.photo} />
      <div className={styles.text}>
        {kicker && <p className={styles.kicker}>{kicker}</p>}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {meta && <p className={styles.meta}>{meta}</p>}
      </div>
    </div>
  );
}
