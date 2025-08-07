import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../components/LoadingButton";
import ResetPasswordModal from "../components/ResetPasswordModal";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard_ee");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsSuccess(true);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard_ee"), 1000);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setMessage("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setMessage("Incorrect password.");
      } else {
        setMessage("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setMessage("");
    setIsSuccess(false);
    try {
      await signInAnonymously(auth);
      setIsSuccess(true);
      setMessage("Logged in as Guest! Redirecting...");
      setTimeout(() => navigate("/dashboard_ee"), 1000);
    } catch {
      setMessage("Guest login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage("");
    setIsSuccess(false);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      setIsSuccess(true);
      setMessage("Google login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard_ee"), 1000);
    } catch {
      setMessage("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleLogin}
        className="max-w-sm mx-auto mt-2 sm:mt-20 space-y-4 font-body bg-white dark:bg-gray-900 p-6 shadow-md"
      >
        <h1 className="text-2xl font-heading font-bold text-center text-[#26374a] dark:text-white">
          Login
        </h1>

        {message && (
          <div
            className={`text-center text-sm px-3 py-2 rounded ${
              isSuccess ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <input
          type="email"
          autoComplete="email"
          required
          className="w-full p-2 border bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="w-full p-2 border bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-600 dark:text-gray-300"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <LoadingButton
          loading={loading}
          type="submit"
          className="w-full bg-[#26374a] hover:opacity-90 text-white px-4 py-2"
        >
          {loading ? "Logging in..." : "Login"}
        </LoadingButton>

        <div className="text-right">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <div className="flex items-center my-4 py-6">
          <hr className="flex-grow border-gray-300 dark:border-gray-700" />
          <span className="mx-2 text-sm text-gray-500 dark:text-gray-400">or</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-700" />
        </div>

        <div className="flex flex-col space-y-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2"
          >
            Continue with Google
          </button>
          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2"
          >
            Continue as Guest
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Register
          </a>
        </p>

        <div className="flex items-center justify-center gap-2 pt-12">
          <img
            src="Canada-flag-logo.png"
            alt="Canada Logo"
            className="h-6 sm:h-8"
          />
          <h1 className="text-xl font-heading font-bold text-center px-5 dark:text-gray-300">
            RedLeaf Stats
          </h1>
        </div>

        <div className="w-full text-center text-xs text-gray-500 dark:text-gray-400 px-4 pb-3 pt-5">
          RedLeaf Stats is a powerful web app that visualizes Canadian Express Entry immigration data, helping users track CRS score trends, analyze draw statistics, and stay updated with official IRCC news. The app supports features like dynamic chart filtering, CRS heatmaps, personal checklists, and automatic email alerts when new draws occur.
        </div>
      </form>

      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />
    </>
  );
}
