import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import ThemeToggle from "./ThemeToggle";
import UserPreferencesModal from "./UserPreferencesModal";

const MENU_ITEMS = [
  { id: "EE", label: "Express Entry", path: "/dashboard_ee" },
  { id: "OINP", label: "OINP", path: "/dashboard_oinp" },
  { id: "BC_PNP", label: "BC PNP", path: "/dashboard_bc_pnp" },
  { id: "SINP", label: "SINP", path: "/dashboard_sinp" },
  { id: "AAIP", label: "AAIP", path: "/dashboard_aaip" },
  { id: "MPNP", label: "MPNP", path: "/dashboard_mpnp" },
];

export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPrefs, setShowPrefs] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isGuest = !user || user.isGuest || !user.fullName;
  const [activeMenu, setActiveMenu] = useState("EE");

  useEffect(() => {
    const activeItem = MENU_ITEMS.find((item) =>
      location.pathname.startsWith(item.path)
    );
    setActiveMenu(activeItem ? activeItem.id : "EE");
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out");
    navigate("/");
  };

  const openPrefs = () => {
    if (!isGuest) setShowPrefs(true);
  };

  const onMenuClick = (id, path) => {
    if (id === activeMenu) return;
    setActiveMenu(id);
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center px-4 md:px-6 py-3 bg-white dark:bg-gray-800 shadow relative">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-2">
          <img
            src="Canada-flag-logo.png"
            alt="Canada Logo"
            className="h-6 sm:h-8 hidden sm:block"
          />
          <h1 className="text-xl font-heading font-bold text-center sm:px-5 px-0 pr-5">
            RedLeaf Stats
          </h1>
        </div>

        {/* Center: Navigation Menu (Desktop) */}
        <div className="hidden md:flex flex-grow justify-center">
          <nav className="flex space-x-4">
            {MENU_ITEMS.map(({ id, label, path }) => (
              <button
                key={id}
                onClick={() => onMenuClick(id, path)}
                className={`px-4 py-2  text-sm font-semibold focus:outline-none transition-colors ${
                  activeMenu === id
                    ? "bg-[#26374a] text-white"
                    : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
                }`}
                aria-current={activeMenu === id ? "page" : undefined}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Theme + User + Logout (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          <span
            className={`text-sm underline ${
              isGuest ? "cursor-default" : "cursor-pointer"
            }`}
            onClick={openPrefs}
            title={isGuest ? "Sign in to manage preferences" : "Open Preferences"}
          >
            Hi {isGuest ? "Guest User" : user.fullName}!
          </span>

          <button
            onClick={handleLogout}
            className="bg-[#26374a] hover:opacity-90 text-white px-3 py-1 text-sm"
          >
            Logout
          </button>
        </div>

        {/* Mobile: Hamburger + Theme Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
          >
            <svg
              className="h-6 w-6 text-gray-700 dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <nav className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-50">
            {MENU_ITEMS.map(({ id, label, path }) => (
              <button
                key={id}
                onClick={() => onMenuClick(id, path)}
                className={`w-full text-left px-4 py-2 text-sm font-semibold focus:outline-none transition-colors ${
                  activeMenu === id
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {label}
              </button>
            ))}

            <div className="border-t border-gray-300 dark:border-gray-700 mt-1 pt-2 px-4">
              <span
                className={`block mb-2 text-sm underline ${
                  isGuest ? "cursor-default" : "cursor-pointer"
                }`}
                onClick={openPrefs}
              >
                Hi {isGuest ? "Guest User" : user.fullName}!
              </span>

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#26374a] hover:opacity-90 text-white px-3 py-1 text-sm rounded mb-4"
              >
                Logout
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Main Content */}
      <main className="p-6">{children}</main>

      {/* Preferences Modal */}
      {!isGuest && showPrefs && (
        <UserPreferencesModal
          isOpen={showPrefs}
          onClose={() => setShowPrefs(false)}
        />
      )}
    </div>
  );
}
