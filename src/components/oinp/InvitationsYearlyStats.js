import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import ReactECharts from "echarts-for-react";

export default function InvitationsYearlyStats() {
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchSummaryData = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "oinp_rounds"),
          where("document_type", "==", "summary")
        );
        const snapshot = await getDocs(q);

        const yearData = {};

        snapshot.forEach((doc) => {
          const data = doc.data();
          const year = String(data.year);
          if (!yearData[year]) {
            yearData[year] = [];
          }
          yearData[year].push(...data.summaryItems);
        });

        setSummaries(yearData);

        const latestYear = Math.max(...Object.keys(yearData).map(Number));
        setActiveYear(String(latestYear)); // Ensure activeYear is a string
      } catch (err) {
        console.error("Error fetching summary data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  const handleTabClick = (year) => {
    setActiveYear(year);
  };

  const years = Object.keys(summaries).sort((a, b) => Number(b) - Number(a)); 

  const extractChartData = (items) => {
    return items
      .map((item) => {
        const numberMatch = item.match(/(\d[\d,]*)/);
        const value = numberMatch ? parseInt(numberMatch[1].replace(/,/g, ""), 10) : 0;
        const name = item.replace(/[\s–:-]*[\d,]+$/, "").trim();

        if (!name || value === 0) return null;

        return { name, value };
      })
      .filter(Boolean);
  };

  const getChartOption = (data, year) => ({
    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
    title: {
      text: `Invitations Distribution (${year})`,
      left: "center",
      textStyle: {
        color: isDarkMode ? "#f3f4f6" : "#374151",
        fontSize: 20,
      },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: isDarkMode ? "#374151" : "#f9fafb",
      textStyle: {
        color: isDarkMode ? "#e5e7eb" : "#111827",
      },
    },
    series: [
      {
        type: "pie",
        radius: ["30%", "60%"],
        center: ["50%", "50%"],
        itemStyle: {
          borderColor: isDarkMode ? "#1f2937" : "#fff",
          borderWidth: 1,
        },
        label: {
          color: isDarkMode ? "#e5e7eb" : "#111827",
          formatter: "{b}\n{c} ({d}%)",
        },
        labelLine: {
          lineStyle: {
            color: isDarkMode ? "#9ca3af" : "#6b7280",
          },
        },
        data,
      },
    ],
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4 text-sm text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border overflow-hidden p-6">
      {/* Tabs */}
      <div className="mb-4">
        <div className="flex space-x-6 border-b-2 pb-2 overflow-x-auto">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => handleTabClick(year)}
              className={`py-2 px-4 text-sm font-medium transition whitespace-nowrap ${
                activeYear === year
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Data and Chart */}
      {activeYear && summaries[activeYear] && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: Summary Text */}
          <div className="year-data p-4 bg-white dark:bg-gray-800 border">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-10">
              Invitations to Apply Issued in {activeYear}
            </h1>
            {summaries[activeYear].map((item, index) => (
              <div key={index} className="text-sm dark:text-gray-400 mb-2">
                {item}
              </div>
            ))}
          </div>

          {/* Right: Chart */}
          <div className="bg-white dark:bg-gray-800 p-4 border">
            <ReactECharts
              option={getChartOption(extractChartData(summaries[activeYear]), activeYear)}
              style={{ height: "400px", width: "100%" }}
              notMerge={true}
              lazyUpdate={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
