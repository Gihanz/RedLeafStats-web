import React, { useMemo, useRef, useEffect, useState } from "react";
import useRounds from "../../hooks/useEERounds";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

export default function RoundsCount({ program = "All", range = "All-time" }) {
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

  // Get month-year range from earliest to latest draw
  const monthRange = useMemo(() => {
    const drawDates = rounds
      .filter((r) => r.drawDate)
      .map((r) => new Date(r.drawDate));

    if (!drawDates.length) return [];

    const minDate = new Date(Math.min(...drawDates));
    const maxDate = new Date(Math.max(...drawDates));

    const results = [];
    let current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    while (current <= maxDate) {
      const key = `${current.getMonth() + 1}-${current.getFullYear()}`;
      results.push(key);
      current.setMonth(current.getMonth() + 1);
    }
    return results;
  }, [rounds]);

  const monthlyDrawData = useMemo(() => {
    const counts = {};

    rounds.forEach((round) => {
      if (!round.drawDate) return;

      const date = new Date(round.drawDate);
      const monthKey = `${date.getMonth() + 1}-${date.getFullYear()}`;

      if (!counts[monthKey]) {
        counts[monthKey] = { count: 0 };
      }

      counts[monthKey].count += 1;
    });

    return monthRange.map((month) => ({
      name: month,
      value: [month, counts[month]?.count || 0],
    }));
  }, [rounds, monthRange]);

  const options = useMemo(() => {
    return {
      tooltip: {
        trigger: "item",
        formatter: (params) => {
          const monthYear = params.name;
          const programs = params.data.programs || {};

          // Format the monthYear to "Month-YYYY" format
          const [month, year] = monthYear.split("-");
          const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ];
          const formattedMonthYear = `${monthNames[parseInt(month) - 1]}-${year}`;

          return `
            <strong>Date:</strong> ${formattedMonthYear}<br/>
            ${Object.entries(programs)
              .map(([p, n]) => `${p} - ${n}`)
              .join("<br/>")}
          `;
        },
        backgroundColor: isDark ? "#1f2937" : "#fff",
        textStyle: { color: isDark ? "#f9fafb" : "#111827" },
      },
      xAxis: {
        type: "category",
        data: monthRange,
        axisLabel: { 
          rotate: 45, 
          fontSize: 11,
          formatter: (value) => {
            const [month, year] = value.split("-");
            const monthNames = [
              "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            return `${monthNames[parseInt(month) - 1]}-${year}`;
          },
        },
        axisLine: {
          lineStyle: { color: isDark ? "#9ca3af" : "#374151" },
        },
      },
      yAxis: {
        name: 'Number of Draws',  
        nameLocation: 'middle',
        nameRotate: 90,
        nameGap: 40,
        type: "value",
        axisLabel: { fontSize: 10 },
        axisLine: {
          lineStyle: { color: isDark ? "#9ca3af" : "#374151" },
        },
        interval: 1,
      },
      series: [
        {
          name: "Draws",
          type: "line",
          data: monthlyDrawData.map((item) => item.value[1]),
          lineStyle: {
            color: isDark ? "#fbbf24" : "#f59e0b",
            width: 2,
          },
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
        },
      ],
    };
  }, [monthlyDrawData, monthRange, isDark]);

  return (
    <div className="bg-white dark:bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading font-bold">
          📈 Draws Conducted Over Time
        </h2>
      </div>
      {/* Add "Program Type" text at the top */}
      <div className="mb-4 text-center text-sm">
        Program Type: {program}
      </div>
      <div className="h-[400px] w-full">
        {monthlyDrawData.length > 0 && (
          <ReactECharts
            option={options}
            ref={chartRef}
            style={{ height: "100%", width: "100%" }}
          />
        )}
      </div>
    </div>
  );
}
