export default function Filters({
  program,
  setProgram,
  programs,
  range,
  setRange,
  yAxisKey,
  setYAxisKey,
  yKeys,
}) {
  return (
    <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
      {/* Program selector */}
      <div className="flex items-center gap-2">
        <label className="text-gray-700 dark:text-gray-200 mb-1">Program:</label>
        <select
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          className="border p-1 dark:bg-gray-700 dark:text-gray-200"
        >
          {programs.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Year range buttons */}
      <div className="flex gap-2">
        {["1 Year", "2 Year", "All-time"].map((label) => (
          <button
            key={label}
            className={`px-3 py-1 ${
              range === label
                ? "bg-[#3182ce] text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setRange(label)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Y-Axis selector */}
      <div className="flex items-center gap-2">
        <label className="text-gray-700 dark:text-gray-200 mb-1">Y-Axis:</label>
        <select
          value={yAxisKey}
          onChange={(e) => setYAxisKey(e.target.value)}
          className="border p-1 dark:bg-gray-700 dark:text-gray-200"
        >
          {yKeys.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
