"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark } from "./Logo";
import { SearchButton } from "./SearchDialog";
import { ThemeToggle } from "./ThemeToggle";

export const navItems = [
  { href: "/mapa", label: "Mapa mental" },
  { href: "/roteiro", label: "Roteiro" },
  { href: "/quiz", label: "Quiz" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/simuladores", label: "Simuladores" },
  { href: "/revisao", label: "Revisão" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [openFor, setOpenFor] = useState<string | null>(null);
  // O menu fecha sozinho ao navegar (fica associado à rota em que foi aberto).
  const open = openFor === pathname;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenFor(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4">
        <Link href="/" className="mr-auto flex min-w-0 items-center gap-2.5 rounded-lg" aria-label="Início — Radiografia Panorâmica">
          <LogoMark className="size-8 shrink-0" />
          <span className="truncate font-display text-[0.95rem] font-bold tracking-tight text-fg">
            Radiografia Panorâmica
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-accent-soft text-accent-strong"
                      : "text-muted hover:bg-surface-2 hover:text-fg"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <SearchButton />
        <ThemeToggle />
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg lg:hidden"
          aria-expanded={open}
          aria-controls="menu-movel"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpenFor(open ? null : pathname)}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav id="menu-movel" aria-label="Principal (celular)" className="border-t border-line bg-bg lg:hidden">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-1 p-3">
            <li className="col-span-2">
              <Link
                href="/"
                onClick={() => setOpenFor(null)}
                aria-current={pathname === "/" ? "page" : undefined}
                className={`block rounded-lg px-3 py-3 text-sm font-medium ${
                  pathname === "/" ? "bg-accent-soft text-accent-strong" : "text-fg hover:bg-surface-2"
                }`}
              >
                Início
              </Link>
            </li>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpenFor(null)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block rounded-lg px-3 py-3 text-sm font-medium ${
                    isActive(item.href) ? "bg-accent-soft text-accent-strong" : "text-fg hover:bg-surface-2"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
