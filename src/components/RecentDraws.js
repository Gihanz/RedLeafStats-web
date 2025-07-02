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
        .slice(0, 20);

      setRecentDraws(data);
    };

    fetchDraws();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 w-full h-[400px]">
      <h2 className="text-xl font-heading font-bold text-center mb-4">
        📅 Recent Draws
      </h2>

      {/* Scrollable timeline container */}
      <div className="h-[330px] overflow-y-auto pr-2">
        <div className="pl-4 relative">
          {/* Vertical timeline line as part of flow */}
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700"></div>

          {recentDraws.map((draw, index) => (
            <div key={index} className="relative mb-6">
              {/* Dot */}
              <span className="absolute left-[-10px] top-1 w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></span>

              {/* Button content */}
              <button
                onClick={() => setProgram(draw.drawName)}
                className="text-left w-full pl-2 focus:outline-none"
              >
                <div className="font-medium hover:underline">{draw.drawName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(draw.drawDate), { addSuffix: true })}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>

  );

}
