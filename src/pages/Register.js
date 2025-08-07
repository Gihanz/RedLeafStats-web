import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingButton from "../components/LoadingButton";
import { setUserProfile } from "../lib/firestore";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    setLoading(true);
    toast.loading("Creating account...");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setUserProfile(user.uid, {
        fullName: fullName.trim(),
        email: email.trim(),
        consentToEmails: consent,
      });

      toast.dismiss();
      toast.success("Registered and logged in!");
      navigate("/dashboard_ee");
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="max-w-sm mx-auto mt-2 sm:mt-20 space-y-4 font-body bg-white dark:bg-gray-900 p-6 shadow-md"
    >
      <h1 className="text-2xl font-heading font-bold text-center text-[#26374a] dark:text-white">
        Register
      </h1>

      <input
        type="text"
        autoComplete="name"
        required
        className="w-full p-2 border bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

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
          autoComplete="new-password"
          required
          className="w-full p-2 border bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 pr-10"
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

      {password && (
        <div className="text-sm">
          <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded">
            <div
              className={`h-2 rounded transition-all duration-300 ${
                password.length < 6
                  ? "w-1/4 bg-red-500"
                  : password.length < 10
                  ? "w-2/4 bg-yellow-500"
                  : "w-full bg-green-500"
              }`}
            />
          </div>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {password.length < 6
              ? "Too short"
              : password.length < 10
              ? "Moderate"
              : "Strong"}
          </p>
        </div>
      )}

      <div className="relative">
        <input
          type={showConfirm ? "text" : "password"}
          required
          className="w-full p-2 border bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 pr-10"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-600 dark:text-gray-300"
        >
          {showConfirm ? "Hide" : "Show"}
        </button>
      </div>

      <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 pb-8 pt-3">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="form-checkbox h-4 w-4 text-blue-600"
        />
        <span>
          I agree to receive email notifications.
        </span>
      </label>

      <LoadingButton
        loading={loading}
        type="submit"
        disabled={password !== confirmPassword}
        className="w-full bg-[#26374a] hover:opacity-90 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Registering..." : "Register"}
      </LoadingButton>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Already have an account?{" "}
        <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Login
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
  );
}
