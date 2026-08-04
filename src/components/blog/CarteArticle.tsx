import Image from "next/image";
import Link from "next/link";
import { Fleche } from "@/components/ui/section";
import { libelleTheme } from "@/content/schemas/blog";
import type { ArticleRendu } from "@/content/schemas/blog";

/** Date lisible, jamais dérivée d'un fuseau : la chaîne du JSON est déjà locale. */
export function dateLisible(iso: string): string {
  const [annee, mois, jour] = iso.split("-").map(Number);
  return new Date(Date.UTC(annee, mois - 1, jour)).toLocaleDateString("fr-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function CarteArticle({
  article,
  retard = 0,
  compacte = false,
}: {
  article: ArticleRendu;
  retard?: number;
  compacte?: boolean;
}) {
  return (
    <article data-reveal data-reveal-delay={retard} className="group flex h-full flex-col">
      <Link href={`/blog/${article.slug}`} className="flex h-full flex-col">
        <div
          className={`relative overflow-hidden rounded-2xl bg-beew-noir/5 ${
            compacte ? "aspect-[16/10]" : "aspect-[16/11]"
          }`}
        >
          <Image
            src={article.image}
            alt=""
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        </div>

        <p className="mt-6 text-[10px] tracking-[0.25em] opacity-40 uppercase">
          {libelleTheme(article.theme)} · {article.minutesLecture} min
        </p>

        <h3
          className={`mt-3 font-semibold tracking-tight ${
            compacte ? "text-lg" : "text-[clamp(1.2rem,1.8vw,1.55rem)]"
          }`}
        >
          {article.title}
        </h3>

        <p className="mt-4 text-sm leading-relaxed opacity-60">{article.excerpt}</p>

        <span className="mt-auto flex items-center gap-2 pt-7 text-[11px] tracking-[0.2em] uppercase">
          Lire l&apos;article
          <Fleche />
        </span>
      </Link>

      <time dateTime={article.publishedAt} className="mt-4 text-[11px] opacity-40">
        {dateLisible(article.publishedAt)}
      </time>
    </article>
  );
}
