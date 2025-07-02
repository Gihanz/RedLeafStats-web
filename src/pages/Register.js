import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingButton from "../components/LoadingButton";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  
  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    toast.loading("Creating account...");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.dismiss();
      toast.success("Registered and logged in!");
      navigate("/dashboard");
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
      className="max-w-sm mx-auto mt-20 space-y-4 font-body bg-white dark:bg-gray-900 p-6 shadow-md"
    >
      {/* Heading */}
      <h1 className="text-2xl font-heading font-bold text-center text-[#26374a] dark:text-white">
        Register
      </h1>

      {/* Email Input */}
      <input
        type="email"
        autoComplete="email"
        required
        className="w-full p-2 border bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password Input with Toggle */}
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

      {/* Password Strength Meter */}
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

      {/* Confirm Password Input with Toggle */}
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


      {/* Submit Button */}
      <LoadingButton
        loading={loading}
        type="submit"
        disabled={password !== confirmPassword}
        className="w-full bg-[#26374a] hover:opacity-90 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Registering..." : "Register"}
      </LoadingButton>

      {/* Redirect to Login */}
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
        <h1 className="text-xl font-heading font-bold text-center px-5 dark:text-gray-300">RedLeaf Stats</h1>
        </div>
    </form>

  );
}
