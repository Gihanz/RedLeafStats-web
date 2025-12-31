import { useMemo } from "react";
import { FaArrowDown } from "react-icons/fa6";
import useRounds from "../hooks/useEERounds";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function LatestDrawCard() {
  const { rounds } = useRounds();

  const latest = useMemo(() => {
    const sorted = [...rounds]
      .filter((r) => r.drawDate && r.drawCRS && r.drawSize && r.dd18)
      .sort((a, b) => new Date(b.drawDate) - new Date(a.drawDate));

    const current = sorted[0];
    if (!current) return null;

    const previousSameType = sorted.find(
      (r) => r.drawName === current.drawName && r.drawDate !== current.drawDate
    );

    const parseNumber = (val) =>
      typeof val === "string" ? Number(val.replace(/,/g, "")) : Number(val);

    const crsChange = previousSameType
      ? current.drawCRS - previousSameType.drawCRS
      : null;

    const poolChange =
      previousSameType &&
      !isNaN(parseNumber(current.dd18)) &&
      !isNaN(parseNumber(previousSameType.dd18))
        ? parseNumber(current.dd18) - parseNumber(previousSameType.dd18)
        : null;

    const drawSizeChange =
      previousSameType &&
      !isNaN(parseNumber(current.drawSize)) &&
      !isNaN(parseNumber(previousSameType.drawSize))
        ? parseNumber(current.drawSize) - parseNumber(previousSameType.drawSize)
        : null;

    return {
      ...current,
      crsChange,
      poolChange,
      drawSizeChange,
    };
  }, [rounds]);

  if (!latest) return null;

  const {
    drawNumber,
    drawDate,
    drawName,
    drawCRS,
    drawSize,
    dd18,
    crsChange,
    poolChange,
    drawSizeChange,
    drawNumberURL,
  } = latest;

  // Handle the click event to open the URL in a new tab
  const handleDrawNumberClick = () => {
    const baseURL = "https://www.canada.ca/en/immigration-refugees-citizenship";
    let cleanURL = drawNumberURL.replace(
      "<a href='/content/canadasite/en/immigration-refugees-citizenship",
      ""
    );
    cleanURL = cleanURL.split("'>")[0];
    const fullURL = `${baseURL}${cleanURL}`;
    window.open(fullURL, "_blank");
  };

  return (
    <div className="bg-white dark:bg-gray-900 overflow-hidden p-6 shadow-md">
      <div className="p-4 flex flex-col gap-4">
        {/* Draw Info */}
        <div className="flex flex-col mb-4">
          <div className="flex items-center justify-between">
            <div
              className="text-blue-600 font-semibold text-sm cursor-pointer"
              onClick={handleDrawNumberClick}
            >
              #{drawNumber}
            </div>
            <span className="ml-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Latest
            </span>
          </div>
          <div className="font-semibold text-lg mt-2 text-black dark:text-white">
            {drawName}
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            {drawDate} ({dayjs(drawDate).fromNow()})
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* CRS Score */}
          <div
            className={`flex-1 p-4 rounded-md ${
              crsChange > 0
                ? "bg-red-50 dark:bg-red-900/10"
                : "bg-green-50 dark:bg-green-900/10"
            }`}
          >
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-300 mb-1">
              <span>CRS Score</span>
              {typeof crsChange === "number" && crsChange !== 0 && (
                <span
                  className={`flex items-center ${
                    crsChange > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {crsChange > 0 ? "+" : ""}
                  {crsChange}
                  <FaArrowDown
                    className="ml-1"
                    style={{ transform: crsChange > 0 ? "rotate(180deg)" : "none" }}
                  />
                </span>
              )}
            </div>
            <div className="text-xl font-bold text-black dark:text-white">
              {drawCRS}
            </div>
          </div>

          {/* Draw Size */}
          <div
            className={`flex-1 p-4 rounded-md ${
              drawSizeChange > 0
                ? "bg-green-50 dark:bg-green-900/10"
                : "bg-red-50 dark:bg-red-900/10"
            }`}
          >
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-300 mb-1">
              <span>Draw Size</span>
              {typeof drawSizeChange === "number" && drawSizeChange !== 0 && (
                <span
                  className={`flex items-center ${
                    drawSizeChange > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {drawSizeChange > 0 ? "+" : ""}
                  {drawSizeChange}
                  <FaArrowDown
                    className="ml-1"
                    style={{ transform: drawSizeChange > 0 ? "rotate(180deg)" : "none" }}
                  />
                </span>
              )}
            </div>
            <div className="text-xl font-bold text-black dark:text-white">{drawSize}</div>
          </div>
        </div>

        {/* Pool Size: always below */}
        <div
          className={`p-4 rounded-md ${
            poolChange > 0
              ? "bg-red-50 dark:bg-red-900/10"
              : "bg-green-50 dark:bg-green-900/10"
          }`}
        >
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-300 mb-1">
            <span>Pool Size</span>
            {typeof poolChange === "number" && poolChange !== 0 && (
              <span
                className={`flex items-center ${
                  poolChange > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {poolChange > 0 ? "+" : ""}
                {poolChange}
                <FaArrowDown
                  className="ml-1"
                  style={{ transform: poolChange > 0 ? "rotate(180deg)" : "none" }}
                />
              </span>
            )}
          </div>
          <div className="text-xl font-bold text-black dark:text-white">{dd18}</div>
        </div>
      </div>
    </div>


  );
}
