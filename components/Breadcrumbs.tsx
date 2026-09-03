import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, dark }: { items: BreadcrumbItem[]; dark?: boolean }) {
  const jsonLdItems = [
    { name: "Home", url: "/" },
    ...items
      .filter((i): i is BreadcrumbItem & { href: string } => !!i.href)
      .map((i) => ({ name: i.label, url: i.href! })),
  ];

  return (
    <>
      <BreadcrumbJsonLd items={jsonLdItems} />
      <nav aria-label="Breadcrumb" className="overflow-visible py-1">
        <ol
          className={`flex flex-wrap items-center gap-x-1 gap-y-1.5 text-sm leading-5 ${
            dark ? "text-slate-400" : "text-gray-500"
          }`}
        >
          <li className="flex shrink-0 items-center">
            <Link
              href="/"
              className={`flex items-center gap-1 transition-colors ${
                dark ? "hover:text-orange-400" : "hover:text-orange-600"
              }`}
            >
              <Home className="h-4 w-4 shrink-0" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={`${item.label}-${i}`} className="flex min-w-0 max-w-full items-center gap-1">
                <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className={`shrink-0 transition-colors ${
                      dark ? "hover:text-orange-400" : "hover:text-orange-600"
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={`min-w-0 break-words font-medium ${
                      dark ? "text-slate-100" : "text-gray-900"
                    }`}
                    title={item.label}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
