import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useState, useRef } from "react";
import useRounds from "../hooks/useRounds";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function RoundsChart({ program, range, yAxisKey }) {
  const [isSpline, setIsSpline] = useState(false);
  const chartRef = useRef(null);

  const { rounds } = useRounds(program, range);

  const data = rounds
    .filter((d) => d[yAxisKey] && d.drawDate)
    .map((d) => ({
      date: d.drawDate,
      [yAxisKey]: Number(String(d[yAxisKey]).replace(/,/g, "")),
    }))
    .filter((d) => !isNaN(d[yAxisKey]))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const exportAsImage = async () => {
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement("a");
    link.download = "chart.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const exportAsPDF = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, width - 20, height - 20);
    pdf.save("chart.pdf");
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-3 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
        <p className="font-semibold">Date: <span className="font-normal">{label}</span></p>
        {payload.map((entry, index) => (
          <p key={index} className="font-semibold">
            {entry.name}: <span className="font-normal">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }


  return (
    <div className="space-y-4">

      {/* Chart */}
      <div ref={chartRef} className="bg-white p-4 dark:bg-gray-900 shadow">
        <ResponsiveContainer width="100%" height={600}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(dateStr) => {
                const [year, month, day] = dateStr.split("-").map(Number);
                return new Date(year, month - 1, day).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                });
              }}
            />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend layout="horizontal" verticalAlign="top" align="center" />
            <Line
              type={isSpline ? "monotone" : "linear"}
              dataKey={yAxisKey}
              stroke="#073887"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Spline toggle + Export buttons */}
      <div className="flex justify-end gap-4 mb-2 items-center">
        <div className="flex gap-4 mb-2 items-center">
          <div className="flex items-center gap-2 pr-4">
            <span className="text-sm">Smooth Line</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isSpline}
                onChange={() => setIsSpline(!isSpline)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer peer-checked:bg-blue-600 transition-all duration-300 rounded-full"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white shadow rounded-full transform peer-checked:translate-x-5 transition-all duration-300"></div>
            </label>
          </div>

          <button
            onClick={exportAsImage}
            className="bg-[#26374a] hover:opacity-90 text-white px-3 py-1 text-sm"
          >
            Export PNG
          </button>
          <button
            onClick={exportAsPDF}
            className="bg-[#26374a] hover:opacity-90 text-white px-3 py-1 text-sm"
          >
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
