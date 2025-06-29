import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { formatDistanceToNow } from "date-fns";

export default function RecentDraws({ setProgram }) {
  const [recentDraws, setRecentDraws] = useState([]);

  useEffect(() => {
    const fetchDraws = async () => {
      const snapshot = await getDocs(collection(db, "ee_rounds"));
      const data = snapshot.docs
        .map((doc) => doc.data())
        .filter((d) => d.drawDate && d.drawName)
        .sort((a, b) => new Date(b.drawDate) - new Date(a.drawDate))
        .slice(0, 10);

      setRecentDraws(data);
    };

    fetchDraws();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 p-4 w-full max-w-xs h-[400px] overflow-y-auto">
      <h2 className="text-xl font-heading font-bold text-center mb-4">
        📅 Recent Draws
      </h2>
      <div className="relative pl-4">
        <div className="absolute left-2 top-0 bottom-0 border-l-2 border-gray-300 dark:border-gray-700"></div>
        {recentDraws.map((draw, index) => (
          <button
            key={index}
            onClick={() => setProgram(draw.drawName)}
            className="relative mb-6 pl-4 text-left w-full focus:outline-none"
          >
            <span className="absolute left-[-6px] top-1 w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></span>
            <div className="font-medium hover:underline">{draw.drawName}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(draw.drawDate), { addSuffix: true })}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
