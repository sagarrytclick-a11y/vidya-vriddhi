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
    ...items.filter((i): i is BreadcrumbItem & { href: string } => !!i.href).map((i) => ({ name: i.label, url: i.href! })),
  ];

  return (
    <>
      <BreadcrumbJsonLd items={jsonLdItems} />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className={`flex flex-wrap items-center gap-1 text-sm ${dark ? "text-slate-400" : "text-gray-500"}`}>
          <li>
            <Link href="/" className={`flex items-center gap-1 transition-colors ${dark ? "hover:text-orange-400" : "hover:text-orange-600"}`}>
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4" />
              {item.href ? (
                <Link href={item.href} className={`transition-colors ${dark ? "hover:text-orange-400" : "hover:text-orange-600"}`}>
                  {item.label}
                </Link>
              ) : (
                <span className={`font-medium truncate max-w-[200px] ${dark ? "text-slate-100" : "text-gray-900"}`}>{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
