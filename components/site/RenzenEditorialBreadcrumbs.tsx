import Link from "next/link";

export interface EditorialBreadcrumb {
  label: string;
  href: string;
}

export function RenzenEditorialBreadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: EditorialBreadcrumb[];
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="relative z-30 w-full px-6 pt-6 pb-2 text-[13px] text-zinc-500 sm:px-10 lg:px-14"
    >
      <ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li
              key={breadcrumb.href}
              className="flex items-center gap-1.5"
            >
              {index > 0 && (
                <span
                  className="select-none font-normal text-stone-300"
                  aria-hidden="true"
                >
                  /
                </span>
              )}
              {isLast ? (
                <span
                  className="font-semibold text-zinc-800"
                  aria-current="page"
                >
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className="font-semibold text-zinc-500 transition-colors hover:text-[#173c2c] hover:underline"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
