import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArticlePage } from "@/components/artikler/ArticlePage";
import { getArticleBySlug, articles } from "@/data/articles";
import { constructMetadata } from "@/lib/seo";
import SchemaMarkup from "@/components/SchemaMarkup";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateWebPageSchema,
} from "@/lib/schema";
import { getAbsoluteUrl, getArticleUrl } from "@/lib/urls";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);

  if (!article) {
    return {};
  }

  const meta = constructMetadata({
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    path: getArticleUrl(article.slug),
    indexable: article.indexable,
  });

  if (article.image) {
    return {
      ...meta,
      openGraph: {
        ...meta.openGraph,
        type: "article",
        images: [
          {
            url: article.image,
            alt: article.imageAlt ?? article.title,
          },
        ],
      },
      twitter: {
        ...meta.twitter,
        images: [article.image],
      },
    };
  }

  return meta;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const absoluteUrl = getAbsoluteUrl(getArticleUrl(article.slug));

  const breadcrumbItems = [
    { name: "Artikler", url: getAbsoluteUrl("/artikler/") },
    { name: article.title, url: absoluteUrl },
  ];

  const webPageSchema = generateWebPageSchema(
    article.seoTitle ?? article.title,
    article.seoDescription ?? article.excerpt,
    absoluteUrl,
  );
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  const articleSchema = generateArticleSchema({
    title: article.title,
    description: article.seoDescription ?? article.excerpt,
    url: absoluteUrl,
    datePublished: article.publishedAt,
    image: article.image,
    imageAlt: article.imageAlt,
  });

  return (
    <>
      <SchemaMarkup schema={[webPageSchema, breadcrumbSchema, articleSchema]} />
      <ArticlePage article={article} />
    </>
  );
}
