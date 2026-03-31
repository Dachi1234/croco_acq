export function articleJsonLd(params: {
  title: string;
  description: string;
  slug: string;
  locale: string;
  published_at: string | null;
  cover_image: string | null;
  siteUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    image: params.cover_image || undefined,
    datePublished: params.published_at || undefined,
    url: `${params.siteUrl}/${params.locale}/blog/${params.slug}`,
    publisher: {
      "@type": "Organization",
      name: "Crocobet",
      url: params.siteUrl,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
