import { useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useOINPRounds from "../../hooks/useOINPRounds";

dayjs.extend(relativeTime);

export default function LatestOINPDrawCard() {
  const { rounds, latestYear, loading } = useOINPRounds({ filterByLatestYear: true });

  const latestByStream = useMemo(() => {
    if (!rounds || rounds.length === 0) return [];

    const sorted = [...rounds].sort(
      (a, b) => new Date(b.date_issued) - new Date(a.date_issued)
    );

    const latestMap = {};
    for (const draw of sorted) {
      if (!latestMap[draw.stream]) {
        latestMap[draw.stream] = draw;
      }
    }
    return Object.values(latestMap);
  }, [rounds]);

  if (loading) return <div>Loading latest OINP draws...</div>;
  if (!rounds || rounds.length === 0)
    return <div>No draws available for year {latestYear || "N/A"}</div>;

  return (
    <div className="bg-white dark:bg-gray-900 border overflow-hidden p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {latestByStream.map((draw) => {
          const parseNumber = (val) => {
            if (!val) return null;
            if (typeof val === "number") return val;
            return Number(val.toString().replace(/,/g, ""));
          };

          const {
            id,
            stream,
            date_issued,
            number_of_invitations_issued,
            score_range,
            date_profiles_created,
            notes,
          } = draw;

          return (
            <div key={id} className="p-4 border bg-white dark:bg-gray-800">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <strong className="text-xl">{stream}</strong>
                <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full select-none">
                  Latest
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 text-sm">
                <div>
                  <strong>Date Issued:</strong> {date_issued} ({dayjs(date_issued).fromNow()})
                </div>
                <div>
                  <strong>Number of Invitations:</strong> {parseNumber(number_of_invitations_issued) ?? "N/A"}
                </div>
                <div>
                  <strong>Score Range:</strong> {score_range || "N/A"}
                </div>
                <div>
                  <strong>Profiles Created:</strong> {date_profiles_created || "N/A"}
                </div>
              </div>

              {notes && (
                <div className="mt-8 text-sm text-gray-500 dark:text-gray-300">
                  {notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
