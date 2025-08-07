import React, { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import dayjs from "dayjs";

// Extract first number from score range
function extractScore(scoreRange) {
  const match = scoreRange?.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

// Convert string to Title Case
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const GeneralRoundsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDraws = async () => {
      const roundsRef = collection(db, "oinp_rounds");
      const snapshot = await getDocs(roundsRef);
      const generalDraws = [];

      snapshot.forEach((doc) => {
        const draw = doc.data();
        if ((draw.notes || "").toLowerCase() === "general draw") {
          const score = extractScore(draw.score_range);
          const date = draw.date_issued;
          const stream = toTitleCase(draw.stream || "");

          if (score && date && stream) {
            generalDraws.push({
              stream,
              date,
              score,
            });
          }
        }
      });

      setData(generalDraws);
    };

    fetchDraws();
  }, []);

  const chartOption = useMemo(() => {
    const streams = [...new Set(data.map((item) => item.stream))];

    const grouped = streams.map((stream) => {
      const streamData = data
        .filter((item) => item.stream === stream)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      return {
        name: stream,
        type: "line",
        data: streamData.map((item) => [
          dayjs(item.date).format("YYYY-MM-DD"),
          item.score,
        ]),
        smooth: false,
        symbol: "circle",
        symbolSize: 10,
        lineStyle: {
          width: 2,
        },
      };
    });

    const allDates = [...new Set(data.map((item) => dayjs(item.date).format("YYYY-MM-DD")))].sort();
    const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;

    return {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        top: 20,
        type: isSmallScreen ? "scroll" : "plain",
        textStyle: {
            color: "#888",
        },
      },
      xAxis: {
        type: "category",
        name: "Date Issued",
        data: allDates,
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: "value",
        name: "Score",
      },
      series: grouped,
    };
  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-900 p-4 shadow">
      <h2 className="text-xl font-bold mb-4">📈 OINP General Draws</h2>
      <ReactECharts option={chartOption} style={{ height: 500 }} />
    </div>
  );
};

export default GeneralRoundsChart;