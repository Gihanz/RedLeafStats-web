import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import ReactECharts from "echarts-for-react";

export default function TotalInvitationsChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "ee_rounds"));
      const yearProgramMap = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        const { drawDate, drawSize, drawName } = data;
        if (!drawDate || !drawSize || !drawName) return;

        const year = new Date(drawDate).getFullYear().toString();
        const program = drawName;
        const size = Number(String(drawSize).replace(/,/g, ""));

        if (!yearProgramMap[year]) yearProgramMap[year] = {};
        if (!yearProgramMap[year][program]) yearProgramMap[year][program] = 0;

        yearProgramMap[year][program] += size;
      });

      setChartData(yearProgramMap);
    };

    fetchData();
  }, []);

  if (!chartData) return <p className="text-center p-4">Loading chart...</p>;

  const years = Object.keys(chartData).sort();

  // Get all unique program names
  const allPrograms = Array.from(
    new Set(
      Object.values(chartData)
        .flatMap((year) => Object.keys(year))
    )
  );

  // Filter programs with only non-zero values across all years
  const series = allPrograms
    .map((program) => {
      const values = years.map((year) => {
        const val = chartData[year]?.[program] || 0;
        return val === 0 ? null : val;
      });

      // Check if program has at least one non-null value
      if (values.every((v) => v === null)) return null;

      return {
        name: program,
        type: "bar",
        stack: "total",
        label: {
          show: true,
          formatter: (params) => (params.value ? params.value : ""),
        },
        emphasis: { focus: "series" },
        data: values,
      };
    })
    .filter(Boolean); // remove null entries

  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      top: 20,
      textStyle: {
        color: "#888",
      },
    },
    grid: {
      top: 120,
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: years,
    },
    yAxis: {
      type: "value",
      name: "Total Invitations",
    },
    series,
    color: [
      "#26374A", "#284162", "#3182ce", "#A0AEC0",
      "#D3080C", "#870305", "#6a727d", "#343c47"
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 shadow">
      <h2 className="text-xl font-bold mb-4">📊 Total Invitations by Program & Year</h2>
      <ReactECharts option={options} style={{ height: "700px", width: "100%" }} />
    </div>
  );
}
