import React, { useMemo, useRef, useEffect, useState } from "react";
import useRounds from "../../hooks/useEERounds";
import ReactECharts from "echarts-for-react";

const CRS_FIELDS = [
  { key: "dd17", range: "0-300" },
  { key: "dd16", range: "301-350" },
  { key: "dd15", range: "351-400" },
  { key: "dd14", range: "401-410" },
  { key: "dd13", range: "411-420" },
  { key: "dd12", range: "421-430" },
  { key: "dd11", range: "431-440" },
  { key: "dd10", range: "441-450" },
  { key: "dd8", range: "451-460" },
  { key: "dd7", range: "461-470" },
  { key: "dd6", range: "471-480" },
  { key: "dd5", range: "481-490" },
  { key: "dd4", range: "491-500" },
  { key: "dd2", range: "501-600" },
  { key: "dd1", range: "601-1200" },
];

export default function CRSHeatmapChart({ program = "All", range = "1y" }) {
  const { rounds } = useRounds(program, range);
  const chartRef = useRef(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkDark = () =>
        setIsDark(document.documentElement.classList.contains("dark"));
      checkDark();

      const observer = new MutationObserver(checkDark);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => observer.disconnect();
    }
  }, []);

  const filteredRounds = useMemo(() => {
    const cutoffDate = new Date("2022-01-18");
    return rounds.filter((r) => new Date(r.drawDate) > cutoffDate);
  }, [rounds]);

  const heatmapData = useMemo(() => {
    const sorted = filteredRounds.sort(
      (a, b) => new Date(a.drawDate) - new Date(b.drawDate)
    );
    const dates = sorted.map((r) => r.drawDate);
    const rows = CRS_FIELDS.map((field, y) => {
      return sorted.map((round, x) => {
        const raw = round[field.key];
        const value = raw ? Number(String(raw).replace(/,/g, "")) : 0;
        return [x, y, value === 0 ? "-" : value];
      });
    });
    return {
      dates,
      ranges: CRS_FIELDS.map((f) => f.range),
      data: rows.flat(),
    };
  }, [filteredRounds]);

  const options = useMemo(() => {
    return {
      backgroundColor: isDark ? "#111827" : "#ffffff",
      tooltip: {
        position: "top",
        formatter: (params) => {
          if (!params.data) return "";
          const [x, y, value] = params.data;
          const date = heatmapData.dates[x];
          const range = heatmapData.ranges[y];
          return `
            <div>
              <strong>Date:</strong> ${date}<br/>
              <strong>CRS Range:</strong> ${range}<br/>
              <strong>Applicants:</strong> ${value === "-" ? 0 : value}
            </div>`;
        },
      },
      grid: {
        top: 50,
        left: 80,
        right: 30,
        bottom: 120,
      },
      xAxis: {
        type: "category",
        data: heatmapData.dates,
        splitArea: { show: true },
        axisLabel: {
          rotate: 90,
          fontSize: 10,
          interval: 0,
        },
      },
      yAxis: {
        name: "No of Applicants",
        nameLocation: "middle",
        nameRotate: 90,
        nameGap: 65,
        type: "category",
        data: heatmapData.ranges,
        axisLabel: { fontSize: 10 },
        splitArea: { show: true },
        axisLine: {
          lineStyle: {
            color: isDark ? "#9ca3af" : "#374151",
          },
        },
      },
      visualMap: {
        min: 0,
        max: 15000,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "0",
        inRange: {
          color: ["#a3c4e1", "#4f6b8b", "#26374a"],
        },
        textStyle: {
          color: isDark ? "#f3f4f6" : "#111827",
        },
      },
      series: [
        {
          name: "Applicants",
          type: "heatmap",
          data: heatmapData.data,
          label: {
            show: true,
            color: isDark ? "#f3f4f6" : "#f3f4f6",
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
  }, [heatmapData, isDark]);

  const exportChartToPNG = () => {
    if (chartRef.current) {
      const chartInstance = chartRef.current.getEchartsInstance();
      const dataUrl = chartInstance.getDataURL({
        type: "png",
        backgroundColor: isDark ? "#111827" : "#ffffff", 
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "heatmap.png";
      link.click();
    }
  };

  const exportChartToPDF = () => {
    alert("PDF export not supported natively, please export PNG instead.");
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-8">
      <h2 className="text-xl font-heading font-bold">
        📊 Applicants in Each CRS Range
      </h2>

      <div className="flex justify-end gap-4 mb-4">
        <button
          className="bg-[#26374a] hover:opacity-90 text-white px-3 py-1 text-sm"
          onClick={exportChartToPNG}
        >
          Export PNG
        </button>
        <button
          className="bg-[#26374a] hover:opacity-90 text-white px-3 py-1 text-sm"
          onClick={exportChartToPDF}
        >
          Export PDF
        </button>
      </div>

      <div className="w-full h-[650px]">
        {heatmapData.data.length > 0 && (
          <ReactECharts
            option={options}
            style={{ height: "100%", width: "100%" }}
            ref={chartRef}
            notMerge={true}
            lazyUpdate={true}
            theme={isDark ? "dark" : "light"}
          />
        )}
      </div>
    </div>
  );
}
