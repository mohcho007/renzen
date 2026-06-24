import Link from "next/link";

export interface DynamicBreadcrumb {
  label: string;
  href: string;
}

export function DynamicBreadcrumbs({
  breadcrumbs,
  updatedText,
}: {
  breadcrumbs: DynamicBreadcrumb[];
  updatedText: string;
}) {
  return (
    <div className="w-full px-6 md:px-12 pt-6 pb-2 text-[13px] text-zinc-500 font-sans relative z-30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 flex-wrap list-none p-0 m-0">
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <li
                key={breadcrumb.href}
                className="flex items-center gap-1.5"
              >
                {index > 0 && (
                  <span
                    className="text-stone-300 font-normal select-none"
                    aria-hidden="true"
                  >
                    /
                  </span>
                )}
                {isLast ? (
                  <span
                    className="text-zinc-800 font-semibold"
                    aria-current="page"
                  >
                    {breadcrumb.label}
                  </span>
                ) : (
                  <Link
                    href={breadcrumb.href}
                    className="hover:text-primary hover:underline transition-colors font-semibold text-zinc-500"
                  >
                    {breadcrumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 select-none">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        <span>{updatedText}</span>
      </div>
    </div>
  );
}
