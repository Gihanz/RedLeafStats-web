import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { useMemo, useState } from "react";
import useRounds from "../../hooks/useEERounds";

const CRS_FIELDS = [
  { key: "dd17", range: "0-300" },
  { key: "dd16", range: "301-350" },
  { key: "dd15", range: "351-400" },
  { key: "dd14", range: "401-410" },
  { key: "dd13", range: "411-420" },
  { key: "dd12", range: "421-430" },
  { key: "dd11", range: "431-440" },
  { key: "dd10", range: "441-450" },
  { key: "dd9", range: "401-450", isAggregate: true },
  { key: "dd8", range: "451-460" },
  { key: "dd7", range: "461-470" },
  { key: "dd6", range: "471-480" },
  { key: "dd5", range: "481-490" },
  { key: "dd4", range: "491-500" },
  { key: "dd3", range: "451-500", isAggregate: true },
  { key: "dd2", range: "501-600" },
  { key: "dd1", range: "601-1200" },
];

export default function ScoreDistribution({ program, range }) {
  const { rounds } = useRounds(program, range);
  const [visible, setVisible] = useState({ Applicants: true, Aggregated: true });

  const toggleBar = (e) => {
    const clicked = e.value;
    const other = clicked === "Applicants" ? "Aggregated" : "Applicants";

    setVisible((prev) => {
      if (prev.Applicants && prev.Aggregated) {
        return { ...prev, [clicked]: false };
      }
      if (prev[clicked] && !prev[other]) {
        return { Applicants: true, Aggregated: true };
      }
      return { ...prev, [clicked]: !prev[clicked] };
    });
  };

  const { data, cutoffRangeLabel, cutoffScore } = useMemo(() => {
    if (!rounds.length) return { data: [], cutoffRangeLabel: "", cutoffScore: 0 };

    const latestRound = [...rounds].sort(
      (a, b) => new Date(b.drawDate) - new Date(a.drawDate)
    )[0];

    const getValue = (key) => Number(String(latestRound[key] || "0").replace(/,/g, ""));

    const base15 = getValue("dd15");
    const base16 = getValue("dd16");
    const base17 = getValue("dd17");
    const base9 = getValue("dd9");

    const baseForDd9 = base17 + base16 + base15;
    const baseForDd3 = baseForDd9 + base9;

    let cumulative = 0;
    let cutoffRangeLabel = "";
    const drawCRS = Number(latestRound?.drawCRS || 0);

    const chartData = CRS_FIELDS.map(({ key, range, isAggregate }) => {
      const applicants = getValue(key);
      let base = key === "dd9" ? baseForDd9 : key === "dd3" ? baseForDd3 : cumulative;
      if (!["dd9", "dd3"].includes(key)) cumulative += applicants;

      const [min, max] = range.split("-").map(Number);
      if (!cutoffRangeLabel && drawCRS >= min && drawCRS <= max) {
        cutoffRangeLabel = range;
      }

      return {
        range,
        base,
        applicants,
        isAggregate: key === "dd9" || key === "dd3",
      };
    });

    return { data: chartData, cutoffRangeLabel, cutoffScore: drawCRS };
  }, [rounds]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    const visibleBars = payload.filter(
      (entry) =>
        entry.value > 0 &&
        (entry.name === "Applicants"
          ? visible.Applicants
          : entry.name === "Aggregated"
          ? visible.Aggregated
          : false)
    );

    if (visibleBars.length === 0) return null;

    const bar = visibleBars[0];

    return (
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-3 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
        <p className="font-semibold">
          Range: <span className="font-normal">{label}</span>
        </p>
        <p className="font-semibold">
          No of {bar.name}: <span className="font-normal">{bar.value}</span>
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4">
      <h2 className="text-xl font-heading font-bold text-left mb-4">
        📈 Score Distribution
      </h2>
      <ResponsiveContainer width="100%" height={600}>
        <BarChart data={data} margin={{ top: 40, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" stroke="#888" />
          <YAxis
            stroke="#888"
            label={{
              value: "Number of Applicants",
              angle: -90,  
              position: "insideLeft", 
              offset: -15,
              style: { fill: "#888", fontSize: 12 }, 
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            onClick={toggleBar}
            payload={[
              { value: "Applicants", type: "square", id: "Applicants", color: "#3182ce" },
              { value: "Aggregated", type: "square", id: "Aggregated", color: "#073887" },
            ]}
          />

          {cutoffRangeLabel && (
            <ReferenceLine
              x={cutoffRangeLabel}
              stroke="red"
              strokeDasharray="3 3"
              label={{
                value: `Cutoff CRS: ${cutoffScore}`,
                position: "top",
                fill: "red",
                fontSize: 12,
              }}
            />
          )}

          <Bar dataKey="base" stackId="a" fill="transparent" name="Base" />

          {/* Applicants Bar */}
          <Bar
            dataKey="applicants"
            stackId="a"
            name="Applicants"
            fill={visible.Applicants ? "#3182ce" : "#acacad"}
            shape={({ x, y, width, height, payload }) => {
              if (payload.isAggregate || !visible.Applicants) return null;
              return (
                <g>
                  <rect x={x} y={y} width={width} height={height} fill="#3182ce" />
                  {payload.applicants > 0 && (
                    <text
                      className="fill-gray-900 dark:fill-white"
                      x={x + width / 2}
                      y={y - 5}
                      textAnchor="middle"
                      fontSize={12}
                    >
                      {payload.applicants}
                    </text>
                  )}
                </g>
              );
            }}
          />

          {/* Aggregated Bar */}
          <Bar
            dataKey="applicants"
            stackId="a"
            name="Aggregated"
            fill={visible.Aggregated ? "#073887" : "#acacad"}
            shape={({ x, y, width, height, payload }) => {
              if (!payload.isAggregate || !visible.Aggregated) return null;
              return (
                <g>
                  <rect x={x} y={y} width={width} height={height} fill="#073887" />
                  {payload.applicants > 0 && (
                    <text
                      className="fill-gray-900 dark:fill-white"
                      x={x + width / 2}
                      y={y - 5}
                      textAnchor="middle"
                      fontSize={12}
                    >
                      {payload.applicants}
                    </text>
                  )}
                </g>
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
