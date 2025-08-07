import { useState, useEffect } from "react";
import useOINPRounds from "../../hooks/useOINPRounds";

export default function PhDGraduateStrmDraws() {
  const { rounds, latestYear, loading } = useOINPRounds({
    filterByStream: "PhD Graduate stream",
  });

  const [activeYear, setActiveYear] = useState(null);

  // Group draws by year
  const drawsByYear = rounds.reduce((acc, round) => {
    const year = String(round.year);
    if (!acc[year]) acc[year] = [];
    acc[year].push(round);
    return acc;
  }, {});

  // Set default selected year
  useEffect(() => {
    if (latestYear) {
      setActiveYear(String(latestYear));
    }
  }, [latestYear]);

  const years = Object.keys(drawsByYear).sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="p-4 text-gray-600 dark:text-gray-300">
        Loading draws...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-6">PhD Graduate Stream</h1>

      {/* Year Tabs */}
      <div className="mb-4 border-b flex space-x-4 overflow-x-auto">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setActiveYear(year)}
            className={`py-2 px-4 text-sm font-medium transition ${
              activeYear === year
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 dark:text-gray-300 hover:text-blue-600"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Table */}
      {activeYear && drawsByYear[activeYear]?.length > 0 && (
        <>
          <h2 className="font-semibold text-gray-800 dark:text-white mb-4">
            Draws for {activeYear}
          </h2>
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-700 text-left">
              <tr>
                <th className="px-4 py-2 border dark:border-gray-600">Date Issued</th>
                <th className="px-4 py-2 border dark:border-gray-600">Profiles Created</th>
                <th className="px-4 py-2 border dark:border-gray-600">Invitations Issued</th>
                <th className="px-4 py-2 border dark:border-gray-600">Score Range</th>
                <th className="px-4 py-2 border dark:border-gray-600">Notes</th>
              </tr>
            </thead>
            <tbody>
              {drawsByYear[activeYear].map((draw) => (
                <tr
                  key={draw.id}
                  className="border-t even:bg-gray-50 dark:even:bg-gray-800 dark:border-gray-600"
                >
                  <td className="px-4 py-2 border dark:border-gray-600">{draw.date_issued}</td>
                  <td className="px-4 py-2 border dark:border-gray-600">{draw.date_profiles_created}</td>
                  <td className="px-4 py-2 border dark:border-gray-600">{draw.number_of_invitations_issued}</td>
                  <td className="px-4 py-2 border dark:border-gray-600">{draw.score_range}</td>
                  <td className="px-4 py-2 border dark:border-gray-600 whitespace-pre-line">{draw.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
