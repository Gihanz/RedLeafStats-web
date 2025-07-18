import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firestore";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function UserPreferencesModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setConsent(user?.consentToEmails ?? true);
    }
  }, [user]);

  const updatePreferences = async () => {
    if (!user) return;
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const updates = { consentToEmails: consent };
      if (password) {
        await user.updatePassword(password);
        toast.success("Password updated");
      }
      await updateDoc(doc(db, "users", user.uid), updates);
      toast.success("Preferences updated");
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (pass) => {
    if (pass.length >= 12 && /[A-Z]/.test(pass) && /\d/.test(pass)) {
      return "Strong";
    } else if (pass.length >= 8) {
      return "Medium";
    } else {
      return "Weak";
    }
  };

  useEffect(() => {
    setStrength(getPasswordStrength(password));
  }, [password]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-8 text-center">User Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="text"
              value={user.email}
              readOnly
              className="w-full mt-1 p-2 bg-gray-100 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={user.fullName || ""}
              readOnly
              className="w-full mt-1 p-2 bg-gray-100 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className="w-full mt-1 p-2 border dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            {password && (
              <p
                className={`mt-1 text-sm ${
                  strength === "Strong"
                    ? "text-green-600"
                    : strength === "Medium"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                Strength: {strength}
              </p>
            )}
          </div>
          {password && (
            <div>
              <label className="block text-sm font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 p-2 border dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-600 mt-1">
                  Passwords do not match
                </p>
              )}
            </div>
          )}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mr-4"
            />
            <label className="text-sm">Subscribe to draw alerts</label>
          </div>
        </div>
        <div className="flex justify-end mt-6 gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={updatePreferences}
            disabled={loading}
            className="bg-[#26374a] hover:opacity-90 text-white px-4 py-2"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
