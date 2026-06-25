import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getArticleBySlug, articles } from '../../../data/articles';
import { constructMetadata } from '../../../lib/seo';
import Breadcrumbs from '../../../components/Breadcrumbs';
import PriceCalculator from '../../../components/PriceCalculator';
import CTA from '../../../components/CTA';
import SchemaMarkup from '../../../components/SchemaMarkup';
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateWebPageSchema,
} from '../../../lib/schema';
import { getAbsoluteUrl, getArticleUrl } from '../../../lib/urls';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Pre-generate paths for static rendering
 */
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

/**
 * Page Metadata
 */
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

export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const absoluteUrl = getAbsoluteUrl(getArticleUrl(article.slug));

  // Build JSON-LD schemas
  const breadcrumbItems = [
    { name: 'Artikler', url: getAbsoluteUrl('/artikler/') },
    { name: article.title, url: absoluteUrl }
  ];
  
  const webPageSchema = generateWebPageSchema(
    article.seoTitle ?? article.title,
    article.seoDescription ?? article.excerpt,
    absoluteUrl
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

      <main className="min-h-screen bg-slate-50/50 pb-20">
        {/* Breadcrumb container */}
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
          <Breadcrumbs items={[
            { label: 'Artikler', url: '/artikler/' },
            { label: article.title }
          ]} />
        </div>

        {/* Article Content Layout */}
        <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Main Article Content */}
            <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 sm:p-10 lg:col-span-8">
              {/* Meta information */}
              <div className="flex items-center space-x-4 text-xs text-slate-400 font-semibold mb-6">
                <span>Udgivet: {article.publishedAt}</span>
                <span>•</span>
                <span>Af {article.author}</span>
                <span>•</span>
                <span>Læsetid: {article.readTime}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-4.5xl leading-tight mb-8">
                {article.title}
              </h1>

              {article.image ? (
                <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                  <Image
                    src={article.image}
                    alt={article.imageAlt ?? article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                </div>
              ) : null}

              {/* Excerpt */}
              <p className="text-base text-slate-500 font-medium leading-relaxed italic mb-8 border-l-4 border-emerald-500 pl-4 bg-slate-50/50 py-3 pr-3 rounded-r-xl">
                {article.excerpt}
              </p>

              {/* Body Content */}
              <div 
                className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm sm:text-base space-y-6 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-slate-900 [&>h1]:mt-8 [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-slate-800 [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-slate-800 [&>h3]:mt-8 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>blockquote]:border-l-4 [&>blockquote]:border-slate-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>p]:mt-2 [&_a]:text-emerald-600 [&_a]:font-medium [&_a]:underline-offset-2 [&_a:hover]:text-emerald-500 [&_table]:w-full [&_table]:text-sm [&_th]:bg-slate-50 [&_th]:px-3 [&_th]:py-2 [&_td]:border-t [&_td]:border-slate-100 [&_td]:px-3 [&_td]:py-2"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </article>

            {/* Sidebar with calculator widget */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="sticky top-28">
                <PriceCalculator title="Beregn din pris nu" showIntroText={true} />
                <div className="mt-6 rounded-2xl bg-white p-6 border border-slate-100 shadow-sm">
                  <h4 className="font-bold text-slate-800">Har du spørgsmål?</h4>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                    Hvis du vil vide mere om servicefradrag eller flytterengøring, er du altid velkommen til at kontakte os.
                  </p>
                  <Link 
                    href="/faq/" 
                    className="mt-4 inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-500"
                  >
                    <span>Læs vores FAQ</span>
                    <svg className="ml-1 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* CTA section */}
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <CTA />
        </section>
      </main>
    </>
  );
}
