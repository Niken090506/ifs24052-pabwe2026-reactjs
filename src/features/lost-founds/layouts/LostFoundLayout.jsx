import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import apiHelper from "../../../helpers/apiHelper";
import { asyncSetIsAuthLogout } from "../../auth/states/action";
import { asyncSetProfile } from "../../users/states/action";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

export default function LostFoundLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.profile);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hasToken = Boolean(apiHelper.getAccessToken());

  useEffect(() => {
    if (!hasToken) {
      return;
    }
    dispatch(asyncSetProfile()).then((ok) => {
      if (!ok) {
        apiHelper.putAccessToken("");
        navigate("/auth/login", { replace: true });
      }
    });
  }, [hasToken, dispatch, navigate]);

  async function handleLogout() {
    await dispatch(asyncSetIsAuthLogout());
    navigate("/auth/login", { replace: true });
  }

  if (!hasToken) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-indigo-800"
      >
        Lewati ke konten utama
      </a>
      <NavbarComponent
        profile={profile}
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((value) => !value)}
        onLogout={handleLogout}
      />
      <div className="flex">
        <SidebarComponent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}