import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IconChevronDown, IconMenu2 } from "@tabler/icons-react";
import Avatar from "../../../components/Avatar";

export default function NavbarComponent({ profile, isSidebarOpen, onToggleSidebar, onLogout }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handlePointer(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function handleKey(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Buka menu navigasi"
            aria-expanded={isSidebarOpen}
            aria-controls="sidebar-navigation"
            className="rounded-lg p-2 text-slate-800 hover:bg-slate-100 lg:hidden"
          >
            <IconMenu2 size={24} aria-hidden="true" />
          </button>
          <Link to="/" className="flex items-center gap-2.5 font-bold text-slate-900">
            <img src="/logo.svg" alt="" width={32} height={32} />
            <span>Lost &amp; Founds</span>
          </Link>
        </div>

        <div ref={wrapperRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="profile-dropdown"
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-slate-100"
          >
            <Avatar name={profile?.name} photo={profile?.photo} size="sm" />
            <span className="hidden max-w-40 truncate text-sm font-semibold text-slate-900 sm:inline">
              {profile?.name ?? "Pengguna"}
            </span>
            <IconChevronDown size={16} aria-hidden="true" />
            <span className="sr-only">Menu akun</span>
          </button>
          {open ? (
            <div
              id="profile-dropdown"
              className="absolute right-0 mt-2 w-64 rounded-xl bg-white p-2 shadow-lg ring-1 ring-slate-200"
            >
              <div className="border-b border-slate-200 px-3 py-2">
                <p className="text-xs text-slate-700">Masuk sebagai</p>
                <p className="truncate text-sm font-semibold text-slate-900">
                  {profile?.email ?? profile?.name ?? "Pengguna"}
                </p>
              </div>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-lg px-3 py-2 text-sm text-slate-800 hover:bg-slate-100"
              >
                Profil saya
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-700 hover:bg-red-50"
              >
                Keluar
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}