import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import {
  IconChartBar,
  IconClipboardList,
  IconUser,
  IconUsers,
  IconX,
} from "@tabler/icons-react";

const MENU = [
  { label: "Laporan", to: "/", icon: IconClipboardList },
  { label: "Statistik", to: { pathname: "/", hash: "#statistik" }, icon: IconChartBar },
  { label: "Pengguna", to: "/users", icon: IconUsers },
  { label: "Profil Saya", to: "/profile", icon: IconUser },
];

function isActive(item, location) {
  if (item.label === "Statistik") {
    return location.pathname === "/" && location.hash === "#statistik";
  }
  if (item.label === "Laporan") {
    return (
      (location.pathname === "/" && location.hash !== "#statistik") ||
      location.pathname.startsWith("/lost-founds/")
    );
  }
  return location.pathname === item.to;
}

export default function SidebarComponent({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Tutup menu navigasi"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
        />
      ) : null}
      <aside
        id="sidebar-navigation"
        className={clsx(
          "z-50 w-64 shrink-0 border-r border-slate-200 bg-white p-4",
          isOpen ? "fixed inset-y-0 left-0 block lg:static" : "hidden lg:block"
        )}
      >
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <span className="font-bold text-slate-900">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="rounded-lg p-1.5 hover:bg-slate-100"
          >
            <IconX size={20} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Navigasi utama">
          <ul className="space-y-1">
            {MENU.map((item) => {
              const active = isActive(item, location);
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold",
                      active
                        ? "bg-indigo-100 text-indigo-900"
                        : "text-slate-800 hover:bg-slate-100"
                    )}
                  >
                    <Icon size={20} aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}