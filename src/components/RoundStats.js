import useRounds from "../hooks/useRounds";

function calculateStats(data, key) {
  const scores = data
    .map((d) => parseFloat(String(d[key]).replace(/,/g, "")))
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b);

  const totalDraws = scores.length;
  const meanScore = totalDraws ? (scores.reduce((a, b) => a + b, 0) / totalDraws).toFixed(2) : "-";
  const minScore = totalDraws ? scores[0] : "-";
  const maxScore = totalDraws ? scores[scores.length - 1] : "-";
  const medianScore = totalDraws
    ? (scores.length % 2 === 0
        ? ((scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2)
        : scores[Math.floor(scores.length / 2)]
      ).toFixed(2)
    : "-";

  return { totalDraws, meanScore, medianScore, minScore, maxScore };
}

export default function RoundStats({ program, range, yAxisKey }) {
  const { rounds } = useRounds(program, range);
  const stats = calculateStats(rounds, yAxisKey);

  return (
    <div className="bg-white dark:bg-gray-900 p-4 w-full max-w-xs h-[250px] overflow-y-auto">
      <h2 className="text-xl font-heading font-bold text-center mb-4">
        📈 Draw Statistics
      </h2>

      <div className="grid grid-cols-2 gap-y-2">
        <div>Total Draws:</div>
        <div className="text-right"><strong>{stats.totalDraws}</strong></div>

        <div>Mean Score:</div>
        <div className="text-right"><strong>{stats.meanScore}</strong></div>

        <div>Median Score:</div>
        <div className="text-right"><strong>{stats.medianScore}</strong></div>

        <div>Min Score:</div>
        <div className="text-right"><strong>{stats.minScore}</strong></div>

        <div>Max Score:</div>
        <div className="text-right"><strong>{stats.maxScore}</strong></div>
      </div>
    </div>

  );
}
