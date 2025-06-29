import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingButton from "../components/LoadingButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Logging in...");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.dismiss();
      toast.success("Login successful!");
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
      onSubmit={handleLogin}
      className="max-w-sm mx-auto mt-20 space-y-4 font-body bg-white dark:bg-gray-900 p-6 shadow-md"
    >
      <h1 className="text-2xl font-heading font-bold text-center text-[#26374a] dark:text-white">
        Login
      </h1>

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

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Don’t have an account?{" "}
        <a
          href="/register"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Register
        </a>
      </p>
    </form>



      
  );
}
