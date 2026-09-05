"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    label: "Tableau de bord",
    href: "/admin",
    icon: "▦",
  },
  {
    label: "Services",
    href: "/admin/services",
    icon: "◆",
  },
  {
    label: "Tarifs",
    href: "/admin/pricing",
    icon: "$",
  },
  {
    label: "Demandes",
    href: "/admin/orders",
    icon: "✉",
  },
  {
    label: "Paramètres",
    href: "/admin/settings",
    icon: "⚙",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-[280px] shrink-0 border-r border-white/10 bg-[#031f36]">
      <div className="flex h-full flex-col">
        {/* Brand */}
        <div className="px-5 pt-5">
          <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-5 py-5">
            <Link
              href="/admin"
              className="block"
              style={{
                color: "#ffffff",
                textDecoration: "none",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#d4af37] font-black text-[#09243a]">
                  MH
                </div>

                <div className="min-w-0">
                  <div className="truncate text-[15px] font-black tracking-tight text-white">
                    Marc Houle
                  </div>

                  <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                    Administration
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-7 px-5">
          <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
            Navigation
          </p>

          <nav className="space-y-2">
            {items.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-[16px] px-3 py-3.5 transition ${
                    isActive
                      ? "admin-sidebar-link-active"
                      : "admin-sidebar-link"
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-[12px] text-sm font-black ${
                      isActive
                        ? "bg-[#eaf5ff] text-[#0868ad]"
                        : "bg-white/[0.06] text-white/70"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span className="flex-1 text-sm font-bold">
                    {item.label}
                  </span>

                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-[#d4af37]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="mt-auto px-5 pb-5 pt-8">
          <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm font-bold text-white">
              Site public
            </p>

            <p className="mt-1 text-xs leading-5 text-white/45">
              Retournez voir les changements directement sur le site.
            </p>

            <Link
              href="/"
              className="admin-site-button mt-4 flex items-center justify-between rounded-[13px] px-4 py-3 text-sm font-black"
            >
              <span>Voir le site</span>
              <span>↗</span>
            </Link>
          </div>

          <div className="mt-4 flex items-center gap-3 px-2 py-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#d4af37] text-xs font-black text-[#08263e]">
              MH
            </div>

            <div>
              <div className="text-xs font-bold text-white">
                Marc Houle
              </div>

              <div className="mt-0.5 text-[11px] text-white/40">
                Administrateur
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}