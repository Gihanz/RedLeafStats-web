import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import ThemeToggle from "./ThemeToggle";

export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition-colors">
      <div className="flex justify-between items-center px-6 py-3 bg-white dark:bg-gray-800 shadow">
        <div className="flex items-center gap-2">
          <img
            src="Canada-flag-logo.png"
            alt="Canada Logo"
            className="h-6 sm:h-8"
          />
        <h1 className="text-xl font-heading font-bold text-center px-5">RedLeaf Stats</h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="text-sm hidden sm:block">Hi {user?.fullName}!</div>
          <button
            onClick={handleLogout}
            className="bg-[#26374a] hover:opacity-90 text-white px-3 py-1 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
      <main className="p-6">{children}</main>
    </div>
  );
}
