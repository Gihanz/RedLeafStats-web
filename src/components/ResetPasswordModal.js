import { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";

export default function ResetPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    toast.loading("Sending reset email...");
    try {
      await sendPasswordResetEmail(auth, email);
      toast.dismiss();
      toast.success("Password reset email sent!");
      setSent(true);
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
    } finally {
      setSending(false);
    }
  };

  // Auto-close the modal after success
  useEffect(() => {
    if (sent) {
      const timer = setTimeout(() => {
        onClose();
        setEmail("");
        setSent(false);
      }, 2000); // close after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [sent, onClose]);

  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md max-w-sm w-full relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Reset Password
        </h2>

        {sent ? (
          <p className="text-[#26374a] dark:text-gray-400">
            Check your inbox for the password reset link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-[#26374a] hover:opacity-90 text-white py-2 rounded disabled:opacity-70"
            >
              {sending ? "Sending..." : "Send Reset Email"}
            </button>
          </form>
        )}

        {/* Only show close button if not sending */}
        {!sending && (
          <button
            onClick={onClose}
            className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
